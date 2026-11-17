# Migracao: receitinhaspratodahora.shop -> educationworld.site

O dominio `receitinhaspratodahora.shop` vai expirar. Toda rota dele passa a
responder em `educationworld.site`, com os mesmos bytes.

Decidido em 2026-11-16 pelo Mateus:

- **Metodo:** fallback no nginx, sem duplicar arquivo.
- **Raiz:** a pagina de Libras continua em `educationworld.site/`; o 200 Receitas
  foi para `educationworld.site/200-receitas/`.

## Por que fallback e nao copia

A raiz do vhost do receitinha **e a raiz deste repo**, entao toda pasta comitada
e uma rota (61 delas). A raiz do vhost do educationworld e a pasta
`educationworld/`. Conferido: **nenhuma pasta colide** entre as duas - a unica
colisao e o `index.html` da raiz, que e justamente o caso tratado a parte.

Com o fallback, o nginx procura primeiro em `educationworld/` e, se nao achar,
procura na raiz do repo. Nada e duplicado, nada pode divergir, e **rota nova
criada no futuro ja nasce funcionando nos dois dominios**.

## O que ja esta no repo (so falta `git pull`)

- `educationworld/200-receitas/` - a pagina do 200 Receitas com os assets dela
  (index.html, styles.css, script.js e as 17 imagens que ela referencia).
  Verificado: toda referencia relativa resolve dentro da pasta.
- `deploy/probe-migracao.sh` - o verificador das 61 rotas.

## A mudanca no nginx: 3 edicoes

Arquivo: `/etc/nginx/sites-available/educationworld.site`

### 1. O `location /` passa a cair no fallback em vez de 404

```nginx
location / {
    try_files $uri $uri/ @receitinhas;   # era: =404
}
```

### 2. O bloco de cache por extensao TAMBEM precisa do fallback

**Esta e a edicao que mais importa e a que e facil esquecer.** O vhost do
educationworld tem um `location ~* \.(js|css|png|...)$` (medido: devolve
`Cache-Control: max-age=2592000, public, immutable`). Em nginx, **location
regex tem precedencia sobre `location /`**. Sem esta linha, as paginas
migradas carregam em HTML puro: o CSS, o JS e as imagens batem no bloco regex,
que procura so em `educationworld/`, e devolvem 404 - o fallback nem roda.

Dentro do bloco que ja existe, acrescente a linha `try_files`:

```nginx
location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    try_files $uri @receitinhas;         # <-- ACRESCENTAR
}
```

Nao troque o bloco inteiro pelo de cima: a lista de extensoes do seu arquivo
pode ser diferente. Acrescente so a linha, mantendo o resto como esta.

### 3. O bloco novo do fallback

```nginx
# Rotas herdadas de receitinhaspratodahora.shop (dominio expirando).
# O root aqui e a RAIZ do repo, que era o root daquele vhost.
location @receitinhas {
    root /var/www/html/200-receitas-cafe-manha;
    try_files $uri $uri/ =404;
}
```

> Se alguma rota de pasta responder **500** com
> `rewrite or internal redirection cycle` no error.log, troque o `try_files`
> deste bloco por esta forma, que nao faz checagem de diretorio:
> ```nginx
> try_files ${uri}index.html $uri/index.html $uri =404;
> ```

## Aplicar

```bash
cd /var/www/html/200-receitas-cafe-manha && git pull
cp /etc/nginx/sites-available/educationworld.site ~/educationworld.site.bak
# editar o arquivo com as 3 edicoes acima
nginx -t && systemctl reload nginx
```

Voltar atras, se preciso:

```bash
cp ~/educationworld.site.bak /etc/nginx/sites-available/educationworld.site
nginx -t && systemctl reload nginx
```

## Conferir

```bash
sh deploy/probe-migracao.sh
```

Compara as 61 rotas byte a byte nos dois dominios. **Rode enquanto o dominio
antigo ainda esta no ar** - e ele que serve de gabarito. O alvo e
`FALTANDO: 0  diferentes: 0`.

Antes da mudanca o resultado era `FALTANDO: 61` (medido em 2026-11-16).

## O que o fallback NAO resolve

### `/missa-explicada/` nao e pasta deste repo

Medido: responde o **app Laravel** (cookie `missa_explicada_session`, Inertia,
componente `NaoEncontrado`), nao arquivo estatico. Ha um bloco para esse prefixo
no vhost do receitinha, e ele precisa ser replicado a mao - copiar arquivo nao
resolve. As subrotas `/missa-explicada/obrigado/`, `/upsell/` e
`/gracias-latam/` sao estaticas e **essas** o fallback cobre.

Para montar esse bloco e preciso ver o vhost atual:

```bash
cat /etc/nginx/sites-available/receitinhaspratodahora.shop
```

### Exposicao que o fallback herda

A raiz do repo tem arquivos internos que **hoje ja sao publicos** no receitinha
(conferido, todos 200): `DOCUMENTO_REQUISITOS_COMPLETO.md`, `README.md`,
`BLUEPRINT_NOVA_LANDING_PAGE.md`, `start-server.bat` e os outros `.md`/`.bat`.
Com o fallback eles ficam publicos tambem no dominio novo - que e o que vai
receber trafego pago. Nada linka para eles. Para fechar, opcional:

```nginx
location ~* \.(md|bat)$ { deny all; }
```

O `.git` continua protegido: o bloco `location ~ /\.(?!well-known).*` e regex e
vence o `location /` (conferido: 403 nos dois dominios hoje).

### URLs duplicadas

Depois do fallback, `educationworld.site/themassexplained/`,
`/lifefitnessworld/`, `/eucharistic-miracle/` e `/educationworld/` passam a
responder tambem - sao pastas da raiz do repo que ja tem dominio proprio. Nao
quebra nada, mas sao URLs duplicadas do mesmo conteudo. Para evitar, opcional:

```nginx
location ^~ /educationworld/ { return 404; }
```

## Fora do repo: o que precisa ser trocado a mao

O nginx resolve as URLs. Estas nao estao no servidor nem no repo, e se ficarem
apontando para o dominio velho o comprador cai em pagina morta:

1. **Checkouts** - URL de obrigado/upsell/downsell configurada no painel de cada
   gateway: VIS, Kashpay, Hotmart, ggcheckout, Cakto. As 22 rotas de
   `/appmissaexplicada/` sao exatamente paginas de funil chamadas por essas
   configuracoes.
2. **Meta** - verificacao de dominio e dominio dos pixels.
3. **Anuncios ativos** - qualquer criativo com URL do receitinha.
4. **E-mails de entrega** - link do produto enviado ao comprador.
5. **Utmify** - dominio cadastrado.

Nao da para auditar isso do repo: o painel da VIS, pelo conector, nao expoe as
URLs de redirecionamento das ofertas.

Nos arquivos comitados o dominio antigo aparece **so em comentario** (3 casos,
nenhum funcional): `control/horta.js`, `control/huerta.js` e o cabecalho de
`educationworld/150-dinamicas-natalinas/`. Nenhuma pagina viva busca
`receitinhaspratodahora.shop/control/*.js` em tempo de execucao - conferido
tambem nas paginas da Hostinger (`lojaprodutosoficial.shop` e
`missaexplicadaes.shop`): nao citam o dominio.

## Atencao: duas versoes das Dinamicas de Natal no mesmo dominio

Depois do fallback, as duas copias passam a responder **no mesmo dominio**:

| URL | Versao | Checkout | Precos |
|---|---|---|---|
| `educationworld.site/150-dinamicas-natalinas/` | nova | VIS | R$ 34,90 / 17,90 / 9,90 |
| `educationworld.site/150-dinamicas-natal/` | antiga | ggcheckout | os antigos |

Antes elas estavam em dominios diferentes, o que ja era um risco de divergir.
Agora ficam lado a lado. Se a antiga nao serve mais, o jeito de aposentar sem
perder quem tem o link salvo:

```nginx
location ^~ /150-dinamicas-natal/ { return 301 /150-dinamicas-natalinas/; }
```

Fica a seu critério: nao apliquei porque isso muda o destino de uma pagina que
ainda esta vendendo na ggcheckout.

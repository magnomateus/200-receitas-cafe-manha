# Migracao: receitinhaspratodahora.shop -> educationworld.site

## URGENTE: o dominio JA saiu do ar (2026-11-18)

`receitinhaspratodahora.shop` **deixou de apontar para o Titan**. Hoje resolve
para `2.57.91.92`, que devolve uma pagina de parking com o titulo
`Your domain is expired`. A mudanca de DNS foi registrada hoje as 00:53 UTC.

O vhost continua intacto no servidor e responde normalmente quando se forca o
Host contra o IP do Titan - ou seja, **nada foi perdido no servidor**, so o DNS
saiu.

**O dominio parece recuperavel.** O registro (RDAP, consultado 2026-11-18) diz:

| campo | valor |
|---|---|
| registrar | HOSTINGER operations, UAB |
| status | `client transfer prohibited`, **`auto renew period`** |
| expiration | **2027-11-17** |

A data de expiracao ja foi empurrada para 2027 - o registro renovou. O que falta
e acertar com a Hostinger; enquanto nao acerta, eles mantem o parking.

**Por que vale a pena pagar mesmo querendo abandonar o dominio:** com ele no ar
e possivel apontar o DNS de volta para o Titan e trocar o vhost por `return 301`
para o endereco novo. Ai quem tem link salvo, e-mail de entrega antigo ou
anuncio ainda rodando **chega no lugar certo**. Sem isso, todo link antigo morre
na pagina de parking - e replicar as rotas no dominio novo nao salva ninguem que
so tem o link velho.

Esse vhost de 301 ja esta escrito e pronto para copiar:
`deploy/receitinhaspratodahora.shop.301.nginx`. **Aplicar so depois** de o
`probe-migracao.sh` dar `FALTANDO: 0` - invertendo a ordem, o 301 joga o
visitante num 404 do dominio novo.

**O que esta fora do ar agora:** as 64 rotas. Entre elas os dois Corpus Christi
(`/corpus-christi/` e `/corpus-christi-es/`), que **nao existem em nenhum outro
dominio** - no painel da VIS sao as ofertas 45 (15 campanhas) e 58 (6 campanhas).

## Decisoes (2026-11-16)

- **Metodo:** fallback no nginx, sem duplicar arquivo.
- **Raiz:** a pagina de Libras continua em `educationworld.site/`; o 200 Receitas
  foi para `educationworld.site/200-receitas/`.

## O inventario: 64 rotas, e 3 delas nao estao neste repo

A raiz do vhost do receitinha **e a raiz deste repo**, entao toda pasta comitada
e uma rota. Pasta local nao comitada da 404 no ar - o deploy e `git pull`, logo
`git ls-files` e o inventario autoritativo **do que vem do repo**.

**Mas tres rotas nao vinham do repo**, e so apareceram quando o vhost foi lido.
Nenhum comando de git as encontraria:

| Rota | De onde vem | Pagina |
|---|---|---|
| `/corpus-christi/` | `/var/www/html/corpus-christi/` | 150 Moldes de Tapetes para Corpus Christi (PT) |
| `/corpus-christi-es/` | `/var/www/html/corpus-christi-es/` | 150 Plantillas de Alfombras (ES) |
| `/eucaristia/` | `/var/www/html/eucaristia/` | Milagre Eucaristico |

E `/eucaristia/` **nao e a mesma pagina** de `eucaristiaexplicada.shop/`
(24.313 vs 27.169 bytes, pastas diferentes): sao duas copias que divergiram. Nao
da para resolver com um 301 de uma para a outra sem decidir qual vale.

## O que ja esta no repo (so falta `git pull`)

- `educationworld/200-receitas/` - a pagina do 200 Receitas com os assets dela.
  Verificado: toda referencia relativa resolve dentro da pasta.
- `deploy/probe-migracao.sh` - verificador das 64 rotas. Mede o gabarito
  **forcando o Host contra o IP do Titan**, ja que o DNS antigo saiu.

## Nao edite a mao: o arquivo pronto

Em 2026-11-18 o vhost do educationworld.site foi lido (`cat -n`, 51 linhas) e o
arquivo COMPLETO de substituicao esta em
`deploy/educationworld.site.nginx`. Ele ja tem as 3 edicoes da parte 1, os 4
blocos da parte 2 e mais duas coisas que so apareceram ao ler o arquivo de
verdade (bloco de PHP e deny de documentacao - ver a secao de achados abaixo).

```bash
cp /etc/nginx/sites-available/educationworld.site ~/educationworld.site.bak
cp /var/www/html/200-receitas-cafe-manha/deploy/educationworld.site.nginx    /etc/nginx/sites-available/educationworld.site
nginx -t && systemctl reload nginx
sh /var/www/html/200-receitas-cafe-manha/deploy/probe-migracao.sh
```

Esse arquivo passou no `nginx -t` de um nginx 1.26.3 de verdade - sintaxe,
ordem dos regex, `index` dentro de location nomeada, locations aninhadas nos
blocos `^~` e o `alias` com PHP, tudo aceito. O comportamento em execucao nao
foi medido; o cabecalho do arquivo diz qual e o unico ponto sensivel, qual e o
sintoma e qual e a linha de conserto.

As duas secoes abaixo continuam valendo como explicacao de CADA edicao - e
sao o que usar se um dia o vhost mudar e o arquivo pronto nao servir mais.

## nginx, parte 1: o fallback (3 edicoes)

Arquivo: `/etc/nginx/sites-available/educationworld.site`

### 1. O `location /` cai no fallback em vez de 404

```nginx
location / {
    try_files $uri $uri/ @receitinhas;   # era: =404
}
```

### 2. O bloco de cache por extensao TAMBEM precisa do fallback

**A edicao mais facil de esquecer e a que mais quebra.** O vhost do
educationworld tem um `location ~* \.(js|css|png|...)$` (medido: devolve
`Cache-Control: max-age=2592000, public, immutable`). Em nginx, **location regex
vence location de prefixo**. Sem esta linha, as paginas migradas carregam em
HTML puro: CSS, JS e imagens batem no regex, que procura so em `educationworld/`,
e devolvem 404 - o fallback nem roda.

Acrescente a linha ao bloco que **ja existe**, sem trocar o resto (a lista de
extensoes do seu arquivo pode ser diferente):

```nginx
location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    try_files $uri @receitinhas;         # <-- ACRESCENTAR
}
```

### 3. O bloco novo do fallback

```nginx
# Rotas herdadas de receitinhaspratodahora.shop.
# O root aqui e a RAIZ do repo, que era o root daquele vhost.
location @receitinhas {
    root /var/www/html/200-receitas-cafe-manha;
    try_files $uri $uri/ =404;
}
```

> Se alguma rota de pasta responder **500** com
> `rewrite or internal redirection cycle` no error.log, troque o `try_files`
> deste bloco pela forma abaixo, que nao faz checagem de diretorio:
>
> ```nginx
> try_files ${uri}index.html $uri/index.html $uri =404;
> ```

## nginx, parte 2: as 4 rotas que o fallback NAO cobre

Estas vem de pastas fora do repo, ou de outro programa. Sao adaptacoes dos
blocos do vhost antigo - **com duas diferencas obrigatorias**, explicadas abaixo
dos blocos.

```nginx
# ---- Corpus Christi PT e ES (pastas fora do repo) ----
location ^~ /corpus-christi {
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ /corpus-christi/index.html;

    location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~ /\.(?!well-known).* { deny all; }
}

location ^~ /corpus-christi-es {
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ /corpus-christi-es/index.html;

    location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~ /\.(?!well-known).* { deny all; }
}

# ---- Milagre Eucaristico (pasta fora do repo; difere do eucaristiaexplicada) ----
location = /eucaristia { return 301 /eucaristia/; }

location ^~ /eucaristia {
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ /eucaristia/index.html;

    location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~ /\.(?!well-known).* { deny all; }
}

# ---- Missa Explicada: o app Laravel, nao este repo ----
location ^~ /missa-explicada {
    alias /var/www/missa-explicada/public;
    index index.html index.php;
    try_files $uri $uri/ @missa;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $request_filename;
        include fastcgi_params;
    }
    location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~ /\.(?!well-known).* { deny all; }
}

location @missa {
    rewrite /missa-explicada/(.*)$ /missa-explicada/index.php?/$1 last;
}
```

### Diferenca 1: o `^~` e obrigatorio aqui

No vhost antigo esses blocos sao prefixo simples (`location /corpus-christi`) e
funcionam, porque **aquele vhost nao tem regex de assets no nivel do server**. O
do educationworld tem. Prefixo simples perde para regex, entao sem o `^~` os
assets dessas rotas cairiam no bloco de cache do educationworld e dariam 404.

### Diferenca 2: o `deny` de dotfiles tem de ser repetido DENTRO de cada bloco

`^~`, quando casa, **pula todas as locations regex** - inclusive o
`location ~ /\.(?!well-known).*` do nivel do server, que e o que fecha o `.git`.
Sem o deny aninhado, `/eucaristia/.git/` e `/corpus-christi/.git/` voltariam a
ser baixaveis. **Isso ja aconteceu neste servidor em 2026-09-25** (repo inteiro
publico em `receitinhaspratodahora.shop/.git/` e `/eucaristia/.git/`), e foi
corrigido justamente com esse bloco. Por isso ele esta repetido nos quatro.

O vhost antigo repete o deny em `/corpus-christi` e `/corpus-christi-es`, mas
**nao** em `/eucaristia` nem em `/missa-explicada`. La isso nao abre buraco
porque os blocos sao prefixo simples e o regex do server ainda vale. Aqui vale.

### Sobre o app Laravel sob um terceiro dominio

O `APP_URL` do app aponta para o dominio dele. Servido tambem sob
`educationworld.site/missa-explicada/`, links absolutos e redirecionamentos
gerados pelo app podem sair com o dominio errado. **Teste o fluxo de acesso**
(login e entrega) depois de aplicar, nao so a pagina abrir.

## Aplicar

```bash
cd /var/www/html/200-receitas-cafe-manha && git pull
cp /etc/nginx/sites-available/educationworld.site ~/educationworld.site.bak
# editar com as 3 edicoes da parte 1 + os blocos da parte 2
nginx -t && systemctl reload nginx
```

Voltar atras:

```bash
cp ~/educationworld.site.bak /etc/nginx/sites-available/educationworld.site
nginx -t && systemctl reload nginx
```

## Conferir

```bash
sh deploy/probe-migracao.sh
```

Compara as 64 rotas byte a byte. **Nao basta dar 200: pasta errada tambem da
200**, e e justamente o que acontecia com `/missa-explicada/upsell/`. Alvo:
`FALTANDO: 0  diferentes: 0`. Linha de base medida em 2026-11-18:
`FALTANDO: 64`.

O script tambem imprime para onde o DNS antigo aponta, para voce ver quando a
renovacao na Hostinger surtir efeito.

## Dois achados ao ler o vhost novo (2026-11-18)

**1. O fallback sozinho vazaria segredo.** O repo tem 3 arquivos `.php`, todos
em `videopack/`:

| Arquivo | |
|---|---|
| `videopack/vp-config.php` | contem `$DASH_KEY`, `$IP_SALT`, `$__secret` |
| `videopack/track.php` | endpoint de tracking |
| `videopack/dashboard/index.php` | painel, protegido pela DASH_KEY |

O vhost do educationworld **nao tem handler de PHP** - o do receitinha tem, no
nivel do server. Sem acrescentar um, `GET /videopack/vp-config.php` passaria
pelo `location /`, cairia no fallback, o arquivo existiria na raiz do repo e o
nginx o entregaria **como texto**: a chave do painel e o salt de IP, legiveis
por qualquer um. Esse e o achado mais serio desta rodada, e nao aparecia em
nenhuma medicao de rota - as 64 rotas do probe sao paginas, nenhuma e `.php`.
O bloco `location ~ \.php$` do arquivo pronto resolve: o PHP executa, como no
dominio antigo, e o fonte nunca sai.

**2. O `^~ /missa-explicada` tambem e protecao, nao so compatibilidade.** O
repo tem `missa-explicada/entregavel/pdfs/` com os PDFs entregaveis (5 deles
com nome acentuado). No dominio antigo essa pasta fica escondida atras do
`alias`, e `/missa-explicada/entregavel/` da 404 - medido. Sem o bloco, o
fallback serviria esses PDFs como download publico no dominio novo. Ou seja: o
bloco evita de uma vez servir upsell desatualizado E entregar o produto de
graca.

Os `.md` e `.bat` da raiz do repo (`README`, `DOCUMENTO_REQUISITOS`,
`BLUEPRINT`, `start-server.bat`) e a pasta `deploy/` inteira entram na mesma
conta: no dominio antigo ja eram publicos, mas o dominio novo e o que vai
receber trafego pago, e `deploy/` agora tem o runbook e o vhost, que citam
caminhos do servidor, IP e socket. Por isso o arquivo pronto ja vem com o deny
desses arquivos - e com `.txt` deliberadamente FORA da lista, porque existem 9
`robots.txt` no repo.

## Correcoes ao que eu tinha dito antes

**1. O fallback NAO cobre as subrotas de `/missa-explicada/`.** Eu havia dito
que cobria. Medido contra o servidor:

| Rota | servidor vs arquivo deste repo |
|---|---|
| `/missa-explicada/obrigado/` | iguais |
| `/missa-explicada/upsell/` | **diferentes** |
| `/missa-explicada/gracias-latam/` | **nao existe no repo** |

O prefixo todo e `alias /var/www/missa-explicada/public`, entao essas paginas
moram no diretorio do app. Sem o bloco da parte 2, o fallback serviria a versao
**desatualizada** do upsell que esta no repo, calada. A pasta `missa-explicada/`
deste repo nunca foi servida naquele dominio.

**2. O `sub_filter` do `/afiliado/` e codigo morto.** O vhost antigo injeta um
`history.replaceState` no `</head>`. Medido na resposta: **nao injeta**. O
motivo e o `index index.html` dentro de um `location = /afiliado/`: o `index`
faz um redirecionamento interno para `/afiliado/index.html`, que ja nao casa com
a location de igualdade exata, e cai no `location /` - onde nao ha `sub_filter`.
Esta assim desde sempre. Por isso **nao replicar esse bloco**: o fallback simples
entrega exatamente o mesmo comportamento de hoje.

**3. A raiz do `/missa-explicada/` ja da 404 no dominio ANTIGO.** Medido com o
Host forcado contra o Titan, em 2026-11-18:

| Rota | antigo | novo |
|---|---|---|
| `/missa-explicada/` | **404** | 404 |
| `/missa-explicada/entregavel/` | **404** | 404 |
| `/missa-explicada/obrigado/` | 200 | 404 |
| `/missa-explicada/upsell/` | 200 | 404 |

Quem responde naquele prefixo, sob aquele dominio, e so o arquivo estatico das
subpastas - a raiz do app nao atende ali. Duas consequencias: o bloco do `alias`
na parte 2 serve para as subrotas, e **nao e para esperar** que
`educationworld.site/missa-explicada/` abra o app. Nao abria no dominio antigo
tampouco, entao isso nao e regressao da migracao. O app de verdade continua nos
dominios dele, que este trabalho nao toca. Se a ideia for abrir o app por este
dominio novo, isso e outro trabalho: passa por `APP_URL` e pelo dominio
cadastrado no app, nao por nginx.

## Exposicao que o fallback herda

A raiz do repo tem arquivos internos que **ja eram publicos** no receitinha
(todos 200): `DOCUMENTO_REQUISITOS_COMPLETO.md`, `README.md`,
`BLUEPRINT_NOVA_LANDING_PAGE.md`, `start-server.bat` e os outros `.md`/`.bat`.
Com o fallback ficam publicos no dominio novo, que e o que recebe trafego pago.
Nada linka para eles. Opcional:

```nginx
location ~* \.(md|bat)$ { deny all; }
```

## URLs duplicadas

Depois do fallback, `educationworld.site/themassexplained/`,
`/lifefitnessworld/`, `/eucharistic-miracle/` e `/educationworld/` passam a
responder tambem - pastas da raiz do repo que ja tem dominio proprio. Nao quebra
nada, mas sao URLs duplicadas. Opcional:

```nginx
location ^~ /educationworld/ { return 404; }
```

## Fora do repo: o que precisa ser trocado a mao

O nginx resolve as URLs. Estas nao estao no servidor nem no repo, e **ja estao
quebradas desde hoje**:

1. **Checkouts** - URL de obrigado/upsell/downsell no painel de cada gateway:
   VIS, Kashpay, Hotmart, ggcheckout, Cakto. As 22 rotas de
   `/appmissaexplicada/` sao exatamente paginas chamadas por essas configuracoes.
2. **Meta** - verificacao de dominio e dominio dos pixels.
3. **Anuncios ativos** - qualquer criativo com URL do receitinha.
4. **E-mails de entrega** - link do produto enviado ao comprador.
5. **Utmify** - dominio cadastrado.

Nao da para auditar isso do repo: o conector da VIS nao expoe as URLs de
redirecionamento das ofertas.

Nos arquivos comitados o dominio antigo aparece **so em comentario** (3 casos,
nenhum funcional). Nenhuma pagina viva busca
`receitinhaspratodahora.shop/control/*.js` em runtime - conferido tambem nas
paginas da Hostinger (`lojaprodutosoficial.shop` e `missaexplicadaes.shop`):
nao citam o dominio.

## Atencao: duas versoes das Dinamicas de Natal no mesmo dominio

Depois do fallback as duas copias respondem **no mesmo dominio**:

| URL | Versao | Checkout | Precos |
|---|---|---|---|
| `educationworld.site/150-dinamicas-natalinas/` | nova | VIS | R$ 34,90 / 17,90 / 9,90 |
| `educationworld.site/150-dinamicas-natal/` | antiga | ggcheckout | os antigos |

Antes estavam em dominios diferentes. Para aposentar a antiga sem perder quem
tem o link salvo:

```nginx
location ^~ /150-dinamicas-natal/ { return 301 /150-dinamicas-natalinas/; }
```

Nao apliquei: isso muda o destino de uma pagina que ainda vende na ggcheckout.

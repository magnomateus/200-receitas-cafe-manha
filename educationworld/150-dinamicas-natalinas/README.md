# 150 Dinâmicas Natalinas — rota do educationworld

**No ar em:** `https://educationworld.site/150-dinamicas-natalinas/`

O vhost `educationworld.site` tem `root` apontando para a pasta `educationworld/`
do repo, então esta subpasta virou rota sozinha — não precisou mexer no nginx.
Deploy é o `git pull` de sempre no Titan.

## De onde veio

Cópia de `/150-dinamicas-natal/` (que rodava em
`receitinhaspratodahora.shop/150-dinamicas-natal/`). **A original continua no
repo e continua na ggcheckout, com os preços antigos.** Se as duas rodarem ao
mesmo tempo, vão divergir em silêncio — decidir qual fica.

Ficaram de fora da cópia, porque nada as referencia (conferido por grep em
html/css/js): `static/vsl.mp4` (23 MB), `images/capa-produto.png`,
`upsell/capa-produto.png` e `test-popup.html`. A VSL que a página usa é um
iframe do Vimeo (`1143326288`), não o arquivo local.

## Checkouts (VIS)

| Oferta | Preço | Onde |
|---|---|---|
| `150-dinamicas-natalinas-premium` | R$ 34,90 | botão **GARANTIR PLANO PREMIUM** |
| `150-dinamicas-natalinas-exclusivo` | R$ 17,90 | popup, botão **QUERO ESTA OFERTA!** |
| `150-dinamicas-natalinas-basico` | R$ 9,90 | popup, link **Quero o básico** |

Todos em `https://visplatform.pro/checkout-fast/<oferta>`.

**O botão do plano básico não vai para o checkout** — ele abre o popup. Quem
recusa o popup é que chega ao checkout básico. É o desenho da página, não um bug.

O card premium perdeu a linha "ou 3x de R$9,97" e o "Menos de R$10,00 por mês!".
Os dois eram cálculos do preço antigo (9,97 × 3 = 29,91) e nenhuma outra página
com checkout da VIS neste repo anuncia parcelamento. Se a VIS parcela, é só
dizer o valor e eu recoloco.

## Rastreamento

| Peça | Situação |
|---|---|
| `<meta name="vis-product" content="150-dinamicas-natalinas">` + snippet `tid=19` | **adicionado aqui** |
| Utmify pixel `693a40362c9834c426c2d82d` + script de UTMs | já vinha da original |
| Meta Pixel | **não existe** |

O snippet da VIS não estava na original — foi acrescentado, no mesmo padrão do
`pescaria/`, porque sem ele a página manda para o checkout da VIS e a VIS não
registra a visita. Verificado: com o snippet ativo os três links passam a sair
com `_vid=<uuid>`, que é o id que liga a visita à venda no painel.

**Confirmar no dashboard da VIS** se o produto está cadastrado com o slug
`150-dinamicas-natalinas`. Ele foi deduzido dos checkouts, no mesmo padrão do
pescaria (`manual-do-pescador` ⟶ `manual-do-pescador-premium`).

As UTMs chegam ao checkout pelo script do Utmify, não por decorador próprio —
igual às outras páginas com checkout da VIS neste repo. Testado: entrando com
`?utm_source=facebook&utm_campaign=natal26&utm_medium=cpc`, o link do premium sai
com os três.

**A página não tem Meta Pixel nenhum** — logo não tem `PageView`, `ViewContent`
nem `InitiateCheckout`, e nem a folga de 400ms que as outras 14 landings
receberam. Para colocar, falta saber qual pixel usar.

## Ainda na ggcheckout

Não foram pedidos links novos para estas duas:

- `back-redirect/` — R$ 7,90, **alcançável pelo botão VOLTAR do navegador**, então
  está no caminho de um visitante real
- `upsell/` — pós-compra, quem manda para lá é o gateway

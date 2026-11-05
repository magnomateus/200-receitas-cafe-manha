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

Nada disso existia na página original — tudo foi acrescentado nesta rota.

| Peça | Valor |
|---|---|
| Meta Pixel | `2275808619647912` — `PageView`, `ViewContent`, `InitiateCheckout` |
| Snippet da VIS | `tid=19`, `pk=01M6MW8PHFTG6AS7SQ90KCVVN4` |
| Decorador de origem | `xcod` → `sck`, `utm_source` → `src` |
| Utmify | `693a40362c9834c426c2d82d` — já vinha da original |

O bloco de eventos fica no fim do `<body>`, com o comentário explicando as duas
diferenças em relação ao padrão das outras páginas:

**1. Cada oferta manda o seu preço.** O `InitiateCheckout` lê o preço do slug do
checkout (`-premium` 34,90, `-exclusivo` 17,90, `-basico` 9,90). Mandar um valor
único faria o Meta otimizar para o número errado. O `ViewContent` usa 34,90, a
oferta principal.

**2. A saída para o checkout é adiada em 400ms.** Um `track` comum do `fbq` sai
como GET de **imagem**, que o navegador cancela ao trocar de documento — sem a
folga o evento se perde na maioria dos cliques. Medido nas outras landings em
produção: sem folga 1 em 8 chegava, com 400ms chega 10 em 10. A
`halloween-recipes` ainda não tem essa folga.

**Regra de ouro: o comprador sempre chega ao checkout.** Se o `fbq` explodir, ou
se o clique for de um tipo que não descarrega a página (ctrl+clique, botão do
meio, `target` diferente), nada é adiado nem interceptado.

### O que foi verificado

Teste em `D:\projetos\teste-upsell\testa-natal-pixel.js` (18 checagens, todas
passando). O `fbevents.js` real não manda nada em navegador automatizado — bot
blocking da Meta — então o teste troca `window.fbq` por um gravador e confere o
que a página **pede**:

- na carga: `init` com o pixel certo, `PageView`, e `ViewContent` 1× com
  `value: 34.9, currency: BRL`
- os três cliques disparam `InitiateCheckout` com 34,90 / 17,90 / 9,90, cada um
  indo para o slug certo, adiando 433–516ms
- entrando com `?utm_source=facebook&utm_campaign=natal26&xcod=ABC123`, o destino
  sai com `src=facebook`, `sck=ABC123` e a `utm_campaign` preservada
- ctrl+clique rastreia e **não** é sequestrado
- `fbq` explodindo: navega em ~148ms

Estrutura e preços: `testa-natal.js` (14 checagens).

### Ainda sem rastreamento

`back-redirect/` e `upsell/` continuam só com Utmify — sem Meta Pixel e sem VIS.
O `back-redirect/` está no caminho de um visitante real (botão VOLTAR).

## Ainda na ggcheckout

Não foram pedidos links novos para estas duas:

- `back-redirect/` — R$ 7,90, **alcançável pelo botão VOLTAR do navegador**, então
  está no caminho de um visitante real
- `upsell/` — pós-compra, quem manda para lá é o gateway

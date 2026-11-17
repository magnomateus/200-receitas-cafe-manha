#!/bin/sh
# Verifica a migracao receitinhaspratodahora.shop -> educationworld.site.
#
#   sh deploy/probe-migracao.sh
#
# Para CADA rota do dominio antigo, busca a mesma rota no dominio novo e
# compara o conteudo byte a byte (sha256). Nao basta dar 200: uma pagina
# servida da pasta errada tambem da 200.
#
#   IGUAL      os dois dominios devolvem exatamente os mesmos bytes
#   DIFERENTE  os dois responderam, mas o conteudo nao e o mesmo
#   FALTA      o dominio novo nao tem essa rota  <- e o que falta corrigir
#   SO-NOVO    o antigo caiu (dominio expirado) e o novo responde
#
# Rode ANTES de deixar o dominio expirar, para a coluna do antigo existir.
#
# A lista de rotas saiu de `git ls-files` (so o que o servidor realmente tem:
# pasta local nao comitada da 404 no ar e nao entra aqui).
VELHO="https://receitinhaspratodahora.shop"
NOVO="https://educationworld.site"

ok=0; falta=0; difere=0
pega() { curl -s -m 25 -o "$2" -w "%{http_code}" "$1" 2>/dev/null; }

while read -r r; do
  [ -z "$r" ] && continue
  a=$(mktemp); b=$(mktemp)
  ca=$(pega "$VELHO$r" "$a")
  cb=$(pega "$NOVO$r" "$b")
  ha=$(sha256sum "$a" 2>/dev/null | cut -c1-16)
  hb=$(sha256sum "$b" 2>/dev/null | cut -c1-16)

  if [ "$cb" != "200" ]; then
    printf 'FALTA      %-3s -> %-3s  %s\n' "$ca" "$cb" "$r"; falta=$((falta+1))
  elif [ "$ca" != "200" ]; then
    printf 'SO-NOVO    %-3s -> %-3s  %s\n' "$ca" "$cb" "$r"; ok=$((ok+1))
  elif [ "$ha" = "$hb" ]; then
    printf 'IGUAL      %-3s -> %-3s  %s\n' "$ca" "$cb" "$r"; ok=$((ok+1))
  else
    printf 'DIFERENTE  %-3s -> %-3s  %s   (%s vs %s)\n' "$ca" "$cb" "$r" "$ha" "$hb"
    difere=$((difere+1))
  fi
  rm -f "$a" "$b"
done <<'ROTAS_FIM'
/150-dinamicas-natal/
/150-dinamicas-natal/back-redirect/
/150-dinamicas-natal/upsell/
/afiliado/
/appmissaexplicada/downsell-br/
/appmissaexplicada/downsell-frances/
/appmissaexplicada/downsell-ingles/
/appmissaexplicada/downsell-italiano/
/appmissaexplicada/downsell-latam/
/appmissaexplicada/downsell2-frances/
/appmissaexplicada/downsell2-ingles/
/appmissaexplicada/downsell2-italiano/
/appmissaexplicada/downsell2-latam/
/appmissaexplicada/gracias-frances/
/appmissaexplicada/gracias-ingles/
/appmissaexplicada/gracias-italiano/
/appmissaexplicada/upsell-br/
/appmissaexplicada/upsell-frances/
/appmissaexplicada/upsell-ingles/
/appmissaexplicada/upsell-italiano/
/appmissaexplicada/upsell-latam/
/appmissaexplicada/upsell2-frances/
/appmissaexplicada/upsell2-ingles/
/appmissaexplicada/upsell2-ingles-lab/
/appmissaexplicada/upsell2-italiano/
/appmissaexplicada/upsell2-latam/
/eucharistic-miracle/
/horta/
/huerta/
/jogos/
/jogos/back-redirect/
/lifefitnessworld/
/lifefitnessworld/en/
/lifefitnessworld/en/privacy/
/lifefitnessworld/privacy/
/mass-explained/
/missa-explicada/
/missa-explicada-br/
/missa-explicada-en/
/missa-explicada-ital/
/missa-explicada/entregavel/
/missa-explicada/obrigado/
/missa-explicada/upsell/
/pescaria/
/prompt/
/themassexplained/
/themassexplained/attivitabibliche/
/themassexplained/google/
/themassexplained/kashpay/
/themassexplained/kashpay-upsell/
/themassexplained/kashpay-upsell-prayer/
/themassexplained/kashpay-upsell2/
/themassexplained/lamessaspiegata/
/themassexplained/lamesseexpliquee/
/themassexplained/misaexplicada/
/videopack/
/control/horta.js
/control/huerta.js
/control/mx.js
/styles.css
/script.js
ROTAS_FIM

echo
echo "iguais/ok: $ok   diferentes: $difere   FALTANDO: $falta"
if [ "$falta" -eq 0 ] && [ "$difere" -eq 0 ]; then
  echo "MIGRACAO COMPLETA"
else
  echo "AINDA HA ROTA PENDENTE"
fi

# A raiz e um caso a parte: receitinha/ = 200 Receitas, educationworld/ = Libras.
# A pagina do 200 Receitas foi para /200-receitas/ (decidido em 2026-11-16).
echo
echo "--- raiz (tratada a parte, nao e para ser igual) ---"
for par in "$VELHO/|200 Receitas (o que sai do ar com o dominio)" \
           "$NOVO/|Libras EN (fica como esta)" \
           "$NOVO/200-receitas/|destino do 200 Receitas" \
           "$NOVO/200-receitas/styles.css|asset da copia"; do
  u=$(echo "$par" | cut -d'|' -f1); d=$(echo "$par" | cut -d'|' -f2)
  printf '  %-3s  %-55s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$u")" "$u" "$d"
done

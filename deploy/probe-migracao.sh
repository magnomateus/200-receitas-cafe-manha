#!/bin/sh
# Verifica a migracao receitinhaspratodahora.shop -> educationworld.site.
#
#   sh deploy/probe-migracao.sh
#
# Para CADA rota do dominio antigo, busca a mesma rota no dominio novo e
# compara o conteudo byte a byte (sha256). Nao basta dar 200: uma pagina
# servida da pasta errada tambem da 200.
#
#   IGUAL      os dois devolvem exatamente os mesmos bytes
#   DIFERENTE  os dois responderam, mas o conteudo nao e o mesmo
#   PARIDADE   os dois devolvem o MESMO codigo que nao e 200 - 404 nos dois,
#              por exemplo. NAO e pendencia: o dominio novo esta fiel ao
#              antigo, e e isso que se queria. /missa-explicada/ e assim.
#   FALTA      o dominio novo nao tem essa rota  <- e o que falta corrigir
#   SO-NOVO    o vhost antigo nao responde mais e o novo responde
#   ERRO-REDE  o curl nao completou (codigo 000). Nao e rota faltando, e
#              falha transitoria. Rode de novo antes de investigar.
#
# IMPORTANTE: o DNS de receitinhaspratodahora.shop JA saiu do Titan
# (2026-11-18 passou a resolver para 2.57.91.92, parking "Your domain is
# expired"). Por isso o gabarito e medido FORCANDO o Host contra o IP do
# Titan: o vhost antigo continua lá e responde 200. Se o vhost for removido
# do servidor, o gabarito se perde e este script deixa de servir.
#
# A lista tem 64 rotas. As de pasta saem de `git ls-files` (so o que o
# servidor tem: pasta local nao comitada da 404 no ar). As TRES ultimas
# rotas de pagina - /corpus-christi/, /corpus-christi-es/ e /eucaristia/ -
# NAO estao neste repo: moram em /var/www/html/ e so apareceram quando o
# vhost foi lido. Nenhum comando de git as encontraria.
VELHO="https://receitinhaspratodahora.shop"
NOVO="https://educationworld.site"
IP_TITAN="206.189.219.208"

ok=0; falta=0; difere=0; rede=0
# --retry cobre a falha transitoria: numa rodada /150-dinamicas-natal/ deu 000
# e na medicao seguinte deu 200 com os mesmos 23706 bytes do dominio antigo.
pega_velho() { curl -s -m 25 --retry 2 --retry-delay 1 --resolve "receitinhaspratodahora.shop:443:$IP_TITAN" -o "$2" -w "%{http_code}" "$1" 2>/dev/null; }
pega_novo()  { curl -s -m 25 --retry 2 --retry-delay 1 -o "$2" -w "%{http_code}" "$1" 2>/dev/null; }

while read -r r; do
  [ -z "$r" ] && continue
  a=$(mktemp); b=$(mktemp)
  ca=$(pega_velho "$VELHO$r" "$a")
  cb=$(pega_novo  "$NOVO$r"  "$b")
  ha=$(sha256sum "$a" 2>/dev/null | cut -c1-16)
  hb=$(sha256sum "$b" 2>/dev/null | cut -c1-16)

  if [ "$ca" = "000" ] || [ "$cb" = "000" ]; then
    printf 'ERRO-REDE  %-3s -> %-3s  %s   (curl nao completou; rode de novo)\n' "$ca" "$cb" "$r"
    rede=$((rede+1))
  elif [ "$ca" = "$cb" ] && [ "$cb" != "200" ]; then
    printf 'PARIDADE   %-3s -> %-3s  %s   (mesmo codigo nos dois; fiel)\n' "$ca" "$cb" "$r"
    ok=$((ok+1))
  elif [ "$cb" != "200" ]; then
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
/corpus-christi/
/corpus-christi-es/
/eucaristia/
/control/horta.js
/control/huerta.js
/control/mx.js
/styles.css
/script.js
ROTAS_FIM

echo
echo "iguais/ok: $ok   diferentes: $difere   FALTANDO: $falta   erro de rede: $rede"
if [ "$falta" -eq 0 ] && [ "$difere" -eq 0 ] && [ "$rede" -eq 0 ]; then
  echo "MIGRACAO COMPLETA"
elif [ "$falta" -eq 0 ] && [ "$difere" -eq 0 ]; then
  echo "SO ERRO DE REDE - rode de novo, nao ha rota pendente"
else
  echo "AINDA HA ROTA PENDENTE"
fi

# ---------------------------------------------------------------------------
# POR QUE esta faltando. Quando falta tudo, a causa e uma de duas - e elas se
# resolvem de formas diferentes, entao vale distinguir:
#
#   /200-receitas/ e pasta deste repo, dentro de educationworld/ (que ja e a
#   raiz do vhost novo). Depende SO do `git pull`.
#
#   /jogos/ mora na raiz do repo, FORA de educationworld/. Depende SO do
#   fallback @receitinhas no nginx.
#
# Logo: 200-receitas 404 -> falta o pull. 200-receitas 200 e jogos 404 ->
# o pull foi feito e falta o nginx.
# ---------------------------------------------------------------------------
if [ "$falta" -gt 0 ]; then
  c200=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$NOVO/200-receitas/")
  cjog=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$NOVO/jogos/")
  echo
  echo "--- por que esta faltando ---"
  if [ "$c200" != "200" ]; then
    echo "  /200-receitas/ da $c200: o servidor ainda NAO fez o git pull."
    echo "    cd /var/www/html/200-receitas-cafe-manha && git pull"
  elif [ "$cjog" != "200" ]; then
    echo "  /200-receitas/ da 200, entao o git pull foi feito."
    echo "  /jogos/ da $cjog, entao o fallback NAO esta de pe: ou o vhost"
    echo "  nao foi editado, ou foi editado e nao houve reload."
    echo "    grep -n receitinhas /etc/nginx/sites-available/educationworld.site"
    echo "    nginx -t && systemctl reload nginx"
  else
    echo "  /200-receitas/ e /jogos/ respondem: pull e fallback estao de pe."
    echo "  O que falta e rota a rota - olhar as linhas FALTA acima."
  fi
fi

# A raiz e um caso a parte: receitinha/ = 200 Receitas, educationworld/ = Libras.
# A pagina do 200 Receitas foi para /200-receitas/ (decidido em 2026-11-16).
echo
echo "--- raiz (tratada a parte, nao e para ser igual) ---"
printf '  %-3s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -m 20 --resolve "receitinhaspratodahora.shop:443:$IP_TITAN" "$VELHO/")" "$VELHO/  (200 Receitas, so no vhost antigo)"
printf '  %-3s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$NOVO/")" "$NOVO/  (Libras EN, fica como esta)"
printf '  %-3s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$NOVO/200-receitas/")" "$NOVO/200-receitas/  (destino do 200 Receitas)"
printf '  %-3s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$NOVO/200-receitas/styles.css")" "$NOVO/200-receitas/styles.css  (asset da copia)"

echo
echo "--- o DNS do dominio antigo aponta para onde? ---"
echo "  esperado enquanto nao for renovado: 2.57.91.92 (parking da Hostinger)"
# Tres tentativas porque o ambiente varia: dig no servidor, getent no Linux,
# nslookup no Windows. O filtro de IPv4 descarta linha de CNAME. E no nslookup
# a leitura so comeca depois do "Name:" - sem isso o que sai e o IP do
# RESOLVEDOR (127.0.0.53 no Ubuntu), nao a resposta.
ip=$(dig +short receitinhaspratodahora.shop A 2>/dev/null | grep -E '^[0-9]+(\.[0-9]+){3}$' | head -1)
[ -z "$ip" ] && ip=$(getent hosts receitinhaspratodahora.shop 2>/dev/null | awk '{print $1}' | head -1)
[ -z "$ip" ] && ip=$(nslookup receitinhaspratodahora.shop 2>/dev/null | awk '/^Name:/{f=1} f && /^Address:/{print $2; exit}')
[ -z "$ip" ] && ip="(nao resolve: sem DNS nenhum, nem o parking)"
echo "  agora: $ip"

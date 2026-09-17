<?php
/* ============================================================
   Dashboard de cliques do videopack.
   Acesso: /videopack/dashboard/?key=SUA_CHAVE
   Mostra cliques por dia (free vs premium), separando
   Publico (gringa) de Voce/BR.
   ============================================================ */

require __DIR__ . '/../vp-config.php';
date_default_timezone_set($TZ);

/* ---- auth simples por chave ---- */
if (($_GET['key'] ?? '') !== $DASH_KEY) {
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;background:#0f1216;color:#e8eaed;padding:48px;line-height:1.6">'
       . '<h2>Acesso negado</h2><p>Adicione <code>?key=SUA_CHAVE</code> ao final da URL.</p></body>';
    exit;
}

/* ---- diagnostico do arquivo de dados ---- */
$diag = [
    'path'     => $DATA_FILE,
    'exists'   => is_file($DATA_FILE),
    'readable' => is_readable($DATA_FILE),
    'dir_ok'   => is_dir(dirname($DATA_FILE)),
    'writable' => is_writable(is_file($DATA_FILE) ? $DATA_FILE : dirname($DATA_FILE)),
];

/* ---- le e agrega ---- */
$rows = [];
if ($diag['exists'] && $diag['readable']) {
    $fh = fopen($DATA_FILE, 'r');
    if ($fh) {
        while (($l = fgets($fh)) !== false) {
            $l = trim($l);
            if ($l === '') continue;
            $r = json_decode($l, true);
            if (is_array($r)) $rows[] = $r;
        }
        fclose($fh);
    }
}

$days = [];               // day => [pf, pp, yf, yp]
$tot  = ['pf'=>0,'pp'=>0,'yf'=>0,'yp'=>0];
$ipset = [];              // visitantes distintos (publico)
foreach ($rows as $r) {
    $day = $r['day'] ?? date('Y-m-d', (int)($r['ts'] ?? time()));
    $isYou = (!empty($r['owner'])) || (!empty($r['br']));
    $card = $r['card'] ?? '';
    if (!isset($days[$day])) $days[$day] = ['pf'=>0,'pp'=>0,'yf'=>0,'yp'=>0];
    if ($isYou) {
        if ($card==='free')    { $days[$day]['yf']++; $tot['yf']++; }
        if ($card==='premium') { $days[$day]['yp']++; $tot['yp']++; }
    } else {
        if ($card==='free')    { $days[$day]['pf']++; $tot['pf']++; }
        if ($card==='premium') { $days[$day]['pp']++; $tot['pp']++; }
        if (!empty($r['ipid'])) $ipset[$r['ipid']] = true;
    }
}

$today   = date('Y-m-d');
$todayPub = isset($days[$today]) ? ($days[$today]['pf'] + $days[$today]['pp']) : 0;

/* ultimos 7 dias (publico) */
$pub7 = 0;
for ($i = 0; $i < 7; $i++) {
    $d = date('Y-m-d', strtotime("-$i day"));
    if (isset($days[$d])) $pub7 += $days[$d]['pf'] + $days[$d]['pp'];
}

$totPub   = $tot['pf'] + $tot['pp'];
$share    = $totPub > 0 ? round($tot['pp'] * 100 / $totPub) : 0;
$visitors = count($ipset);

/* serie dos ultimos 14 dias p/ o grafico (publico) */
$series = [];
$maxbar = 1;
for ($i = 13; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-$i day"));
    $pf = $days[$d]['pf'] ?? 0;
    $pp = $days[$d]['pp'] ?? 0;
    $series[] = ['d'=>$d, 'pf'=>$pf, 'pp'=>$pp];
    $maxbar = max($maxbar, $pf, $pp);
}

/* tabela: todos os dias, mais novo primeiro */
krsort($days);

function h($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="60">
<title>Videopack · Cliques</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0f1216; --surface:#171b21; --surface2:#1e242c; --line:#2a313b;
    --ink:#e8eaed; --ink2:#9aa3af; --ink3:#6b7280;
    --free:#34d399; --prem:#f59e0b; --you:#7c8698;
    --font:"Hanken Grotesk",system-ui,-apple-system,sans-serif;
    --mono:"Space Mono",ui-monospace,monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);
    -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
  .wrap{max-width:1000px;margin:0 auto;padding:26px 18px 60px}
  .top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px}
  h1{font-size:1.5rem;font-weight:800;letter-spacing:-.02em;margin:0}
  .sub{color:var(--ink3);font-family:var(--mono);font-size:.72rem;letter-spacing:.04em}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:22px 0}
  .kpi{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px}
  .kpi .lbl{font-family:var(--mono);font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3)}
  .kpi .val{font-size:2rem;font-weight:800;margin-top:6px;line-height:1}
  .kpi .foot{font-size:.78rem;color:var(--ink2);margin-top:6px}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:20px}
  .card h2{font-size:.95rem;font-weight:700;margin:0 0 4px}
  .card .hint{color:var(--ink3);font-size:.8rem;margin:0 0 18px}
  .legend{display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem;color:var(--ink2);margin-bottom:14px}
  .dot{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:middle}
  .chart{display:flex;align-items:flex-end;gap:10px;height:180px;overflow-x:auto;padding-top:8px}
  .col{flex:1 0 34px;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:34px}
  .bars{display:flex;align-items:flex-end;gap:3px;height:150px;width:100%;justify-content:center}
  .bar{width:12px;border-radius:3px 3px 0 0;min-height:2px}
  .bar.f{background:var(--free)}
  .bar.p{background:var(--prem)}
  .col .d{font-family:var(--mono);font-size:.62rem;color:var(--ink3)}
  table{width:100%;border-collapse:collapse;font-size:.9rem}
  th,td{padding:10px 8px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}
  th:first-child,td:first-child{text-align:left}
  thead th{font-family:var(--mono);font-size:.64rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);font-weight:700}
  tbody tr:hover{background:var(--surface2)}
  td.you{color:var(--you)}
  .tot td{border-top:2px solid var(--line);font-weight:800;background:var(--surface2)}
  .free-c{color:var(--free)} .prem-c{color:var(--prem)}
  .note{color:var(--ink3);font-size:.8rem;line-height:1.5;margin-top:14px}
  .diag{background:#3a1d1d;border:1px solid #6b2b2b;color:#ffd7d7;border-radius:12px;padding:12px 14px;font-size:.82rem;margin-bottom:20px;font-family:var(--mono)}
  code{font-family:var(--mono);background:var(--surface2);padding:1px 6px;border-radius:5px;font-size:.85em}
  @media (max-width:640px){ .kpis{grid-template-columns:repeat(2,1fr)} }
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <h1>Videopack · Cliques</h1>
    <span class="sub">atualizado <?= h(date('d/m H:i')) ?> · auto-refresh 60s</span>
  </div>

  <?php if (!$diag['exists'] || !$diag['writable']): ?>
  <div class="diag">
    ⚠ Arquivo de dados ainda não gravável.<br>
    path: <code><?= h($diag['path']) ?></code> · existe: <?= $diag['exists']?'sim':'não' ?> · dir: <?= $diag['dir_ok']?'ok':'FALTA' ?> · gravável: <?= $diag['writable']?'sim':'NÃO' ?><br>
    Rode no servidor: <code>sudo mkdir -p <?= h(dirname($diag['path'])) ?> &amp;&amp; sudo chown www-data:www-data <?= h(dirname($diag['path'])) ?></code>
  </div>
  <?php endif; ?>

  <?php if ($DASH_KEY === 'CHANGE_ME'): ?>
  <div class="diag">⚠ Usando a chave padrão do dashboard. Crie <code>/var/www/videopack-data/vp-secret.php</code> com uma chave forte (comando no chat) e acesse com <code>?key=SUA_CHAVE</code>.</div>
  <?php endif; ?>

  <div class="kpis">
    <div class="kpi"><div class="lbl">Público hoje</div><div class="val"><?= $todayPub ?></div><div class="foot">cliques (free+premium)</div></div>
    <div class="kpi"><div class="lbl">Público 7 dias</div><div class="val"><?= $pub7 ?></div><div class="foot"><?= $visitors ?> visitantes distintos</div></div>
    <div class="kpi"><div class="lbl">Total público</div><div class="val"><span class="free-c"><?= $tot['pf'] ?></span> / <span class="prem-c"><?= $tot['pp'] ?></span></div><div class="foot">free / premium</div></div>
    <div class="kpi"><div class="lbl">Interesse premium</div><div class="val"><?= $share ?>%</div><div class="foot">premium ÷ total (público)</div></div>
  </div>

  <div class="card">
    <h2>Cliques por dia — Público (gringa)</h2>
    <p class="hint">Últimos 14 dias. Cliques de BR / modo dono ficam de fora daqui (veja a tabela abaixo).</p>
    <div class="legend">
      <span><span class="dot" style="background:var(--free)"></span>Free (10 efeitos)</span>
      <span><span class="dot" style="background:var(--prem)"></span>Premium (100 efeitos)</span>
    </div>
    <div class="chart">
      <?php foreach ($series as $s):
        $hf = round($s['pf'] / $maxbar * 150);
        $hp = round($s['pp'] / $maxbar * 150); ?>
      <div class="col">
        <div class="bars">
          <div class="bar f" style="height:<?= max($s['pf']?2:0,$hf) ?>px" title="<?= h($s['d']) ?> · Free: <?= $s['pf'] ?>"></div>
          <div class="bar p" style="height:<?= max($s['pp']?2:0,$hp) ?>px" title="<?= h($s['d']) ?> · Premium: <?= $s['pp'] ?>"></div>
        </div>
        <span class="d"><?= h(date('d/m', strtotime($s['d']))) ?></span>
      </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="card">
    <h2>Detalhe por dia</h2>
    <p class="hint">Público = provável gringa (audiência real). Você/BR = idioma pt-*, fuso do Brasil, país BR, ou modo dono ativado.</p>
    <table>
      <thead>
        <tr>
          <th>Dia</th>
          <th>Público free</th>
          <th>Público premium</th>
          <th>Você free</th>
          <th>Você premium</th>
          <th>Total público</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!$days): ?>
          <tr><td colspan="6" style="text-align:center;color:var(--ink3);padding:26px">Sem cliques ainda.</td></tr>
        <?php else: foreach ($days as $d => $v): ?>
          <tr>
            <td><?= h(date('d/m/Y', strtotime($d))) ?></td>
            <td class="free-c"><?= $v['pf'] ?></td>
            <td class="prem-c"><?= $v['pp'] ?></td>
            <td class="you"><?= $v['yf'] ?></td>
            <td class="you"><?= $v['yp'] ?></td>
            <td><strong><?= $v['pf'] + $v['pp'] ?></strong></td>
          </tr>
        <?php endforeach; endif; ?>
      </tbody>
      <?php if ($days): ?>
      <tfoot>
        <tr class="tot">
          <td>Total</td>
          <td class="free-c"><?= $tot['pf'] ?></td>
          <td class="prem-c"><?= $tot['pp'] ?></td>
          <td class="you"><?= $tot['yf'] ?></td>
          <td class="you"><?= $tot['yp'] ?></td>
          <td><?= $totPub ?></td>
        </tr>
      </tfoot>
      <?php endif; ?>
    </table>
    <p class="note">
      <strong>Modo dono</strong> (marca seus cliques como "Você" com certeza): abra
      <code>/videopack/?owner=1</code> no seu navegador uma vez.
      Para desligar: <code>/videopack/?owner=off</code>.
    </p>
  </div>
</div>
</body>
</html>

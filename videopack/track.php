<?php
/* ============================================================
   Endpoint de tracking de cliques (videopack).
   Recebe POST JSON: { card: "free"|"premium", owner: bool, lang, tz }
   Grava 1 linha JSONL em $DATA_FILE. Responde 204.
   ============================================================ */

require __DIR__ . '/vp-config.php';
date_default_timezone_set($TZ);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$raw = file_get_contents('php://input');
$in  = json_decode($raw, true);
if (!is_array($in)) { http_response_code(400); exit; }

$card = $in['card'] ?? '';
if ($card !== 'free' && $card !== 'premium') { http_response_code(400); exit; }

$owner = !empty($in['owner']);
$lang  = isset($in['lang']) ? substr((string)$in['lang'], 0, 20) : '';
$tz    = isset($in['tz'])   ? substr((string)$in['tz'],   0, 40) : '';

/* IP -> id derivado (nao guardamos IP cru) */
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
if (strpos($ip, ',') !== false) { $ip = trim(explode(',', $ip)[0]); }
$ipid = substr(hash('sha256', $ip . '|' . $IP_SALT), 0, 12);

/* Heuristica BR = provavelmente voce (publico e gringo) */
$br = false;
if (stripos($lang, 'pt') === 0) { $br = true; }                 // pt / pt-BR
if (stripos($tz, 'America/Sao_Paulo') !== false) { $br = true; } // fuso BR mais comum
if (!$br && preg_match('#^America/(Bahia|Fortaleza|Recife|Manaus|Belem|Cuiaba|Campo_Grande|Boa_Vista|Porto_Velho|Rio_Branco|Maceio|Araguaina|Santarem|Noronha)#i', $tz)) { $br = true; }
$cc = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? '';   // se estiver atras da Cloudflare
if ($cc === 'BR') { $br = true; }

$row = [
    'ts'    => time(),
    'day'   => date('Y-m-d'),
    'card'  => $card,
    'owner' => $owner,
    'br'    => (bool)$br,
    'cc'    => $cc ?: '',
    'lang'  => $lang,
    'tz'    => $tz,
    'ipid'  => $ipid,
    'ua'    => isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 120) : '',
    'ref'   => isset($_SERVER['HTTP_REFERER'])    ? substr($_SERVER['HTTP_REFERER'], 0, 200) : '',
];

$dir = dirname($DATA_FILE);
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }

$line = json_encode($row, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
$ok = @file_put_contents($DATA_FILE, $line, FILE_APPEND | LOCK_EX);

if ($ok === false) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'nao consegui gravar em ' . $DATA_FILE]);
    exit;
}

http_response_code(204);

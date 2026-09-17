<?php
/* ============================================================
   Config do tracking de cliques do videopack.
   IMPORTANTE: aqui NAO ha segredos. As chaves reais ficam em
   /var/www/videopack-data/vp-secret.php  (FORA do git e FORA do
   webroot), criado uma vez no servidor. Este arquivo so tem
   caminhos e placeholders, que o vp-secret.php sobrescreve.
   ============================================================ */

// Onde os cliques sao gravados (FORA do webroot; nao e servido pelo nginx).
$DATA_FILE = '/var/www/videopack-data/clicks.jsonl';

// Fuso usado para agrupar "por dia".
$TZ = 'America/Sao_Paulo';

// Placeholders — substituidos pelo vp-secret.php no servidor.
$DASH_KEY = 'CHANGE_ME';   // senha do dashboard (?key=...)
$IP_SALT  = 'CHANGE_ME';   // salt do hash de IP (pseudonimizacao)

// Carrega as chaves reais, se existirem (arquivo criado no servidor).
$__secret = '/var/www/videopack-data/vp-secret.php';
if (is_file($__secret)) { require $__secret; }

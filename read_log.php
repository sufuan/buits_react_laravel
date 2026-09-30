<?php
$lines = file('storage/logs/laravel.log');
if ($lines === false) {
    echo "Could not read log file.\n";
    exit(1);
}
$tail = array_slice($lines, -100);
echo implode('', $tail);

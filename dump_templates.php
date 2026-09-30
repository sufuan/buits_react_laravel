<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$templates = \App\Models\CertificateTemplate::all();
foreach($templates as $t) {
    echo $t->id . ' - bg: ' . $t->background_image . ' - logo: ' . $t->logo_image . ' - sig: ' . $t->signature_image . "\n";
}

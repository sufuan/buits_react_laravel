<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\CertificateSetting;

class CreateCertificateSettingsTable extends Migration
{
  /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certificate_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->longText('value')->nullable();
            $table->timestamps();
            $table->integer('school_id')->nullable()->default(1);
        });

        $settings = [];
        $settings[] = [
            0 => [
                'key' => 'prefix',
                'value' => 'infix_',

            ],
            1 => [
                'key' => 'portrait_certificate_in_a_page',
                'value' => 1,

            ],
            3 => [
                'key' => 'custom_page_break_after_certificate',
                'value' => 1,

            ],
        ];
        foreach ($settings as $setting) {
            foreach ($setting as $s) {
                $certificate_setting = new CertificateSetting();
                $certificate_setting->key = $s['key'];
                $certificate_setting->value = $s['value'];
                $certificate_setting->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('certificate_settings');
    }
}

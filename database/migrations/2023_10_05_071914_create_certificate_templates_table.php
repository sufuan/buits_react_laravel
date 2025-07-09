<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
class CreateCertificateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('certificate_type_id');
            $table->integer('layout')->comment('1: A4 Portrait, 2: A4 Landscape, 3: Custom');
            $table->string('width')->nullable();
            $table->string('height')->nullable();
            $table->double('margin_top')->nullable();
            $table->double('margin_bottom')->nullable();
            $table->double('margin_left')->nullable();
            $table->double('margin_right')->nullable();
            $table->integer('user_photo_style')->nullable()->comment('1: Circle, 2: Square')->default(1);
            $table->string('user_image_size')->nullable();
            $table->text('qr_code')->nullable();
            $table->string('qr_image_size')->nullable();
            $table->string('background_image')->nullable();
            $table->string('logo_image')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('signature_name')->nullable();
            $table->longText('content')->nullable();
            $table->integer('status')->comment('1: Active, 2: Inactive')->default(1)->nullable();
            $table->integer('school_id')->nullable()->default(1);
            $table->timestamps();
        });

       
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('certificate_templates');
    }
}

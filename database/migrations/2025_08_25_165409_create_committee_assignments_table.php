<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('committee_assignments', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('user_id');
			$table->unsignedBigInteger('designation_id')->nullable();
			$table->timestamps();

			$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
			$table->foreign('designation_id')->references('id')->on('designations')->onDelete('set null');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		// Best-effort drop of foreign keys before dropping table
		try {
			Schema::table('committee_assignments', function (Blueprint $table) {
				if (Schema::hasColumn('committee_assignments', 'designation_id')) {
					try { $table->dropForeign(['designation_id']); } catch (\Throwable $e) {}
				}
				if (Schema::hasColumn('committee_assignments', 'user_id')) {
					try { $table->dropForeign(['user_id']); } catch (\Throwable $e) {}
				}
			});
		} catch (\Throwable $e) {
			// ignore
		}

		Schema::dropIfExists('committee_assignments');
	}
};


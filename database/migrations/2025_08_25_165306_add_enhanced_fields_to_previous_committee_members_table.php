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
		Schema::table('previous_committee_members', function (Blueprint $table) {
			if (! Schema::hasColumn('previous_committee_members', 'user_id')) {
				$table->unsignedBigInteger('user_id')->nullable()->after('id');
				$table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
			}

			if (! Schema::hasColumn('previous_committee_members', 'designation_title')) {
				$table->string('designation_title')->nullable()->after('user_id');
			}
			if (! Schema::hasColumn('previous_committee_members', 'designation_id_snapshot')) {
				$table->unsignedBigInteger('designation_id_snapshot')->nullable()->after('designation_title');
			}
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		try {
			Schema::table('previous_committee_members', function (Blueprint $table) {
				if (Schema::hasColumn('previous_committee_members', 'designation_id_snapshot')) {
					try { $table->dropColumn('designation_id_snapshot'); } catch (\Throwable $e) {}
				}
				if (Schema::hasColumn('previous_committee_members', 'designation_title')) {
					try { $table->dropColumn('designation_title'); } catch (\Throwable $e) {}
				}
				if (Schema::hasColumn('previous_committee_members', 'user_id')) {
					try { $table->dropForeign(['user_id']); } catch (\Throwable $e) {}
					try { $table->dropColumn('user_id'); } catch (\Throwable $e) {}
				}
			});
		} catch (\Throwable $e) {
			// ignore
		}
	}
};


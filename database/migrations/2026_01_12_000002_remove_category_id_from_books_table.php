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
        // SQLite has limitations with dropping foreign keys and columns
        // For testing purposes with SQLite, we'll skip this migration
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }
        
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null')->after('user_id');
        });
    }
};

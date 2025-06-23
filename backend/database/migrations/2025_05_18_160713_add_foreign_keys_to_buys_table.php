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
        Schema::table('buys', function (Blueprint $table) {
            $table->foreign(['ticket_id'], 'buys_ticket_id_fkey')->references(['ticket_id'])->on('ticket')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['user_id'], 'buys_user_id_fkey')->references(['id'])->on('users')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buys', function (Blueprint $table) {
            $table->dropForeign('buys_ticket_id_fkey');
            $table->dropForeign('buys_user_id_fkey');
        });
    }
};

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
        Schema::table('event_creation', function (Blueprint $table) {
            $table->foreign(['event_id'], 'event_creation_event_id_fkey')->references(['event_id'])->on('event')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['user_id'], 'event_creation_user_id_fkey')->references(['id'])->on('users')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_creation', function (Blueprint $table) {
            $table->dropForeign('event_creation_event_id_fkey');
            $table->dropForeign('event_creation_user_id_fkey');
        });
    }
};

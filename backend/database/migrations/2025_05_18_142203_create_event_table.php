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
        Schema::create('event', function (Blueprint $table) {
            $table->bigInteger('event_id')->primary();
            $table->text('title')->nullable();
            $table->text('image')->nullable();
            $table->bigInteger('manager_id')->nullable();
            $table->text('description')->nullable();
            $table->text('country')->nullable();
            $table->text('city')->nullable();
            $table->text('speaker_name')->nullable();
            $table->text('speaker_image')->nullable();
            $table->timestamp('start_datetime')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event');
    }
};

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
        Schema::create('quiz_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150)->index();
            $table->string('phone', 50)->index();
            $table->string('gender', 20)->default('male');
            $table->string('result_code', 10)->default('A');
            $table->string('result_profile', 100)->nullable();
            $table->string('matched_product', 255)->nullable();
            $table->longText('answers_json')->nullable();
            $table->string('status', 30)->default('NEW')->index();
            $table->text('notes')->nullable();
            $table->string('source', 100)->default('Landing Page Quiz');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_leads');
    }
};

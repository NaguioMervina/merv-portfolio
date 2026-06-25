<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("skills", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("icon")->nullable();
            $table->string("category")->default("general");
            $table->integer("proficiency")->default(80);
            $table->integer("sort_order")->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("skills");
    }
};

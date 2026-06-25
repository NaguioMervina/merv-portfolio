<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("projects", function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->text("description");
            $table->string("thumbnail")->nullable();
            $table->string("tech_stack")->nullable();
            $table->string("live_url")->nullable();
            $table->string("github_url")->nullable();
            $table->boolean("is_featured")->default(false);
            $table->integer("sort_order")->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("projects");
    }
};

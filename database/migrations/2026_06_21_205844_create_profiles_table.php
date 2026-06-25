<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("profiles", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->string("tagline")->nullable();
            $table->text("bio")->nullable();
            $table->string("photo")->nullable();
            $table->string("resume_path")->nullable();
            $table->string("location")->nullable();
            $table->string("phone")->nullable();
            $table->string("github_url")->nullable();
            $table->string("linkedin_url")->nullable();
            $table->string("twitter_url")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("profiles");
    }
};

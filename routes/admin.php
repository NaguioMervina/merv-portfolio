<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\ResumeController;
use Illuminate\Support\Facades\Route;

Route::middleware(["auth"])->prefix("admin")->name("admin.")->group(function () {
    Route::get("/", [DashboardController::class, "index"])->name("dashboard");
    Route::resource("projects", ProjectController::class);
    Route::resource("skills", SkillController::class);
    Route::resource("experiences", ExperienceController::class);
    Route::resource("contacts", ContactController::class)->only(["index", "show", "destroy"]);
    Route::get("/settings", [SettingController::class, "edit"])->name("settings.edit");
    Route::put("/settings", [SettingController::class, "update"])->name("settings.update");
    Route::post("/upload", [UploadController::class, "store"])->name("upload");
    Route::get("/resume/upload", [ResumeController::class, "upload"])->name("resume.upload");
    Route::post("/resume/extract", [ResumeController::class, "extract"])->name("resume.extract");
    Route::post("/resume/confirm", [ResumeController::class, "confirm"])->name("resume.confirm");
});

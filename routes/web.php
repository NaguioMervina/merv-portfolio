<?php

use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", [PortfolioController::class, "index"])->name("home");
Route::post("/contact", [PortfolioController::class, "contact"])->name("contact");

Route::middleware(["auth"])->group(function () {
    Route::get("dashboard", function () {
        return Inertia::render("dashboard");
    })->name("dashboard");
});

require __DIR__."/settings.php";
require __DIR__."/auth.php";
require __DIR__."/admin.php";

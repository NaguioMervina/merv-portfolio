<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Contact;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/dashboard", [
            "stats" => [
                "projects" => Project::count(),
                "skills" => Skill::count(),
                "experiences" => Experience::count(),
                "unread_contacts" => Contact::where("is_read", false)->count(),
            ],
            "recent_contacts" => Contact::latest()->take(5)->get(),
        ]);
    }
}

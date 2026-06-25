<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/projects/index", [
            "projects" => Project::orderBy("sort_order")->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render("admin/projects/create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "thumbnail" => "nullable|string|max:500",
            "tech_stack" => "nullable|string|max:255",
            "live_url" => "nullable|string|max:500",
            "github_url" => "nullable|string|max:500",
            "is_featured" => "boolean",
            "sort_order" => "integer|min:0",
        ]);

        Project::create($validated);

        return to_route("admin.projects.index");
    }

    public function edit(Project $project)
    {
        return Inertia::render("admin/projects/edit", [
            "project" => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "thumbnail" => "nullable|string|max:500",
            "tech_stack" => "nullable|string|max:255",
            "live_url" => "nullable|string|max:500",
            "github_url" => "nullable|string|max:500",
            "is_featured" => "boolean",
            "sort_order" => "integer|min:0",
        ]);

        $project->update($validated);

        return to_route("admin.projects.index");
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return to_route("admin.projects.index");
    }
}

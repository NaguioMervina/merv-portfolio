<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/experiences/index", [
            "experiences" => Experience::orderBy("sort_order")->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render("admin/experiences/create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "company" => "required|string|max:255",
            "location" => "nullable|string|max:255",
            "start_date" => "required|date",
            "end_date" => "nullable|date|after_or_equal:start_date",
            "description" => "nullable|string",
            "type" => "required|in:work,education",
            "sort_order" => "integer|min:0",
        ]);

        Experience::create($validated);

        return to_route("admin.experiences.index");
    }

    public function edit(Experience $experience)
    {
        return Inertia::render("admin/experiences/edit", [
            "experience" => $experience,
        ]);
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "company" => "required|string|max:255",
            "location" => "nullable|string|max:255",
            "start_date" => "required|date",
            "end_date" => "nullable|date|after_or_equal:start_date",
            "description" => "nullable|string",
            "type" => "required|in:work,education",
            "sort_order" => "integer|min:0",
        ]);

        $experience->update($validated);

        return to_route("admin.experiences.index");
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return to_route("admin.experiences.index");
    }
}

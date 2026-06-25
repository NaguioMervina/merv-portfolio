<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/skills/index", [
            "skills" => Skill::orderBy("sort_order")->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render("admin/skills/create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "icon" => "nullable|string|max:255",
            "category" => "required|string|max:255",
            "proficiency" => "required|integer|min:0|max:100",
            "sort_order" => "integer|min:0",
        ]);

        Skill::create($validated);

        return to_route("admin.skills.index");
    }

    public function edit(Skill $skill)
    {
        return Inertia::render("admin/skills/edit", [
            "skill" => $skill,
        ]);
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "icon" => "nullable|string|max:255",
            "category" => "required|string|max:255",
            "proficiency" => "required|integer|min:0|max:100",
            "sort_order" => "integer|min:0",
        ]);

        $skill->update($validated);

        return to_route("admin.skills.index");
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return to_route("admin.skills.index");
    }
}

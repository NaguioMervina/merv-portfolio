<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use App\Services\ResumeExtractionService;
use App\Services\ResumeParserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResumeController extends Controller
{
    public function upload()
    {
        return Inertia::render('admin/resume/upload');
    }

    public function extract(Request $request, ResumeParserService $parser, ResumeExtractionService $extractor)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf|max:5120',
        ]);

        $file = $request->file('resume');
        $text = $parser->extractText($file->getRealPath());

        if (empty(trim($text))) {
            return back()->withErrors(['resume' => 'Could not extract text from this PDF.']);
        }

        $data = $extractor->extract($text);

        return Inertia::render('admin/resume/upload', [
            'extracted' => $data,
        ]);
    }

    public function confirm(Request $request)
    {
        $data = $request->validate([
            'tagline' => 'nullable|string',
            'bio' => 'nullable|string',
            'phone' => 'nullable|string',
            'location' => 'nullable|string',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'skills' => 'nullable|array',
            'skills.*.name' => 'required|string',
            'skills.*.category' => 'required|string|in:frontend,backend,database,tools,general',
            'skills.*.proficiency' => 'required|integer|min:0|max:100',
            'experiences' => 'nullable|array',
            'experiences.*.title' => 'required|string',
            'experiences.*.company' => 'required|string',
            'experiences.*.location' => 'nullable|string',
            'experiences.*.start_date' => 'required|date',
            'experiences.*.end_date' => 'nullable|date',
            'experiences.*.description' => 'nullable|string',
            'experiences.*.type' => 'required|string|in:work,education',
            'projects' => 'nullable|array',
            'projects.*.title' => 'required|string',
            'projects.*.description' => 'nullable|string',
            'projects.*.tech_stack' => 'nullable|string',
        ]);

        $user = Auth::user();
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            ['user_id' => $user->id]
        );

        $profile->update([
            'tagline' => $data['tagline'] ?? $profile->tagline,
            'bio' => $data['bio'] ?? $profile->bio,
            'phone' => $data['phone'] ?? $profile->phone,
            'location' => $data['location'] ?? $profile->location,
            'github_url' => $data['github_url'] ?? $profile->github_url,
            'linkedin_url' => $data['linkedin_url'] ?? $profile->linkedin_url,
        ]);

        Setting::set('site_description', $data['tagline'] ?? '');

        if (!empty($data['skills'])) {
            foreach ($data['skills'] as $skill) {
                Skill::updateOrCreate(
                    ['name' => $skill['name']],
                    [
                        'category' => $skill['category'],
                        'proficiency' => $skill['proficiency'],
                    ]
                );
            }
        }

        if (!empty($data['experiences'])) {
            foreach ($data['experiences'] as $exp) {
                Experience::create([
                    'title' => $exp['title'],
                    'company' => $exp['company'],
                    'location' => $exp['location'] ?? null,
                    'start_date' => $exp['start_date'],
                    'end_date' => $exp['end_date'] ?? null,
                    'description' => $exp['description'] ?? null,
                    'type' => $exp['type'],
                ]);
            }
        }

        if (!empty($data['projects'])) {
            foreach ($data['projects'] as $project) {
                Project::create([
                    'title' => $project['title'],
                    'description' => $project['description'] ?? '',
                    'tech_stack' => $project['tech_stack'] ?? null,
                ]);
            }
        }

        return to_route('admin.settings.edit')->with('success', 'Resume data imported successfully.');
    }
}

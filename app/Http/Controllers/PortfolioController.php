<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Portfolio\Services\GitLabContributionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class PortfolioController extends Controller
{
    public function index(GitLabContributionService $gitLabContributionService)
    {
        [$profile, $skills, $projects, $experiences] = $this->loadPortfolioContent();

        return Inertia::render('portfolio', [
            'profile' => $profile,
            'skills' => $skills,
            'projects' => $projects,
            'experiences' => $experiences,
            'gitlabContributions' => $gitLabContributionService->get(),
        ]);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        Contact::create($validated);

        return back()->with('success', 'Message sent successfully!');
    }

    private function loadPortfolioContent(): array
    {
        try {
            return [
                Profile::with('user')->first(),
                Skill::orderBy('sort_order')->get()->groupBy('category'),
                Project::orderBy('sort_order')->get(),
                Experience::orderBy('sort_order')->get(),
            ];
        } catch (Throwable $exception) {
            report($exception);

            return [
                $this->fallbackProfile(),
                $this->fallbackSkills(),
                $this->fallbackProjects(),
                $this->fallbackExperiences(),
            ];
        }
    }

    private function fallbackProfile(): array
    {
        return [
            'id' => 0,
            'user_id' => 0,
            'tagline' => 'Full Stack Developer',
            'bio' => 'I build practical Laravel and React systems with a focus on reliable delivery, clean UI, and recruiter-friendly project storytelling.',
            'photo' => null,
            'resume_path' => null,
            'location' => 'Philippines',
            'phone' => null,
            'github_url' => 'https://github.com/NaguioMervina',
            'linkedin_url' => null,
            'twitter_url' => null,
            'user' => [
                'name' => 'Mervina Naguio',
                'email' => 'hello@example.com',
            ],
        ];
    }

    private function fallbackSkills(): array
    {
        return [
            'backend' => [
                ['id' => 1, 'name' => 'Laravel', 'icon' => 'laravel', 'category' => 'backend', 'proficiency' => 92],
                ['id' => 2, 'name' => 'PHP', 'icon' => 'php', 'category' => 'backend', 'proficiency' => 88],
                ['id' => 3, 'name' => 'REST APIs', 'icon' => 'api', 'category' => 'backend', 'proficiency' => 85],
            ],
            'frontend' => [
                ['id' => 4, 'name' => 'React', 'icon' => 'react', 'category' => 'frontend', 'proficiency' => 90],
                ['id' => 5, 'name' => 'TypeScript', 'icon' => 'typescript', 'category' => 'frontend', 'proficiency' => 82],
                ['id' => 6, 'name' => 'Tailwind CSS', 'icon' => 'tailwind', 'category' => 'frontend', 'proficiency' => 88],
            ],
            'workflow' => [
                ['id' => 7, 'name' => 'GitLab Integration', 'icon' => 'git', 'category' => 'workflow', 'proficiency' => 84],
                ['id' => 8, 'name' => 'Caching', 'icon' => 'api', 'category' => 'workflow', 'proficiency' => 80],
                ['id' => 9, 'name' => 'Docker', 'icon' => 'docker', 'category' => 'workflow', 'proficiency' => 75],
            ],
        ];
    }

    private function fallbackProjects(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'GitLab Contribution Showcase',
                'description' => 'A privacy-safe GitLab contribution module that fetches, normalizes, and visualizes a 365-day activity history for recruiter-facing portfolio use.',
                'thumbnail' => null,
                'tech_stack' => 'Laravel, React, Inertia.js, Tailwind CSS, GitLab scraping, Caching',
                'live_url' => null,
                'github_url' => 'https://github.com/NaguioMervina/gitlab-contribution-showcase',
                'is_featured' => true,
            ],
            [
                'id' => 2,
                'title' => 'Recruiter Portfolio Refresh',
                'description' => 'A full public-portfolio redesign focused on modern developer presentation, stronger project storytelling, and direct proof of engineering activity.',
                'thumbnail' => null,
                'tech_stack' => 'Laravel, React, TypeScript, Tailwind CSS',
                'live_url' => null,
                'github_url' => null,
                'is_featured' => false,
            ],
        ];
    }

    private function fallbackExperiences(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Full Stack Developer',
                'company' => 'Portfolio Projects',
                'location' => 'Remote',
                'start_date' => '2025-01-01',
                'end_date' => null,
                'description' => 'Building Laravel and React applications with a focus on maintainable implementation, polished user experience, and clear delivery signals.',
                'type' => 'work',
            ],
            [
                'id' => 2,
                'title' => 'Software Development Training',
                'company' => 'Independent Learning',
                'location' => 'Philippines',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'description' => 'Focused on web application architecture, frontend interaction design, backend workflows, and modern developer tooling.',
                'type' => 'education',
            ],
        ];
    }
}

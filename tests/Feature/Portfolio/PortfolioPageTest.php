<?php

namespace Tests\Feature\Portfolio;

use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-06-21 12:00:00');

        config()->set('cache.default', 'array');
        config()->set('portfolio.gitlab.base_url', 'https://gitlab.example');
        config()->set('portfolio.gitlab.username', 'NaguioMervina');
        config()->set('portfolio.gitlab.cache_minutes', 360);
        config()->set('portfolio.gitlab.timeout', 8);

        Cache::flush();
        Http::preventStrayRequests();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_the_public_portfolio_page_includes_the_gitlab_contribution_payload(): void
    {
        $user = User::factory()->create([
            'name' => 'Mervina Naguio',
        ]);

        Profile::create([
            'user_id' => $user->id,
            'tagline' => 'Full Stack Developer',
            'bio' => 'Builds practical Laravel and React systems.',
            'location' => 'Philippines',
            'github_url' => 'https://github.com/NaguioMervina',
        ]);

        Project::create([
            'title' => 'GitLab Contribution Showcase',
            'description' => 'Privacy-safe GitLab contribution portfolio module.',
            'tech_stack' => 'Laravel, React, Tailwind CSS',
            'github_url' => 'https://github.com/NaguioMervina/gitlab-contribution-showcase',
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        Http::fake([
            'https://gitlab.example/users/NaguioMervina/calendar.json*' => Http::response([
                '2026-06-20' => 1,
                '2026-06-21' => 2,
            ], 200),
            'https://gitlab.example/users/NaguioMervina/calendar_activities*' => Http::response('', 200),
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('portfolio', false)
                ->where('profile.user.name', 'Mervina Naguio')
                ->where('gitlabContributions.available', true)
                ->where('gitlabContributions.username', 'NaguioMervina')
                ->where('gitlabContributions.total', 3)
                ->has('gitlabContributions.weeks')
                ->has('projects', 1)
            );
    }
}

<?php

namespace Tests\Unit\Portfolio;

use App\Portfolio\Services\GitLabContributionService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GitLabContributionServiceTest extends TestCase
{
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

    public function test_it_fetches_and_normalizes_gitlab_contributions(): void
    {
        Http::fake([
            'https://gitlab.example/users/NaguioMervina/calendar.json*' => Http::response([
                '2025-06-21' => 9,
                '2026-06-17' => -3,
                '2026-06-18' => 1,
                '2026-06-19' => 4,
                '2026-06-20' => 10,
                '2026-06-21' => 30,
                'invalid-date' => 99,
                '2026-06-22' => 4,
            ], 200),
            'https://gitlab.example/users/NaguioMervina/calendar_activities*' => Http::response($this->privateActivityFixture(), 200),
        ]);

        $data = app(GitLabContributionService::class)->get();

        $this->assertNotNull($data);
        $this->assertTrue($data['available']);
        $this->assertSame('NaguioMervina', $data['username']);
        $this->assertSame('https://gitlab.example/NaguioMervina', $data['profile_url']);
        $this->assertSame(45, $data['total']);
        $this->assertSame(4, $data['active_days']);
        $this->assertSame(4, $data['longest_streak']);
        $this->assertSame([
            'date' => '2026-06-21',
            'label' => 'Jun 21, 2026',
            'count' => 30,
        ], $data['busiest_day']);
        $this->assertSame('Jun 22, 2025 – Jun 21, 2026', $data['range_label']);
        $this->assertCount(53, $data['weeks']);
        $this->assertSame('Jun', $data['weeks'][0]['month']);
        $this->assertSame('2025-06-22', $data['weeks'][0]['days'][0]['date']);
        $this->assertTrue($data['weeks'][0]['days'][0]['visible']);
        $this->assertSame('2026-06-27', $data['weeks'][52]['days'][6]['date']);
        $this->assertFalse($data['weeks'][52]['days'][6]['visible']);
        $this->assertCount(1, $data['recent_private_contributions']);
        $this->assertSame('2026-06-21T10:09:00+00:00', $data['recent_private_contributions'][0]['occurred_at']);
        $this->assertSame('Jun 21, 2026 10:09 AM UTC', $data['recent_private_contributions'][0]['date_label']);

        Http::assertSent(function ($request) {
            if ($request->url() !== 'https://gitlab.example/users/NaguioMervina/calendar.json') {
                return true;
            }

            return ($request['start_date'] ?? null) === '2025-06-22'
                && ($request['end_date'] ?? null) === '2026-06-21';
        });
    }

    public function test_it_caches_the_normalized_response(): void
    {
        Http::fake([
            'https://gitlab.example/users/NaguioMervina/calendar.json*' => Http::response([], 200),
        ]);

        $first = app(GitLabContributionService::class)->get();
        $second = app(GitLabContributionService::class)->get();

        $this->assertSame($first, $second);
        Http::assertSentCount(1);
    }

    public function test_it_returns_an_unavailable_response_when_gitlab_calendar_fetch_fails(): void
    {
        Http::fake([
            'https://gitlab.example/users/NaguioMervina/calendar.json*' => Http::response('bad gateway', 502),
        ]);

        $data = app(GitLabContributionService::class)->get();

        $this->assertNotNull($data);
        $this->assertFalse($data['available']);
        $this->assertSame(0, $data['total']);
        $this->assertSame([], $data['weeks']);
        $this->assertSame([], $data['recent_private_contributions']);
        Http::assertSentCount(1);
    }

    public function test_it_returns_null_when_no_gitlab_username_is_configured(): void
    {
        config()->set('portfolio.gitlab.username', '');
        Http::fake();

        $this->assertNull(app(GitLabContributionService::class)->get());
        Http::assertNothingSent();
    }

    private function privateActivityFixture(): string
    {
        return <<<'HTML'
<li class="event-item user-profile-activity">
    <span class="js-localtime" data-datetime="2026-06-21T10:09:00Z">10:09am</span>
    <div class="event-title gl-flex gl-font-semibold">Made a private contribution</div>
</li>
<li class="event-item user-profile-activity">
    <span class="js-localtime" data-datetime="2026-06-21T10:09:00Z">10:09am</span>
    <div class="event-title gl-flex gl-font-semibold">Made a private contribution</div>
</li>
<li class="event-item user-profile-activity">
    <span class="js-localtime" data-datetime="2026-06-21T11:30:00Z">11:30am</span>
    <div class="event-title gl-flex gl-font-semibold">Pushed to main</div>
</li>
HTML;
    }
}

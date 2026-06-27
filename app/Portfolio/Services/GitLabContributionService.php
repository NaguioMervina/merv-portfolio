<?php

namespace App\Portfolio\Services;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use DOMDocument;
use DOMXPath;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class GitLabContributionService
{
    public function get(): ?array
    {
        $username = trim((string) config('portfolio.gitlab.username'));

        if ($username === '') {
            return null;
        }

        $baseUrl = rtrim((string) config('portfolio.gitlab.base_url', 'https://gitlab.com'), '/');
        $cacheMinutes = max((int) config('portfolio.gitlab.cache_minutes', 360), 1);
        $cacheKey = 'gitlab-contributions:'.sha1($baseUrl.'|'.$username);

        return Cache::remember(
            $cacheKey,
            now()->addMinutes($cacheMinutes),
            fn () => $this->fetchNormalizedContributions($baseUrl, $username),
        );
    }

    private function fetchNormalizedContributions(string $baseUrl, string $username): array
    {
        $today = CarbonImmutable::today();
        $startDate = CarbonImmutable::createFromDate(2010, 1, 1);

        try {
            $dailyCounts = $this->fetchCalendarCounts($baseUrl, $username, $startDate, $today);
        } catch (Throwable $exception) {
            Log::warning('GitLab contribution calendar fetch failed.', [
                'base_url' => $baseUrl,
                'username' => $username,
                'message' => $exception->getMessage(),
            ]);

            return $this->unavailableResponse($baseUrl, $username);
        }

        $summary = $this->buildSummary($dailyCounts, $startDate, $today);

        try {
            $recentPrivateContributions = $this->fetchRecentPrivateContributions($baseUrl, $username, $dailyCounts);
        } catch (Throwable $exception) {
            Log::warning('GitLab private activity fetch failed.', [
                'base_url' => $baseUrl,
                'username' => $username,
                'message' => $exception->getMessage(),
            ]);

            $recentPrivateContributions = [];
        }

        return [
            'available' => true,
            'username' => $username,
            'profile_url' => $baseUrl.'/'.$username,
            'member_since' => config('portfolio.gitlab.member_since'),
            'total' => $summary['total'],
            'active_days' => $summary['active_days'],
            'longest_streak' => $summary['longest_streak'],
            'busiest_day' => $summary['busiest_day'],
            'range_label' => $startDate->format('M j, Y').' – '.$today->format('M j, Y'),
            'weeks' => $this->buildHeatmapWeeks($dailyCounts, $startDate, $today),
            'recent_private_contributions' => $recentPrivateContributions,
        ];
    }

    private function fetchCalendarCounts(
        string $baseUrl,
        string $username,
        CarbonImmutable $startDate,
        CarbonImmutable $endDate,
    ): array {
        $response = Http::acceptJson()
            ->timeout(max((int) config('portfolio.gitlab.timeout', 8), 1))
            ->retry(2, 150, throw: false)
            ->get($baseUrl.'/users/'.rawurlencode($username).'/calendar.json', [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('GitLab calendar request failed with status '.$response->status().'.');
        }

        $rawBody = trim($response->body());
        $calendar = $rawBody === '' ? [] : $response->json();

        if (! is_array($calendar)) {
            return [];
        }

        $counts = [];

        foreach ($calendar as $date => $count) {
            if (! is_string($date) || ! is_numeric($count)) {
                continue;
            }

            try {
                $day = CarbonImmutable::createFromFormat('Y-m-d', $date);
            } catch (Throwable) {
                continue;
            }

            if ($day->lt($startDate) || $day->gt($endDate)) {
                continue;
            }

            $counts[$day->toDateString()] = max((int) $count, 0);
        }

        ksort($counts);

        return $counts;
    }

    private function buildSummary(array $dailyCounts, CarbonImmutable $startDate, CarbonImmutable $endDate): array
    {
        $total = 0;
        $activeDays = 0;
        $longestStreak = 0;
        $currentStreak = 0;
        $busiestDay = null;
        $busiestCount = 0;

        for ($day = $startDate; $day->lte($endDate); $day = $day->addDay()) {
            $count = $dailyCounts[$day->toDateString()] ?? 0;
            $total += $count;

            if ($count > 0) {
                $activeDays++;
                $currentStreak++;

                if ($currentStreak > $longestStreak) {
                    $longestStreak = $currentStreak;
                }

                if ($count > $busiestCount) {
                    $busiestCount = $count;
                    $busiestDay = [
                        'date' => $day->toDateString(),
                        'label' => $day->format('M j, Y'),
                        'count' => $count,
                    ];
                }

                continue;
            }

            $currentStreak = 0;
        }

        return [
            'total' => $total,
            'active_days' => $activeDays,
            'longest_streak' => $longestStreak,
            'busiest_day' => $busiestDay,
        ];
    }

    private function buildHeatmapWeeks(array $dailyCounts, CarbonImmutable $startDate, CarbonImmutable $endDate): array
    {
        $gridStart = $startDate->startOfWeek(CarbonInterface::SUNDAY);
        $gridEnd = $endDate->endOfWeek(CarbonInterface::SATURDAY);
        $weeks = [];

        for ($weekStart = $gridStart; $weekStart->lte($gridEnd); $weekStart = $weekStart->addWeek()) {
            $days = [];
            $visibleDays = [];

            for ($offset = 0; $offset < 7; $offset++) {
                $day = $weekStart->addDays($offset);
                $visible = $day->betweenIncluded($startDate, $endDate);
                $count = $visible ? ($dailyCounts[$day->toDateString()] ?? 0) : 0;

                $dayPayload = [
                    'date' => $day->toDateString(),
                    'label' => $day->format('M j, Y'),
                    'count' => $count,
                    'level' => $this->resolveIntensityLevel($count),
                    'visible' => $visible,
                ];

                $days[] = $dayPayload;

                if ($visible) {
                    $visibleDays[] = $day;
                }
            }

            $weeks[] = [
                'month' => $this->resolveWeekMonthLabel($weeks, $visibleDays),
                'days' => $days,
            ];
        }

        return $weeks;
    }

    private function resolveWeekMonthLabel(array $existingWeeks, array $visibleDays): ?string
    {
        if ($visibleDays === []) {
            return null;
        }

        if ($existingWeeks === []) {
            return $visibleDays[0]->format('M');
        }

        foreach ($visibleDays as $day) {
            if ($day->day === 1) {
                return $day->format('M');
            }
        }

        return null;
    }

    private function resolveIntensityLevel(int $count): int
    {
        return match (true) {
            $count >= 30 => 5,
            $count >= 20 => 4,
            $count >= 10 => 3,
            $count >= 4 => 2,
            $count >= 1 => 1,
            default => 0,
        };
    }

    private function fetchRecentPrivateContributions(string $baseUrl, string $username, array $dailyCounts): array
    {
        $dates = collect($dailyCounts)
            ->filter(fn (int $count) => $count > 0)
            ->keys()
            ->sortDesc()
            ->take(8)
            ->values();

        if ($dates->isEmpty()) {
            return [];
        }

        $timeout = max((int) config('portfolio.gitlab.timeout', 8), 1);

        $responses = Http::pool(
            fn (Pool $pool) => $dates
                ->mapWithKeys(fn (string $date) => [
                    $date => $pool
                        ->acceptHtml()
                        ->timeout($timeout)
                        ->retry(2, 150, throw: false)
                        ->get($baseUrl.'/users/'.rawurlencode($username).'/calendar_activities', [
                            'date' => $date,
                        ]),
                ])
                ->all(),
        );

        $activities = [];

        foreach ($responses as $response) {
            if (! $response->successful()) {
                continue;
            }

            foreach ($this->parsePrivateActivityItems($response->body()) as $activity) {
                $activities[$activity['occurred_at']] = $activity;
            }
        }

        return collect($activities)
            ->sortByDesc('occurred_at')
            ->take(12)
            ->values()
            ->all();
    }

    private function parsePrivateActivityItems(string $html): array
    {
        if (trim($html) === '') {
            return [];
        }

        $document = new DOMDocument();
        $previousState = libxml_use_internal_errors(true);
        $document->loadHTML($html);
        libxml_clear_errors();
        libxml_use_internal_errors($previousState);

        $xpath = new DOMXPath($document);
        $items = $xpath->query('//li[contains(@class, "event-item")]');

        if ($items === false) {
            return [];
        }

        $activities = [];

        foreach ($items as $item) {
            $timestampNode = $xpath->query('.//*[@data-datetime]', $item)?->item(0);
            $titleNode = $xpath->query('.//*[contains(@class, "event-title")]', $item)?->item(0);

            if ($timestampNode === null || $titleNode === null) {
                continue;
            }

            $normalizedTitle = Str::of($titleNode->textContent)->squish()->lower()->value();

            if (! Str::contains($normalizedTitle, 'private contribution')) {
                continue;
            }

            $timestamp = trim((string) $timestampNode->attributes?->getNamedItem('data-datetime')?->nodeValue);

            if ($timestamp === '') {
                continue;
            }

            try {
                $occurredAt = CarbonImmutable::parse($timestamp)->utc();
            } catch (Throwable) {
                continue;
            }

            $activities[] = [
                'occurred_at' => $occurredAt->toIso8601String(),
                'date_label' => $occurredAt->format('M j, Y g:i A').' UTC',
            ];
        }

        return $activities;
    }

    private function unavailableResponse(string $baseUrl, string $username): array
    {
        return [
            'available' => false,
            'username' => $username,
            'profile_url' => $baseUrl.'/'.$username,
            'member_since' => config('portfolio.gitlab.member_since'),
            'total' => 0,
            'active_days' => 0,
            'longest_streak' => 0,
            'busiest_day' => null,
            'range_label' => null,
            'weeks' => [],
            'recent_private_contributions' => [],
        ];
    }
}

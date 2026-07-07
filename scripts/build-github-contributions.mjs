import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'resources/js/data/github-contributions.json');

const username = (process.env.GITHUB_USERNAME || 'NaguioMervina').trim();
const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
const graphqlEndpoint = 'https://api.github.com/graphql';

const contributionQuery = `
    query GitHubContributions($username: String!) {
        user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
            }
        }
    }
`;

async function main() {
    if (!username || !token) {
        await writePayload(unavailablePayload());
        return;
    }

    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: contributionQuery,
                variables: { username },
            }),
        });

        if (!response.ok) {
            throw new Error(`GitHub GraphQL request failed with status ${response.status}.`);
        }

        const payload = await response.json();

        if (payload.errors?.length) {
            throw new Error(payload.errors.map((error) => error.message).join('; '));
        }

        const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

        if (!calendar) {
            throw new Error(`GitHub user ${username} was not found or has no contribution calendar.`);
        }

        const days = calendar.weeks
            .flatMap((week) => week.contributionDays)
            .map((day) => ({
                date: day.date,
                count: Math.max(Math.trunc(Number(day.contributionCount) || 0), 0),
            }));

        const firstVisibleDay = days[0] ? parseDateString(days[0].date) : null;
        const lastVisibleDay = days[days.length - 1] ? parseDateString(days[days.length - 1].date) : null;
        const summary = buildSummary(days);

        await writePayload({
            available: true,
            username,
            profile_url: `https://github.com/${username}`,
            generated_at: new Date().toISOString(),
            total: Math.max(Math.trunc(Number(calendar.totalContributions) || 0), 0),
            active_days: summary.activeDays,
            longest_streak: summary.longestStreak,
            busiest_day: summary.busiestDay,
            range_label: firstVisibleDay && lastVisibleDay ? `${formatDateLabel(firstVisibleDay)} - ${formatDateLabel(lastVisibleDay)}` : null,
            weeks: buildHeatmapWeeks(calendar.weeks),
        });
    } catch (error) {
        console.warn(`[github] ${error instanceof Error ? error.message : 'Contribution snapshot failed.'}`);
        await writePayload(unavailablePayload());
    }
}

function buildSummary(days) {
    let activeDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let busiestDay = null;

    for (const day of days) {
        const date = parseDateString(day.date);

        if (!date) {
            currentStreak = 0;
            continue;
        }

        if (day.count > 0) {
            activeDays++;
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);

            if (!busiestDay || day.count > busiestDay.count) {
                busiestDay = {
                    date: day.date,
                    label: formatDateLabel(date),
                    count: day.count,
                };
            }

            continue;
        }

        currentStreak = 0;
    }

    return { activeDays, longestStreak, busiestDay };
}

function buildHeatmapWeeks(weeks) {
    return weeks.map((week, weekIndex) => {
        const days = week.contributionDays.map((day) => ({
            date: day.date,
            label: formatDateLabel(parseDateString(day.date)),
            count: Math.max(Math.trunc(Number(day.contributionCount) || 0), 0),
            level: resolveIntensityLevel(day.contributionCount),
            visible: true,
        }));

        return {
            month: resolveWeekMonthLabel(weekIndex, days),
            days,
        };
    });
}

function resolveWeekMonthLabel(weekIndex, days) {
    if (days.length === 0) {
        return null;
    }

    const firstDay = parseDateString(days[0].date);

    if (weekIndex === 0 && firstDay) {
        return formatMonthLabel(firstDay);
    }

    const firstOfMonth = days.find((day) => day.date.endsWith('-01'));

    return firstOfMonth ? formatMonthLabel(parseDateString(firstOfMonth.date)) : null;
}

function resolveIntensityLevel(count) {
    const normalizedCount = Math.max(Math.trunc(Number(count) || 0), 0);

    if (normalizedCount >= 30) return 5;
    if (normalizedCount >= 20) return 4;
    if (normalizedCount >= 10) return 3;
    if (normalizedCount >= 4) return 2;
    if (normalizedCount >= 1) return 1;

    return 0;
}

function unavailablePayload() {
    return {
        available: false,
        username,
        profile_url: username ? `https://github.com/${username}` : 'https://github.com',
        generated_at: new Date().toISOString(),
        total: 0,
        active_days: 0,
        longest_streak: 0,
        busiest_day: null,
        range_label: null,
        weeks: [],
    };
}

async function writePayload(payload) {
    await mkdir(path.dirname(outputPath), { recursive: true });

    try {
        const existing = JSON.parse(await readFile(outputPath, 'utf-8'));
        const { generated_at: _existingTimestamp, ...existingData } = existing;
        const { generated_at: _newTimestamp, ...newData } = payload;

        if (JSON.stringify(existingData) === JSON.stringify(newData)) {
            return;
        }
    } catch {
        // File doesn't exist or is invalid — write it.
    }

    await writeFile(outputPath, `${JSON.stringify(payload, null, 4)}\n`);
}

function parseDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
        return null;
    }

    const [year, month, day] = value.split('-').map(Number);

    return new Date(Date.UTC(year, month - 1, day));
}

function formatDateLabel(date) {
    if (!date || Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

function formatMonthLabel(date) {
    if (!date || Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        timeZone: 'UTC',
    }).format(date);
}

await main();

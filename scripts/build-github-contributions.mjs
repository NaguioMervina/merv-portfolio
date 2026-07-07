import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'resources/js/data/github-contributions.json');

const username = (process.env.GITHUB_USERNAME || 'NaguioMervina').trim();
const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
const graphqlEndpoint = 'https://api.github.com/graphql';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const userQuery = `
    query GitHubContributionUser($username: String!) {
        user(login: $username) {
            createdAt
        }
    }
`;

const contributionQuery = `
    query GitHubContributions($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
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

    const today = startOfUtcDay(new Date());

    try {
        const createdAt = await fetchUserCreatedAt();
        const searchStart = startOfUtcDay(createdAt);
        const dailyCounts = await fetchDailyCounts(searchStart, today);
        const firstContributionDate = findFirstContributionDate(dailyCounts);
        const rangeStart = firstContributionDate || today;
        const summary = buildSummary(dailyCounts, rangeStart, today);

        await writePayload({
            available: true,
            username,
            profile_url: `https://github.com/${username}`,
            generated_at: new Date().toISOString(),
            total: summary.total,
            active_days: summary.activeDays,
            longest_streak: summary.longestStreak,
            busiest_day: summary.busiestDay,
            range_label: firstContributionDate ? `${formatDateLabel(rangeStart)} - ${formatDateLabel(today)}` : 'No contributions yet',
            weeks: buildHeatmapWeeks(dailyCounts, rangeStart, today),
        });
    } catch (error) {
        console.warn(`[github] ${error instanceof Error ? error.message : 'Contribution snapshot failed.'}`);
        await writePayload(unavailablePayload());
    }
}

async function fetchUserCreatedAt() {
    const payload = await fetchGraphql(userQuery, { username });
    const createdAt = payload.data?.user?.createdAt;

    if (!createdAt) {
        throw new Error(`GitHub user ${username} was not found.`);
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`GitHub user ${username} has an invalid createdAt value.`);
    }

    return date;
}

async function fetchDailyCounts(startDate, endDate) {
    const dailyCounts = {};

    for (let rangeStart = startDate; rangeStart <= endDate; rangeStart = addDays(resolveChunkEnd(rangeStart, endDate), 1)) {
        const rangeEnd = resolveChunkEnd(rangeStart, endDate);
        const payload = await fetchGraphql(contributionQuery, {
            username,
            from: rangeStart.toISOString(),
            to: endOfUtcDay(rangeEnd).toISOString(),
        });
        const weeks = payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

        if (!Array.isArray(weeks)) {
            throw new Error(`GitHub contribution calendar was unavailable for ${username}.`);
        }

        for (const week of weeks) {
            for (const day of week.contributionDays ?? []) {
                const parsedDate = parseDateString(day.date);

                if (!parsedDate || parsedDate < startDate || parsedDate > endDate) {
                    continue;
                }

                dailyCounts[toDateString(parsedDate)] = Math.max(Math.trunc(Number(day.contributionCount) || 0), 0);
            }
        }
    }

    return dailyCounts;
}

async function fetchGraphql(query, variables) {
    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed with status ${response.status}.`);
    }

    const payload = await response.json();

    if (payload.errors?.length) {
        throw new Error(payload.errors.map((error) => error.message).join('; '));
    }

    return payload;
}

function resolveChunkEnd(rangeStart, endDate) {
    const oneYearWindowEnd = addDays(addUtcYears(rangeStart, 1), -1);

    return oneYearWindowEnd < endDate ? oneYearWindowEnd : endDate;
}

function findFirstContributionDate(dailyCounts) {
    const dates = Object.keys(dailyCounts)
        .filter((date) => dailyCounts[date] > 0)
        .sort();

    return dates.length > 0 ? parseDateString(dates[0]) : null;
}

function buildSummary(dailyCounts, startDate, endDate) {
    let total = 0;
    let activeDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let busiestDay = null;

    for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
        const count = dailyCounts[toDateString(day)] ?? 0;
        total += count;

        if (count > 0) {
            activeDays++;
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);

            if (!busiestDay || count > busiestDay.count) {
                busiestDay = {
                    date: toDateString(day),
                    label: formatDateLabel(day),
                    count,
                };
            }

            continue;
        }

        currentStreak = 0;
    }

    return { total, activeDays, longestStreak, busiestDay };
}

function buildHeatmapWeeks(dailyCounts, startDate, endDate) {
    const gridStart = startOfWeek(startDate);
    const gridEnd = endOfWeek(endDate);
    const weeks = [];

    for (let weekStart = gridStart; weekStart <= gridEnd; weekStart = addDays(weekStart, 7)) {
        const days = [];
        const visibleDays = [];

        for (let offset = 0; offset < 7; offset++) {
            const day = addDays(weekStart, offset);
            const visible = day >= startDate && day <= endDate;
            const count = visible ? (dailyCounts[toDateString(day)] ?? 0) : 0;

            if (visible) {
                visibleDays.push(day);
            }

            days.push({
                date: toDateString(day),
                label: formatDateLabel(day),
                count,
                level: resolveIntensityLevel(count),
                visible,
            });
        }

        weeks.push({
            month: resolveWeekMonthLabel(weeks, visibleDays),
            days,
        });
    }

    return weeks;
}

function resolveWeekMonthLabel(existingWeeks, visibleDays) {
    if (visibleDays.length === 0) {
        return null;
    }

    if (existingWeeks.length === 0) {
        return formatMonthLabel(visibleDays[0]);
    }

    return visibleDays.some((day) => day.getUTCDate() === 1) ? formatMonthLabel(visibleDays.find((day) => day.getUTCDate() === 1)) : null;
}

function resolveIntensityLevel(count) {
    if (count >= 30) return 5;
    if (count >= 20) return 4;
    if (count >= 10) return 3;
    if (count >= 4) return 2;
    if (count >= 1) return 1;

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

function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));
}

function startOfWeek(date) {
    return addDays(date, -date.getUTCDay());
}

function endOfWeek(date) {
    return addDays(date, 6 - date.getUTCDay());
}

function addDays(date, days) {
    return new Date(date.getTime() + days * MS_PER_DAY);
}

function addUtcYears(date, years) {
    return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}

function parseDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
        return null;
    }

    const [year, month, day] = value.split('-').map(Number);

    return new Date(Date.UTC(year, month - 1, day));
}

function toDateString(date) {
    return date.toISOString().slice(0, 10);
}

function formatDateLabel(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

function formatMonthLabel(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        timeZone: 'UTC',
    }).format(date);
}

await main();

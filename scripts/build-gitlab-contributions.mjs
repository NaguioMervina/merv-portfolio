import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'resources/js/data/gitlab-contributions.json');

const username = (process.env.GITLAB_USERNAME || process.env.VITE_GITLAB_USERNAME || 'NaguioMervina').trim();
const baseUrl = (process.env.GITLAB_BASE_URL || process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com').replace(/\/+$/, '');
const token = (process.env.GITLAB_TOKEN || process.env.VITE_GITLAB_TOKEN || '').trim();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

async function main() {
    if (!username) {
        await writePayload(unavailablePayload());
        return;
    }

    const today = startOfUtcDay(new Date());
    const startDate = new Date(Date.UTC(2010, 0, 1));
    const endpoint = new URL(`${baseUrl}/users/${encodeURIComponent(username)}/calendar.json`);

    endpoint.searchParams.set('start_date', toDateString(startDate));
    endpoint.searchParams.set('end_date', toDateString(today));

    try {
        const headers = { accept: 'application/json' };
        if (token) {
            headers['PRIVATE-TOKEN'] = token;
        }

        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
            throw new Error(`GitLab calendar request failed with status ${response.status}.`);
        }

        const calendar = await response.json();
        const dailyCounts = normalizeCalendarCounts(calendar, startDate, today);
        const firstContributionDate = findFirstContributionDate(dailyCounts);
        const rangeStart = firstContributionDate || startDate;
        const summary = buildSummary(dailyCounts, rangeStart, today);

        await writePayload({
            available: true,
            username,
            profile_url: `${baseUrl}/${username}`,
            generated_at: new Date().toISOString(),
            member_since: process.env.GITLAB_MEMBER_SINCE || null,
            total: summary.total,
            active_days: summary.activeDays,
            longest_streak: summary.longestStreak,
            busiest_day: summary.busiestDay,
            range_label: `${formatDateLabel(rangeStart)} - ${formatDateLabel(today)}`,
            weeks: buildHeatmapWeeks(dailyCounts, rangeStart, today),
        });
    } catch (error) {
        console.warn(`[gitlab] ${error instanceof Error ? error.message : 'Contribution snapshot failed.'}`);
        await writePayload(unavailablePayload());
    }
}

function normalizeCalendarCounts(calendar, startDate, endDate) {
    if (!calendar || typeof calendar !== 'object' || Array.isArray(calendar)) {
        return {};
    }

    return Object.entries(calendar).reduce((counts, [date, value]) => {
        const day = parseDateString(date);

        if (!day || day < startDate || day > endDate) {
            return counts;
        }

        const count = Number(value);

        if (Number.isFinite(count)) {
            counts[toDateString(day)] = Math.max(Math.trunc(count), 0);
        }

        return counts;
    }, {});
}

function findFirstContributionDate(dailyCounts) {
    const dates = Object.keys(dailyCounts).filter((date) => dailyCounts[date] > 0).sort();

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
        profile_url: username ? `${baseUrl}/${username}` : baseUrl,
        generated_at: new Date().toISOString(),
        member_since: null,
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

        // Preserve member_since from existing file if not set in new payload
        if (!payload.member_since && existing.member_since) {
            payload.member_since = existing.member_since;
        }

        const existingData = excludeKey(existing, 'generated_at');
        const newData = excludeKey(payload, 'generated_at');

        if (JSON.stringify(existingData) === JSON.stringify(newData)) {
            return;
        }
    } catch {
        // File doesn't exist or is invalid — write it.
    }

    await writeFile(outputPath, `${JSON.stringify(payload, null, 4)}\n`);
}

function excludeKey(obj, key) {
    const { [key]: _, ...rest } = obj;
    return rest;
}

function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
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

function parseDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
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

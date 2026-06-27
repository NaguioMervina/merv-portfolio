import { ArrowUpRight, CalendarDays, Flame, Gitlab } from 'lucide-react';
import { type ReactNode } from 'react';

export interface GitLabContributionDay {
    date: string;
    label: string;
    count: number;
    level: number;
    visible: boolean;
}

export interface GitLabContributionWeek {
    month: string | null;
    days: GitLabContributionDay[];
}

export interface GitLabContributionData {
    available: boolean;
    username: string;
    profile_url: string;
    generated_at: string;
    total: number;
    active_days: number;
    longest_streak: number;
    busiest_day: {
        date: string;
        label: string;
        count: number;
    } | null;
    range_label: string | null;
    weeks: GitLabContributionWeek[];
}

const levelClasses: Record<number, string> = {
    0: 'bg-slate-100 dark:bg-slate-900/80',
    1: 'bg-orange-200 dark:bg-orange-300/70',
    2: 'bg-orange-300 dark:bg-orange-400/80',
    3: 'bg-orange-400 dark:bg-orange-500/85',
    4: 'bg-orange-500 dark:bg-orange-500',
    5: 'bg-orange-700 dark:bg-orange-600',
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface GitLabContributionsProps {
    contributions: GitLabContributionData;
}

export function GitLabContributions({ contributions }: GitLabContributionsProps) {
    return (
        <section id="gitlab" className="relative scroll-mt-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-950/88">
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-orange-600 uppercase dark:text-orange-300">
                            <Gitlab className="size-3.5" />
                            GitLab
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Contribution activity</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                                <CalendarDays className="size-4 text-sky-500" />
                                {contributions.range_label ?? 'GitLab unavailable'}
                            </span>
                            {contributions.available && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                                    Snapshot refreshed {formatGeneratedDate(contributions.generated_at)}
                                </span>
                            )}
                        </div>
                    </div>

                    <a
                        href={contributions.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-500/15 dark:text-orange-300"
                    >
                        View GitLab profile
                        <ArrowUpRight className="size-4" />
                    </a>
                </div>

                {!contributions.available ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                        GitLab data is temporarily unavailable. The site still builds and deploys without a backend.
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid gap-4 md:grid-cols-3">
                            <MetricCard
                                icon={<Gitlab className="size-5 text-orange-500" />}
                                label="Contributions"
                                value={contributions.total.toLocaleString()}
                            />
                            <MetricCard
                                icon={<CalendarDays className="size-5 text-sky-500" />}
                                label="Active days"
                                value={contributions.active_days.toLocaleString()}
                            />
                            <MetricCard
                                icon={<Flame className="size-5 text-amber-500" />}
                                label="Longest streak"
                                value={`${contributions.longest_streak} days`}
                            />
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">
                                    Contribution heatmap
                                </h3>
                                {contributions.busiest_day && (
                                    <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                        Busiest day: {contributions.busiest_day.label} · {contributions.busiest_day.count}{' '}
                                        {pluralize(contributions.busiest_day.count, 'contribution')}
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto pb-2">
                                <div className="min-w-[48rem]">
                                    <div className="mb-3 ml-12 flex gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        {contributions.weeks.map((week, index) => (
                                            <div key={`${week.month ?? 'blank'}-${index}`} className="w-3">
                                                {week.month ?? ''}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="grid grid-rows-7 gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            {weekdayLabels.map((label) => (
                                                <div key={label} className="flex h-3 items-center">
                                                    {label === 'Mon' || label === 'Wed' || label === 'Fri' ? label : ''}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-1">
                                            {contributions.weeks.map((week, weekIndex) => (
                                                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
                                                    {week.days.map((day) => (
                                                        <div
                                                            key={day.date}
                                                            title={`${day.count} ${pluralize(day.count, 'contribution')} on ${day.label}`}
                                                            className={[
                                                                'h-3 w-3 rounded-[4px] transition-transform hover:scale-125',
                                                                day.visible
                                                                    ? levelClasses[day.level]
                                                                    : 'bg-transparent ring-1 ring-slate-200/70 ring-inset dark:ring-slate-800/80',
                                                            ].join(' ')}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span>Less</span>
                                    {Object.entries(levelClasses).map(([level, className]) => (
                                        <span key={level} className={['h-3 w-3 rounded-[4px]', className].join(' ')} />
                                    ))}
                                    <span>More</span>
                                </div>
                                <span>Tooltips show the exact day and contribution count.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">{icon}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</div>
        </div>
    );
}

function formatGeneratedDate(timestamp: string): string {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return 'during build';
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function pluralize(count: number, label: string): string {
    return count === 1 ? label : `${label}s`;
}

import { GitHubContributions, type GitHubContributionData } from '@/components/portfolio/github-contributions';
import { GitLabContributions, type GitLabContributionData } from '@/components/portfolio/gitlab-contributions';
import { SkillIcon } from '@/components/portfolio/skill-icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import githubContributionsJson from '@/data/github-contributions.json';
import gitlabContributionsJson from '@/data/gitlab-contributions.json';
import { portfolioContent, type Experience, type Project } from '@/data/portfolio';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    ArrowUpRight,
    Briefcase,
    ChevronRight,
    Code2,
    Download,
    FolderGit2,
    Github,
    Layers3,
    Linkedin,
    Mail,
    MapPin,
    MoonStar,
    Send,
    SunMedium,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';

const navigationSections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'gitlab', label: 'GitLab' },
    { id: 'github', label: 'GitHub' },
    { id: 'contact', label: 'Contact' },
];

const githubContributions = githubContributionsJson as GitHubContributionData;
const gitlabContributions = gitlabContributionsJson as GitLabContributionData;

export default function Portfolio() {
    const { profile, skills, projects, experiences } = portfolioContent;
    const [darkMode, setDarkMode] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
    const [data, setContactData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof data, string>>>({});
    const [formStatus, setFormStatus] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [showProfilePicture, setShowProfilePicture] = useState(false);

    const setData = (field: keyof typeof data, value: string) => {
        setContactData((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            setDarkMode(saved === 'true');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const skillsByCategory = useMemo(() => Object.entries(skills).sort(([left], [right]) => left.localeCompare(right)), [skills]);
    const allSkills = useMemo(() => skillsByCategory.flatMap(([, categorySkills]) => categorySkills), [skillsByCategory]);
    const topSkills = useMemo(() => allSkills.slice(0, 6), [allSkills]);
    const featuredProjects = useMemo(() => projects.filter((project) => project.is_featured), [projects]);
    const spotlightProject = featuredProjects[0] ?? projects[0] ?? null;
    const supportingProjects = useMemo(() => projects.filter((project) => project.id !== spotlightProject?.id), [projects, spotlightProject]);

    const summaryStats = useMemo(
        () => [
            { label: 'Years building', value: `${calculateYearsExperience(experiences)}+`, icon: Briefcase },
            { label: 'Projects shipped', value: `${projects.length}`, icon: FolderGit2 },
            {
                label: 'Active GitLab days',
                value: gitlabContributions.available ? `${gitlabContributions.active_days}` : '—',
                icon: Layers3,
            },
        ],
        [experiences, projects.length],
    );

    const heroSummary = profile.bio || 'I build clean, dependable web applications with a focus on practical delivery and maintainable systems.';
    const heroTagline = profile.tagline || 'Full Stack Developer';
    const personName = profile.user.name || 'Mervina Naguio';

    useEffect(() => {
        document.title = `${personName} - ${heroTagline}`;
    }, [heroTagline, personName]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (cooldown > 0) return;

        const nextErrors: Partial<Record<keyof typeof data, string>> = {};

        if (!data.name.trim()) {
            nextErrors.name = 'Name is required.';
        }

        if (!data.email.trim()) {
            nextErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!data.message.trim()) {
            nextErrors.message = 'Message is required.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setFormStatus(null);

            return;
        }

        const subject = encodeURIComponent(`Portfolio inquiry from ${data.name}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);

        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.user.email}&su=${subject}&body=${body}`, '_blank');
        setFormStatus('Your email app should open with the message ready to send.');
        setContactData({ name: '', email: '', message: '' });
        setCooldown(30);
    };

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <div className="min-h-screen bg-[#f7f7fb] text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute top-[-8rem] left-[-6rem] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-400/15" />
                    <div className="absolute top-[10rem] right-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/12" />
                    <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-orange-500/12 blur-3xl dark:bg-orange-500/15" />
                </div>

                <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
                        <button onClick={() => scrollTo('home')} className="flex items-center gap-3 text-left">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                                MN
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-950 dark:text-white">{personName}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Full Stack Developer</div>
                            </div>
                        </button>

                        <div className="hidden items-center gap-5 lg:flex">
                            {navigationSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollTo(section.id)}
                                    className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDarkMode((value) => !value)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {darkMode ? <SunMedium className="size-5" /> : <MoonStar className="size-5" />}
                            </button>
                            <button
                                onClick={() => scrollTo('contact')}
                                className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                            >
                                Contact me
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="relative">
                    <section id="home" className="px-5 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-36">
                        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] lg:items-center">
                            <div className="space-y-8">
                                <div className="space-y-5">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Software Developer · Laravel · React · Vite
                                    </p>
                                    <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl xl:text-7xl dark:text-white">
                                        {heroTagline}
                                    </h1>
                                    <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">{heroSummary}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => scrollTo('projects')}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                    >
                                        View projects
                                        <ArrowRight className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => scrollTo('contact')}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600"
                                    >
                                        Start a conversation
                                        <ChevronRight className="size-4" />
                                    </button>
                                    {profile.resume_path ? (
                                        <a
                                            href={profile.resume_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:border-sky-600"
                                        >
                                            Download CV
                                            <Download className="size-4" />
                                        </a>
                                    ) : null}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {profile?.github_url && (
                                        <SocialLink href={profile.github_url} icon={<Github className="size-4" />}>
                                            GitHub
                                        </SocialLink>
                                    )}
                                    {profile?.linkedin_url && (
                                        <SocialLink href={profile.linkedin_url} icon={<Linkedin className="size-4" />}>
                                            LinkedIn
                                        </SocialLink>
                                    )}
                                    <SocialLink href={gitlabContributions.profile_url} icon={<FolderGit2 className="size-4" />}>
                                        GitLab
                                    </SocialLink>
                                    {profile?.user?.email && (
                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.user.email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                                        >
                                            <Mail className="size-4" />
                                            {profile.user.email}
                                        </a>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    {summaryStats.map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-5 shadow-[0_25px_80px_-50px_rgba(15,23,42,0.5)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
                                        >
                                            <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                                                <stat.icon className="size-5 text-sky-500" />
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                                            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                                {stat.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),_transparent_35%)]" />
                                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_40px_120px_-65px_rgba(15,23,42,0.75)] backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-900/88">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {profile?.photo ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowProfilePicture(true)}
                                                    className="group relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-full bg-slate-100 shadow-lg ring-4 ring-white transition [aspect-ratio:1/1] [border-radius:9999px] [clip-path:circle(50%)] hover:ring-sky-500/50 sm:h-36 sm:w-36 dark:bg-slate-950 dark:ring-slate-800"
                                                >
                                                    <img src={profile.photo} alt={personName} className="absolute inset-0 h-full w-full object-cover object-top" />
                                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition group-hover:bg-black/20">
                                                        <svg
                                                            className="size-6 text-white opacity-0 transition group-hover:opacity-100"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </button>
                                            ) : (
                                                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-500 to-violet-500 text-2xl font-semibold text-white">
                                                    {personName.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xl font-semibold text-slate-950 dark:text-white">{personName}</div>
                                                <div className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{heroSummary}</div>
                                                {profile?.location && (
                                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                                        <MapPin className="size-3.5" />
                                                        {profile.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-950/80">
                                        <div className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">
                                            Profile
                                        </div>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Code2 className="mt-0.5 size-4 text-sky-500" />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Stack</div>
                                                    <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {topSkills.length > 0
                                                            ? topSkills.map((skill) => skill.name).join(' • ')
                                                            : 'Laravel • React • Inertia • Tailwind CSS'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FolderGit2 className="mt-0.5 size-4 text-orange-500" />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Featured project</div>
                                                    <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {spotlightProject ? spotlightProject.title : 'Ready for the next launch.'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Briefcase className="mt-0.5 size-4 text-emerald-500" />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Experience</div>
                                                    <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {calculateYearsExperience(experiences)}+ years across shipped work and continuing development.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {topSkills.slice(0, 5).map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl space-y-10">
                            <SectionHeading title="About" />

                            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                                <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-900/85">
                                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{heroSummary}</p>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <InfoCard label="Work style" value="Practical systems, reliable interfaces, steady iteration." />
                                        <InfoCard label="Focus" value="Full-stack product development, maintainable delivery, and clear UI." />
                                        <InfoCard
                                            label="Stack coverage"
                                            value={`${allSkills.length || 0} documented skills across multiple categories.`}
                                        />
                                        <InfoCard
                                            label="Current spotlight"
                                            value={spotlightProject ? spotlightProject.title : 'Ready for the next project.'}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-6 backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-900/82">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <InfoCard label="Location" value={profile.location || 'Philippines'} />
                                        <InfoCard label="GitLab" value={gitlabContributions.username || 'NaguioMervina'} />
                                        <InfoCard label="Projects" value={`${projects.length} published projects`} />
                                        <InfoCard
                                            label="Active days"
                                            value={gitlabContributions.available ? `${gitlabContributions.active_days} days` : 'Unavailable'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="skills" className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl space-y-10">
                            <SectionHeading title="Skills" />

                            {skillsByCategory.length > 0 ? (
                                <div className="grid gap-5 xl:grid-cols-2">
                                    {skillsByCategory.map(([category, categorySkills]) => (
                                        <div
                                            key={category}
                                            className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.6)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
                                        >
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-slate-950 capitalize dark:text-white">{category}</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {categorySkills.map((skill) => (
                                                    <div
                                                        key={skill.id}
                                                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/70"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-2 shadow-sm dark:bg-slate-800">
                                                                <SkillIcon icon={skill.icon} className="size-6" />
                                                            </div>
                                                            <div className="font-medium text-slate-950 dark:text-white">{skill.name}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No skills added yet." />
                            )}
                        </div>
                    </section>

                    <section id="projects" className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl space-y-10">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                <SectionHeading
                                    eyebrow="Selected work"
                                    title="Projects with real-world delivery context"
                                    description="A selection of shipped systems, contributor work, and practical builds."
                                />

                                <div className="grid grid-cols-2 gap-3 text-sm sm:flex sm:flex-wrap lg:justify-end">
                                    <ProjectStat label="Published" value={projects.length.toString()} />
                                    <ProjectStat label="Featured" value={featuredProjects.length.toString()} />
                                </div>
                            </div>

                            {spotlightProject ? (
                                <div className="space-y-6">
                                    <ProjectHighlightCard
                                        project={spotlightProject}
                                        onOpen={(event) => {
                                            projectTriggerRef.current = event.currentTarget;
                                            setSelectedProject(spotlightProject);
                                        }}
                                    />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="text-sm font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
                                                More project work
                                            </h3>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                            {supportingProjects.slice(0, 4).map((project) => (
                                                <div key={project.id} className="min-w-[20rem] flex-1 sm:min-w-[23rem] xl:min-w-0">
                                                    <ProjectCard
                                                        project={project}
                                                        onOpen={(event) => {
                                                            projectTriggerRef.current = event.currentTarget;
                                                            setSelectedProject(project);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState title="No projects added yet." />
                            )}
                        </div>
                    </section>

                    <section id="experience" className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl space-y-10">
                            <SectionHeading title="Experience" />

                            {experiences.length > 0 ? (
                                <div className="space-y-5">
                                    {experiences.map((experience, index) => (
                                        <div key={experience.id} className="grid gap-4 lg:grid-cols-[7rem_minmax(0,1fr)]">
                                            <div className="hidden pt-6 text-sm font-medium text-slate-500 lg:block dark:text-slate-400">
                                                {index === 0 ? 'Latest' : ''}
                                            </div>

                                            <div className="relative rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.5)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
                                                <div className="absolute top-7 left-0 hidden h-px w-6 -translate-x-full bg-slate-300 lg:block dark:bg-slate-700" />
                                                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                                                    <div>
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                                            {experience.type === 'work' ? 'Work' : 'Education'}
                                                        </div>
                                                        <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
                                                            {experience.title}
                                                        </h3>
                                                        <p className="mt-2 text-base text-sky-600 dark:text-sky-300">{experience.company}</p>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                                        <div>{formatDate(experience.start_date)}</div>
                                                        <div className="mt-1 font-medium text-slate-950 dark:text-white">
                                                            {formatDate(experience.end_date)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                    {experience.location && (
                                                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950">
                                                            <MapPin className="size-4" />
                                                            {experience.location}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{experience.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No experience added yet." />
                            )}
                        </div>
                    </section>

                    <section className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <GitLabContributions contributions={gitlabContributions} />
                        </div>
                    </section>

                    <section className="px-5 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <GitHubContributions contributions={githubContributions} />
                        </div>
                    </section>

                    <section id="contact" className="px-5 pt-20 pb-24 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl space-y-10">
                            <SectionHeading title="Contact" />

                            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                                <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-900/85">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                            Reach out
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Let’s talk.</h3>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        {profile?.user?.email && (
                                            <ContactInfoCard
                                                icon={<Mail className="size-5 text-sky-500" />}
                                                label="Email"
                                                value={profile.user.email}
                                            />
                                        )}
                                        {profile?.location && (
                                            <ContactInfoCard
                                                icon={<MapPin className="size-5 text-emerald-500" />}
                                                label="Location"
                                                value={profile.location}
                                            />
                                        )}
                                        {profile?.github_url && (
                                            <ContactInfoCard
                                                icon={<Github className="size-5 text-slate-700 dark:text-slate-300" />}
                                                label="GitHub"
                                                value={profile.github_url}
                                            />
                                        )}
                                        {profile?.linkedin_url && (
                                            <ContactInfoCard
                                                icon={<Linkedin className="size-5 text-blue-500" />}
                                                label="LinkedIn"
                                                value={profile.linkedin_url}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-slate-200/70 bg-white/92 p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur xl:p-8 dark:border-slate-800 dark:bg-slate-900/88">
                                    {formStatus && (
                                        <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                            {formStatus}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <Field
                                            label="Name"
                                            error={errors.name}
                                            input={
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(event) => setData('name', event.target.value)}
                                                    placeholder="Your name"
                                                    className={inputClassName}
                                                />
                                            }
                                        />
                                        <Field
                                            label="Email"
                                            error={errors.email}
                                            input={
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(event) => setData('email', event.target.value)}
                                                    placeholder="you@example.com"
                                                    className={inputClassName}
                                                />
                                            }
                                        />
                                        <Field
                                            label="Message"
                                            error={errors.message}
                                            input={
                                                <textarea
                                                    value={data.message}
                                                    onChange={(event) => setData('message', event.target.value)}
                                                    rows={6}
                                                    placeholder="Tell me about the role, team, or product."
                                                    className={cn(inputClassName, 'resize-none')}
                                                />
                                            }
                                        />
                                        <button
                                            type="submit"
                                            disabled={cooldown > 0}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                        >
                                            <Send className="size-4" />
                                            {cooldown > 0 ? `Please wait ${cooldown}s...` : 'Send message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-200/80 bg-white/80 px-5 py-8 text-center text-sm text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
                    © {new Date().getFullYear()} {personName}.
                </footer>
            </div>

            <Dialog
                open={selectedProject !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedProject(null);
                    }
                }}
            >
                {selectedProject && (
                    <DialogContent
                        className="max-h-[92vh] w-[calc(100%-2rem)] max-w-4xl gap-0 overflow-y-auto border-0 bg-white p-0 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.75)] sm:rounded-[2rem] dark:bg-slate-950"
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                            projectTriggerRef.current?.focus();
                        }}
                    >
                        <div className="overflow-hidden rounded-t-[2rem] bg-slate-100 dark:bg-slate-900">
                            {selectedProject.thumbnail ? (
                                <img
                                    src={selectedProject.thumbnail}
                                    alt={`Screenshot of ${selectedProject.title}`}
                                    className="max-h-[26rem] w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-72 items-center justify-center bg-gradient-to-br from-sky-500 to-violet-500 text-7xl font-semibold text-white">
                                    {selectedProject.title.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="p-6 sm:p-8">
                            <DialogHeader className="pr-8 text-left">
                                <p className="mb-2 text-sm font-semibold tracking-[0.24em] text-sky-600 uppercase dark:text-sky-300">
                                    Project details
                                </p>
                                <DialogTitle className="text-3xl leading-tight text-slate-950 dark:text-white">{selectedProject.title}</DialogTitle>
                                <DialogDescription className="pt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                                    {selectedProject.description}
                                </DialogDescription>
                                <ProjectCredit project={selectedProject} className="pt-4" linkCollaborator />
                            </DialogHeader>

                            {selectedProject.tech_stack && (
                                <div className="mt-8">
                                    <h4 className="mb-3 text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">
                                        Built with
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {techTags(selectedProject.tech_stack).map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(selectedProject.live_url || selectedProject.github_url) && (
                                <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row dark:border-slate-800">
                                    {selectedProject.live_url && (
                                        <a
                                            href={selectedProject.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                        >
                                            View live project
                                            <ArrowUpRight className="size-4" />
                                        </a>
                                    )}
                                    {selectedProject.github_url && (
                                        <a
                                            href={selectedProject.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                                        >
                                            <Github className="size-4" />
                                            View source code
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <Dialog
                open={showProfilePicture}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowProfilePicture(false);
                    }
                }}
            >
                {profile?.photo && (
                    <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 bg-white p-0 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.75)] sm:rounded-[2rem] dark:bg-slate-950">
                        <div className="relative overflow-hidden rounded-[2rem]">
                            <img src={profile.photo} alt={personName} className="max-h-[80vh] w-full object-contain" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-16">
                                <div className="text-xl font-semibold text-white">{personName}</div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
    return (
        <div className="max-w-3xl space-y-4">
            {eyebrow ? <p className="text-sm font-semibold tracking-[0.24em] text-sky-600 uppercase dark:text-sky-300">{eyebrow}</p> : null}
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">{title}</h2>
            {description ? <p className="text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">{description}</p> : null}
        </div>
    );
}

function SocialLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
        >
            {icon}
            {children}
        </a>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">{label}</div>
            <div className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{value}</div>
        </div>
    );
}

function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/85 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-400">
            <div className="font-medium text-slate-900 dark:text-white">{title}</div>
            {description ? <p className="mt-2 leading-7">{description}</p> : null}
        </div>
    );
}

function ProjectCredit({ project, className, linkCollaborator = false }: { project: Project; className?: string; linkCollaborator?: boolean }) {
    if (!project.role && !project.collaborator) {
        return null;
    }

    return (
        <div className={cn('space-y-2 text-sm text-slate-600 dark:text-slate-300', className)}>
            {project.role ? (
                <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Role:</span> {project.role}
                </div>
            ) : null}
            {project.collaborator ? (
                <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Collaborated with:</span>{' '}
                    {linkCollaborator && project.collaborator.url ? (
                        <a
                            href={project.collaborator.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-900 dark:text-sky-300 dark:decoration-sky-700 dark:hover:text-sky-200"
                        >
                            {project.collaborator.name}
                        </a>
                    ) : (
                        project.collaborator.name
                    )}
                </div>
            ) : null}
        </div>
    );
}

function ProjectStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.7)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</div>
            <div className="mt-1 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">{label}</div>
        </div>
    );
}

function ProjectHighlightCard({ project, onOpen }: { project: Project; onOpen: (event: MouseEvent<HTMLButtonElement>) => void }) {
    const tags = techTags(project.tech_stack);

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 text-left shadow-[0_34px_110px_-60px_rgba(15,23,42,0.72)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/80 hover:shadow-[0_46px_130px_-64px_rgba(14,165,233,0.55)] focus-visible:ring-4 focus-visible:ring-sky-500/40 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-sky-500/45"
            aria-label={`View details for ${project.title}`}
        >
            <div className="grid min-h-full gap-0 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                    {project.thumbnail ? (
                        <img
                            src={project.thumbnail}
                            alt=""
                            className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-72 xl:h-full xl:max-h-[28rem]"
                        />
                    ) : (
                        <div className="flex h-64 items-center justify-center bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 text-6xl font-semibold text-white sm:h-72 xl:h-full xl:max-h-[28rem]">
                            {project.title.charAt(0)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                    <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-white">
                            Featured project
                        </span>
                        {project.live_url ? (
                            <span className="rounded-full border border-emerald-300/60 bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur">
                                Live project
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col justify-between p-6 xl:p-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase dark:text-sky-300">
                                Spotlight
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                {tags.length} technologies
                            </span>
                        </div>
                        <h3 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-slate-950 dark:text-white">{project.title}</h3>
                        <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">{project.description}</p>
                        <ProjectCredit
                            project={project}
                            className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/75 p-4 dark:border-slate-800 dark:bg-slate-950/70"
                        />
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-800">
                            <span className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">Open details</span>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                                Open live site
                                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (event: MouseEvent<HTMLButtonElement>) => void }) {
    const tags = techTags(project.tech_stack);

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group grid h-full w-full overflow-hidden rounded-[1.75rem] border border-slate-200/75 bg-white/92 text-left shadow-[0_22px_80px_-58px_rgba(15,23,42,0.62)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/75 hover:shadow-[0_34px_100px_-62px_rgba(14,165,233,0.45)] focus-visible:ring-4 focus-visible:ring-sky-500/40 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900/86 dark:hover:border-sky-500/45"
            aria-label={`View details for ${project.title}`}
        >
            <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-slate-950">
                {project.thumbnail ? (
                    <img src={project.thumbnail} alt="" className="h-32 w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-sky-700 to-violet-700 text-3xl font-semibold text-white">
                        {project.title.charAt(0)}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                {project.role ? project.role : project.is_featured ? 'Featured' : 'Project'}
                            </span>
                        </div>
                        <h3 className="mt-3 text-xl leading-tight font-semibold text-slate-950 dark:text-white">{project.title}</h3>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-300" />
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
                <ProjectCredit project={project} className="mt-3" />

                <div className="mt-5 flex flex-wrap gap-2">
                    {tags.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                        >
                            {tech}
                        </span>
                    ))}
                    {tags.length > 4 ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                            +{tags.length - 4} more
                        </span>
                    ) : null}
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4 text-sm font-semibold text-sky-700 dark:border-slate-800 dark:text-sky-300">
                    View project details
                </div>
            </div>
        </button>
    );
}

function ContactInfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/75 p-4 dark:border-slate-800 dark:bg-slate-950/75">
            <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">{icon}</div>
                <div>
                    <div className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">{label}</div>
                    <div className="mt-2 text-sm break-all text-slate-700 dark:text-slate-200">{value}</div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, input, error }: { label: string; input: ReactNode; error?: string }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
            {input}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}

const inputClassName =
    'w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500';

function techTags(stack: string | null | undefined): string[] {
    return stack
        ? stack
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
        : [];
}

function formatDate(date: string | null | undefined): string {
    if (!date) {
        return 'Present';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}

function calculateYearsExperience(experiences: Experience[]): number {
    const workStartDates = experiences
        .filter((experience) => experience.type === 'work' && experience.start_date)
        .map((experience) => new Date(experience.start_date))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((left, right) => left.getTime() - right.getTime());

    if (workStartDates.length === 0) {
        return 1;
    }

    const diff = Date.now() - workStartDates[0].getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

    return Math.max(years, 1);
}

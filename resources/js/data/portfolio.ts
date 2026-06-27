export interface Profile {
    id: number;
    user_id: number;
    tagline: string;
    bio: string;
    photo: string | null;
    resume_path: string | null;
    location: string;
    phone: string | null;
    github_url: string;
    linkedin_url: string | null;
    twitter_url: string | null;
    user: { name: string; email: string };
}

export interface Skill {
    id: number;
    name: string;
    icon: string;
    category: string;
    proficiency: number;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    tech_stack: string;
    live_url: string | null;
    github_url: string | null;
    is_featured: boolean;
}

export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string | null;
    description: string;
    type: string;
}

export interface PortfolioContent {
    profile: Profile;
    skills: Record<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
}

export const portfolioContent: PortfolioContent = {
    profile: {
        id: 1,
        user_id: 1,
        tagline: 'Full-stack developer with strong Laravel and MySQL skills.',
        bio: 'I build and maintain web-based applications with a strong focus on Laravel, MySQL, and practical school management workflows. My experience spans frontend and backend development, database management, troubleshooting, user support, and performance improvements for real operational systems.',
        photo: '/merv.jpg',
        resume_path: null,
        location: 'Zamboanga City, Philippines',
        phone: null,
        github_url: 'https://github.com/NaguioMervina',
        linkedin_url: 'https://www.linkedin.com/in/mervin-naguio-112471282/',
        twitter_url: null,
        user: {
            name: 'Mervin Naguio',
            email: 'mervynaguio@gmail.com',
        },
    },
    skills: {
        backend: [
            { id: 1, name: 'Laravel', icon: 'laravel', category: 'backend', proficiency: 92 },
            { id: 2, name: 'PHP', icon: 'php', category: 'backend', proficiency: 88 },
            { id: 3, name: 'RESTful APIs', icon: 'api', category: 'backend', proficiency: 84 },
            { id: 4, name: 'MVC Architecture', icon: 'architecture', category: 'backend', proficiency: 86 },
        ],
        frontend: [
            { id: 5, name: 'JavaScript', icon: 'javascript', category: 'frontend', proficiency: 86 },
            { id: 6, name: 'React.js', icon: 'react', category: 'frontend', proficiency: 82 },
            { id: 7, name: 'Vue.js', icon: 'vue', category: 'frontend', proficiency: 78 },
            { id: 8, name: 'HTML, CSS, Bootstrap', icon: 'layout', category: 'frontend', proficiency: 88 },
        ],
        database: [
            { id: 9, name: 'MySQL', icon: 'mysql', category: 'database', proficiency: 86 },
            { id: 10, name: 'Database Design', icon: 'database', category: 'database', proficiency: 82 },
        ],
        tools: [
            { id: 11, name: 'Git, GitHub, GitLab', icon: 'git', category: 'tools', proficiency: 88 },
            { id: 12, name: 'Docker', icon: 'docker', category: 'tools', proficiency: 76 },
            { id: 13, name: 'Jira', icon: 'jira', category: 'tools', proficiency: 78 },
            { id: 14, name: 'WSL Ubuntu', icon: 'terminal', category: 'tools', proficiency: 80 },
            { id: 16, name: 'PuTTY', icon: 'putty', category: 'tools', proficiency: 80 },
            { id: 17, name: 'MySQL Workbench', icon: 'mysql-workbench', category: 'tools', proficiency: 82 },
        ],
    },
    projects: [
        {
            id: 1,
            title: 'School Management System',
            description:
                'A large-scale school management system maintained and enhanced at KumoSoft Inc., covering enrollment, grading, scheduling, and student classification workflows.',
            thumbnail: '/thumbnails/62409655-80eb-49ce-9f12-9bd67ec437e7.png',
            tech_stack: 'Laravel, React, Inertia.js, Tailwind CSS, MySQL',
            live_url: null,
            github_url: null,
            is_featured: false,
        },
        {
            id: 2,
            title: 'WMSU Distance Learning CMS',
            description:
                'A web-based content management system for Western Mindanao State University that helps showcase and promote distance learning programs while allowing administrators to manage site content.',
            thumbnail: null,
            tech_stack: 'PHP, HTML, CSS, JavaScript, CMS',
            live_url: null,
            github_url: null,
            is_featured: false,
        },
        {
            id: 3,
            title: 'Collab Ticketing System',
            description:
                'A collaborative ticketing system for managing tasks, tracking issues, and streamlining team workflows in real time.',
            thumbnail: null,
            tech_stack: 'Laravel, React, MySQL',
            live_url: 'https://twiddling-likewise-perfected.ngrok-free.dev/',
            github_url: null,
            is_featured: false,
        },
        {
            id: 4,
            title: 'RMMC Main - School Management System',
            description:
                'A comprehensive school management system for RMMC Main campus, handling enrollment, grading, scheduling, student records, and administrative workflows for the institution.',
            thumbnail: null,
            tech_stack: 'Laravel, React, Inertia.js, Tailwind CSS, MySQL',
            live_url: 'https://rmmcmain.com',
            github_url: null,
            is_featured: false,
        },
        {
            id: 5,
            title: 'RMMC MI - School Management System',
            description:
                'A school management system for RMMC MI campus, providing enrollment management, grade tracking, class scheduling, and student information management capabilities.',
            thumbnail: null,
            tech_stack: 'Laravel, React, Inertia.js, Tailwind CSS, MySQL',
            live_url: 'https://rmmcmi.com',
            github_url: null,
            is_featured: true,
        },
    ],
    experiences: [
        {
            id: 1,
            title: 'Full Stack Developer',
            company: 'KumoSoft Inc.',
            location: 'Koronadal City, South Cotabato',
            start_date: '2024-06-12',
            end_date: null,
            description:
                'Developed and maintained a school management system using Laravel and MySQL. Enhanced enrollment, grading, scheduling, and student classification modules while supporting users and improving system functionality.',
            type: 'work',
        },
        {
            id: 2,
            title: 'IT Technical Support Assistant',
            company: 'Pricewise Marketing Corporation',
            location: 'Zamboanga City, Philippines',
            start_date: '2023-09-01',
            end_date: '2024-06-01',
            description:
                'Provided IT support to employees by resolving hardware and software issues. Maintained and optimized IT equipment to reduce downtime and support productivity.',
            type: 'work',
        },
        {
            id: 3,
            title: 'Bachelor of Science in Information Technology',
            company: 'Western Mindanao State University',
            location: 'Zamboanga City, Philippines',
            start_date: '2018-01-01',
            end_date: '2023-01-01',
            description:
                'Completed a Bachelor of Science in Information Technology with project work focused on web-based content management systems.',
            type: 'education',
        },
    ],
};

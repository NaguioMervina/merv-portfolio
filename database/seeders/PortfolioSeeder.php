<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Skill;
use App\Models\Project;
use App\Models\Experience;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ["email" => "masterkim@example.com"],
            [
                "name" => "Master Kim",
                "password" => Hash::make("password"),
            ]
        );

        Profile::firstOrCreate(
            ["user_id" => $user->id],
            [
                "tagline" => "Full Stack Developer",
                "bio" => "Passionate Full Stack Developer with a love for building clean, efficient, and user-friendly web applications. I specialize in Laravel and React, bringing ideas to life through code.",
                "location" => "Philippines",
                "github_url" => "https://github.com/masterkim",
                "linkedin_url" => "https://linkedin.com/in/masterkim",
            ]
        );

        $skills = [
            ["name" => "React", "icon" => "react", "category" => "frontend", "proficiency" => 85],
            ["name" => "Vue.js", "icon" => "vue", "category" => "frontend", "proficiency" => 80],
            ["name" => "JavaScript", "icon" => "javascript", "category" => "frontend", "proficiency" => 90],
            ["name" => "TypeScript", "icon" => "typescript", "category" => "frontend", "proficiency" => 75],
            ["name" => "HTML/CSS", "icon" => "html", "category" => "frontend", "proficiency" => 95],
            ["name" => "Tailwind CSS", "icon" => "tailwind", "category" => "frontend", "proficiency" => 90],
            ["name" => "Laravel", "icon" => "laravel", "category" => "backend", "proficiency" => 85],
            ["name" => "PHP", "icon" => "php", "category" => "backend", "proficiency" => 85],
            ["name" => "Node.js", "icon" => "nodejs", "category" => "backend", "proficiency" => 70],
            ["name" => "MySQL", "icon" => "mysql", "category" => "database", "proficiency" => 80],
            ["name" => "Git", "icon" => "git", "category" => "tools", "proficiency" => 90],
            ["name" => "Docker", "icon" => "docker", "category" => "tools", "proficiency" => 70],
            ["name" => "REST APIs", "icon" => "api", "category" => "backend", "proficiency" => 85],
        ];

        foreach ($skills as $index => $skill) {
            Skill::firstOrCreate(
                ["name" => $skill["name"]],
                array_merge($skill, ["sort_order" => $index])
            );
        }

        $projects = [
            [
                "title" => "E-Commerce Platform",
                "description" => "A full-featured e-commerce platform built with Laravel and React. Features include product management, cart, checkout, and admin dashboard.",
                "tech_stack" => "Laravel, React, MySQL, Tailwind CSS",
                "is_featured" => true,
            ],
            [
                "title" => "Task Management App",
                "description" => "A collaborative task management application with real-time updates, drag-and-drop boards, and team collaboration features.",
                "tech_stack" => "Vue.js, Laravel, Pusher, MySQL",
                "is_featured" => true,
            ],
            [
                "title" => "Portfolio Website",
                "description" => "A professional portfolio website with dark/light mode, animations, and an admin panel for content management.",
                "tech_stack" => "Laravel, React, Inertia.js, Tailwind CSS",
                "is_featured" => true,
            ],
            [
                "title" => "Blog CMS",
                "description" => "A custom content management system for bloggers with markdown support, categories, tags, and SEO optimization.",
                "tech_stack" => "Laravel, Vue.js, MySQL",
                "is_featured" => false,
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::firstOrCreate(
                ["title" => $project["title"]],
                array_merge($project, ["sort_order" => $index])
            );
        }

        $experiences = [
            [
                "title" => "Junior Full Stack Developer",
                "company" => "Tech Solutions Inc.",
                "location" => "Philippines",
                "start_date" => "2024-01-15",
                "end_date" => null,
                "description" => "Developing and maintaining web applications using Laravel and React. Collaborating with the team to deliver high-quality software solutions.",
                "type" => "work",
            ],
            [
                "title" => "Web Development Intern",
                "company" => "Digital Agency Co.",
                "location" => "Philippines",
                "start_date" => "2023-06-01",
                "end_date" => "2023-12-31",
                "description" => "Assisted in building client websites, learned best practices in web development, and contributed to multiple projects.",
                "type" => "work",
            ],
            [
                "title" => "BS Computer Science",
                "company" => "University of Technology",
                "location" => "Philippines",
                "start_date" => "2020-08-01",
                "end_date" => "2024-05-30",
                "description" => "Studied computer science fundamentals, algorithms, data structures, and software engineering principles.",
                "type" => "education",
            ],
        ];

        foreach ($experiences as $index => $experience) {
            Experience::firstOrCreate(
                ["title" => $experience["title"], "company" => $experience["company"]],
                array_merge($experience, ["sort_order" => $index])
            );
        }

        $settings = [
            "site_name" => "Master Kim - Portfolio",
            "site_description" => "Full Stack Developer Portfolio",
            "contact_email" => "masterkim@example.com",
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }
    }
}

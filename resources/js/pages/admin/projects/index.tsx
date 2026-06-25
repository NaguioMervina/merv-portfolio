import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Project {
    id: number;
    title: string;
    description: string;
    tech_stack: string;
    is_featured: boolean;
    sort_order: number;
}

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: "Projects", href: "/admin/projects" }]}>
            <Head title="Manage Projects" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Link href="/admin/projects/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Project</Link>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Title</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Tech Stack</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Featured</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                    <td className="px-6 py-4 font-medium">{project.title}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{project.tech_stack}</td>
                                    <td className="px-6 py-4">{project.is_featured ? <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">Yes</span> : <span className="text-neutral-400">No</span>}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/admin/projects/${project.id}/edit`} className="text-blue-500 hover:underline text-sm">Edit</Link>
                                        <button onClick={() => { if (confirm("Delete this project?")) router.delete(`/admin/projects/${project.id}`); }} className="text-rose-500 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

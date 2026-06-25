import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Skill { id: number; name: string; category: string; proficiency: number; sort_order: number; }

export default function SkillsIndex({ skills }: { skills: Skill[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: "Skills", href: "/admin/skills" }]}>
            <Head title="Manage Skills" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Skills</h1>
                    <Link href="/admin/skills/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Skill</Link>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Category</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Proficiency</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {skills.map((skill) => (
                                <tr key={skill.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                    <td className="px-6 py-4 font-medium">{skill.name}</td>
                                    <td className="px-6 py-4 text-sm capitalize">{skill.category}</td>
                                    <td className="px-6 py-4"><div className="w-24 bg-neutral-200 dark:bg-neutral-600 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: skill.proficiency + "%" }} /></div></td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/admin/skills/${skill.id}/edit`} className="text-blue-500 hover:underline text-sm">Edit</Link>
                                        <button onClick={() => { if (confirm("Delete this skill?")) router.delete(`/admin/skills/${skill.id}`); }} className="text-rose-500 hover:underline text-sm">Delete</button>
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

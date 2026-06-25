import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Experience { id: number; title: string; company: string; type: string; start_date: string; end_date: string | null; sort_order: number; }

export default function ExperiencesIndex({ experiences }: { experiences: Experience[] }) {
    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";
    return (
        <AppLayout breadcrumbs={[{ title: "Experience", href: "/admin/experiences" }]}>
            <Head title="Manage Experience" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Experience</h1>
                    <Link href="/admin/experiences/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Entry</Link>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Title</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Company</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Type</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Period</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {experiences.map((exp) => (
                                <tr key={exp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                    <td className="px-6 py-4 font-medium">{exp.title}</td>
                                    <td className="px-6 py-4 text-sm">{exp.company}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${exp.type === "work" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"}`}>{exp.type}</span></td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(exp.start_date)} - {formatDate(exp.end_date)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/admin/experiences/${exp.id}/edit`} className="text-blue-500 hover:underline text-sm">Edit</Link>
                                        <button onClick={() => { if (confirm("Delete?")) router.delete(`/admin/experiences/${exp.id}`); }} className="text-rose-500 hover:underline text-sm">Delete</button>
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

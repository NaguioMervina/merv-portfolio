import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Skill { id?: number; name: string; icon: string; category: string; proficiency: number; sort_order: number; }

export default function SkillForm({ skill }: { skill?: Skill }) {
    const isEdit = !!skill;
    const { data, setData, post, put, processing, errors } = useForm({
        name: skill?.name || "",
        icon: skill?.icon || "",
        category: skill?.category || "general",
        proficiency: skill?.proficiency || 80,
        sort_order: skill?.sort_order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) { put(`/admin/skills/${skill!.id}`); } else { post("/admin/skills"); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Skills", href: "/admin/skills" }, { title: isEdit ? "Edit" : "Create", href: "#" }]}>
            <Head title={isEdit ? "Edit Skill" : "Create Skill"} />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Skill" : "Create Skill"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Icon Key</label>
                        <input type="text" value={data.icon} onChange={(e) => setData("icon", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" placeholder="react, vue, laravel" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <select value={data.category} onChange={(e) => setData("category", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900">
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">Database</option>
                            <option value="tools">Tools</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Proficiency ({data.proficiency}%)</label>
                        <input type="range" min="0" max="100" value={data.proficiency} onChange={(e) => setData("proficiency", parseInt(e.target.value))} className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort Order</label>
                        <input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", parseInt(e.target.value) || 0)} className="w-32 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">{processing ? "Saving..." : "Save"}</button>
                        <Link href="/admin/skills" className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600">Cancel</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

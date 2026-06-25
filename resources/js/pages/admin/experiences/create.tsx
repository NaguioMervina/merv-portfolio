import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Experience { id?: number; title: string; company: string; location: string; start_date: string; end_date: string; description: string; type: string; sort_order: number; }

export default function ExperienceForm({ experience }: { experience?: Experience }) {
    const isEdit = !!experience;
    const { data, setData, post, put, processing, errors } = useForm({
        title: experience?.title || "",
        company: experience?.company || "",
        location: experience?.location || "",
        start_date: experience?.start_date || "",
        end_date: experience?.end_date || "",
        description: experience?.description || "",
        type: experience?.type || "work",
        sort_order: experience?.sort_order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) { put(`/admin/experiences/${experience!.id}`); } else { post("/admin/experiences"); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Experience", href: "/admin/experiences" }, { title: isEdit ? "Edit" : "Create", href: "#" }]}>
            <Head title={isEdit ? "Edit Experience" : "Create Experience"} />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Experience" : "Create Experience"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input type="text" value={data.title} onChange={(e) => setData("title", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        {errors.title && <p className="text-rose-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company *</label>
                        <input type="text" value={data.company} onChange={(e) => setData("company", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" value={data.location} onChange={(e) => setData("location", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <input type="date" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date (blank = Present)</label>
                            <input type="date" value={data.end_date} onChange={(e) => setData("end_date", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type *</label>
                        <select value={data.type} onChange={(e) => setData("type", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900">
                            <option value="work">Work</option>
                            <option value="education">Education</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea value={data.description} onChange={(e) => setData("description", e.target.value)} rows={4} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort Order</label>
                        <input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", parseInt(e.target.value) || 0)} className="w-32 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">{processing ? "Saving..." : "Save"}</button>
                        <Link href="/admin/experiences" className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600">Cancel</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

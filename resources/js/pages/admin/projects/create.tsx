import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import ImageUpload from "@/components/image-upload";

interface Project {
    id?: number;
    title: string;
    description: string;
    thumbnail: string;
    tech_stack: string;
    live_url: string;
    github_url: string;
    is_featured: boolean;
    sort_order: number;
}

export default function ProjectForm({ project }: { project?: Project }) {
    const isEdit = !!project;
    const { data, setData, post, put, processing, errors } = useForm({
        title: project?.title || "",
        description: project?.description || "",
        thumbnail: project?.thumbnail || "",
        tech_stack: project?.tech_stack || "",
        live_url: project?.live_url || "",
        github_url: project?.github_url || "",
        is_featured: project?.is_featured || false,
        sort_order: project?.sort_order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) { put(`/admin/projects/${project!.id}`); } else { post("/admin/projects"); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Projects", href: "/admin/projects" }, { title: isEdit ? "Edit" : "Create", href: "#" }]}>
            <Head title={isEdit ? "Edit Project" : "Create Project"} />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Project" : "Create Project"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input type="text" value={data.title} onChange={(e) => setData("title", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        {errors.title && <p className="text-rose-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <ImageUpload value={data.thumbnail} onChange={(url) => setData("thumbnail", url)} />
                    <div>
                        <label className="block text-sm font-medium mb-1">Description *</label>
                        <textarea value={data.description} onChange={(e) => setData("description", e.target.value)} rows={4} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                        {errors.description && <p className="text-rose-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tech Stack (comma-separated)</label>
                        <input type="text" value={data.tech_stack} onChange={(e) => setData("tech_stack", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" placeholder="Laravel, React, MySQL" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Live URL</label>
                        <input type="text" value={data.live_url} onChange={(e) => setData("live_url", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">GitHub URL</label>
                        <input type="text" value={data.github_url} onChange={(e) => setData("github_url", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={data.is_featured} onChange={(e) => setData("is_featured", e.target.checked)} className="rounded" />
                        <label className="text-sm font-medium">Featured Project</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort Order</label>
                        <input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", parseInt(e.target.value) || 0)} className="w-32 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">{processing ? "Saving..." : "Save"}</button>
                        <Link href="/admin/projects" className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600">Cancel</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

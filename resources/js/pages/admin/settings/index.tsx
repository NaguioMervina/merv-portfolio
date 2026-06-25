import ImageUpload from "@/components/image-upload";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

interface ProfileFormData {
    name: string;
    email: string;
    tagline: string;
    bio: string;
    photo: string;
    location: string;
    github_url: string;
    linkedin_url: string;
}

interface PageProps {
    profile: ProfileFormData;
    flash?: { success?: string };
}

export default function SettingsIndex({ profile, flash }: PageProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        name: profile.name || "",
        email: profile.email || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        photo: profile.photo || "",
        location: profile.location || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put("/admin/settings");
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Portfolio", href: "/admin/settings" }]}>
            <Head title="Portfolio Settings" />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-2">Portfolio Settings</h1>
                <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">These fields control the public portfolio on the home page.</p>
                {(flash?.success || recentlySuccessful) && (
                    <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">Settings updated successfully.</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tagline</label>
                        <input type="text" value={data.tagline} onChange={(e) => setData("tagline", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <ImageUpload value={data.photo} onChange={(url) => setData("photo", url)} label="Profile Photo" />
                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea value={data.bio} onChange={(e) => setData("bio", e.target.value)} rows={5} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" value={data.location} onChange={(e) => setData("location", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">GitHub URL</label>
                        <input type="url" value={data.github_url} onChange={(e) => setData("github_url", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                        <input type="url" value={data.linkedin_url} onChange={(e) => setData("linkedin_url", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">{processing ? "Saving..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

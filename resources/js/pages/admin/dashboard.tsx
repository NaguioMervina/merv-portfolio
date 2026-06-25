import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Stats {
    projects: number;
    skills: number;
    experiences: number;
    unread_contacts: number;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface PageProps {
    stats: Stats;
    recent_contacts: Contact[];
}

export default function AdminDashboard({ stats, recent_contacts }: PageProps) {
    return (
        <AppLayout breadcrumbs={[{ title: "Dashboard", href: "/admin" }]}>
            <Head title="Admin Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link href="/admin/projects" className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                        <div className="text-3xl font-bold text-blue-500">{stats.projects}</div>
                        <div className="text-neutral-600 dark:text-neutral-400">Projects</div>
                    </Link>
                    <Link href="/admin/skills" className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                        <div className="text-3xl font-bold text-green-500">{stats.skills}</div>
                        <div className="text-neutral-600 dark:text-neutral-400">Skills</div>
                    </Link>
                    <Link href="/admin/experiences" className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                        <div className="text-3xl font-bold text-purple-500">{stats.experiences}</div>
                        <div className="text-neutral-600 dark:text-neutral-400">Experiences</div>
                    </Link>
                    <Link href="/admin/contacts" className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                        <div className="text-3xl font-bold text-rose-500">{stats.unread_contacts}</div>
                        <div className="text-neutral-600 dark:text-neutral-400">Unread Messages</div>
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
                    {recent_contacts.length === 0 ? (
                        <p className="text-neutral-500">No messages yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recent_contacts.map((contact) => (
                                <Link
                                    key={contact.id}
                                    href={`/admin/contacts/${contact.id}`}
                                    className="block p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">{contact.name}</div>
                                            <div className="text-sm text-neutral-500">{contact.email}</div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1">{contact.message}</div>
                                        </div>
                                        <div className="text-xs text-neutral-400">{new Date(contact.created_at).toLocaleDateString()}</div>
                                    </div>
                                    {!contact.is_read && <span className="inline-block mt-2 w-2 h-2 bg-blue-500 rounded-full" />}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Contact { id: number; name: string; email: string; message: string; is_read: boolean; created_at: string; }

export default function ContactsIndex({ contacts }: { contacts: Contact[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: "Contacts", href: "/admin/contacts" }]}>
            <Head title="Contact Messages" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Message</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">Date</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-neutral-600 dark:text-neutral-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {contacts.map((c) => (
                                <tr key={c.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${!c.is_read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                                    <td className="px-6 py-4 font-medium">{c.name} {!c.is_read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-1" />}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{c.email}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate">{c.message}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/admin/contacts/${c.id}`} className="text-blue-500 hover:underline text-sm">View</Link>
                                        <button onClick={() => { if (confirm("Delete?")) router.delete(`/admin/contacts/${c.id}`); }} className="text-rose-500 hover:underline text-sm">Delete</button>
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

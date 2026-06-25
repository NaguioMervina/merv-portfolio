import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Contact { id: number; name: string; email: string; message: string; is_read: boolean; created_at: string; }

export default function ContactShow({ contact }: { contact: Contact }) {
    return (
        <AppLayout breadcrumbs={[{ title: "Contacts", href: "/admin/contacts" }, { title: "Message", href: "#" }]}>
            <Head title={`Message from ${contact.name}`} />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Message from {contact.name}</h1>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="mb-4">
                        <div className="text-sm text-neutral-500">From</div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-blue-500">{contact.email}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-sm text-neutral-500">Received</div>
                        <div>{new Date(contact.created_at).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-neutral-500 mb-1">Message</div>
                        <div className="whitespace-pre-wrap p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">{contact.message}</div>
                    </div>
                    <div className="mt-6">
                        <a href={`mailto:${contact.email}?subject=Re: Your message`} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block">Reply via Email</a>
                    </div>
                </div>
                <Link href="/admin/contacts" className="mt-4 inline-block text-blue-500 hover:underline">← Back to messages</Link>
            </div>
        </AppLayout>
    );
}

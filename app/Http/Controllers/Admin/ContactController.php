<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/contacts/index", [
            "contacts" => Contact::latest()->get(),
        ]);
    }

    public function show(Contact $contact)
    {
        $contact->update(["is_read" => true]);

        return Inertia::render("admin/contacts/show", [
            "contact" => $contact,
        ]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return to_route("admin.contacts.index");
    }
}

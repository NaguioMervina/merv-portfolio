<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit(Request $request)
    {
        $profile = $this->resolvePortfolioProfile($request->user());

        return Inertia::render("admin/settings/index", [
            "profile" => [
                "name" => $profile->user?->name ?? "",
                "email" => $profile->user?->email ?? "",
                "tagline" => $profile->tagline ?? "",
                "bio" => $profile->bio ?? "",
                "photo" => $profile->photo ?? "",
                "location" => $profile->location ?? "",
                "github_url" => $profile->github_url ?? "",
                "linkedin_url" => $profile->linkedin_url ?? "",
            ],
        ]);
    }

    public function update(Request $request)
    {
        $profile = $this->resolvePortfolioProfile($request->user());
        $user = $profile->user ?? $request->user();

        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => [
                "required",
                "string",
                "lowercase",
                "email",
                "max:255",
                Rule::unique(User::class)->ignore($user->id),
            ],
            "tagline" => "nullable|string|max:255",
            "bio" => "nullable|string|max:5000",
            "photo" => "nullable|string|max:2048",
            "location" => "nullable|string|max:255",
            "github_url" => "nullable|url|max:500",
            "linkedin_url" => "nullable|url|max:500",
        ]);

        $user->fill([
            "name" => $validated["name"],
            "email" => $validated["email"],
        ]);

        if ($user->isDirty("email")) {
            $user->email_verified_at = null;
        }

        $user->save();

        $profile->fill($this->normalizeProfileValues([
            "tagline" => $validated["tagline"] ?? null,
            "bio" => $validated["bio"] ?? null,
            "photo" => $validated["photo"] ?? null,
            "location" => $validated["location"] ?? null,
            "github_url" => $validated["github_url"] ?? null,
            "linkedin_url" => $validated["linkedin_url"] ?? null,
        ]));
        $profile->save();

        Setting::set("site_name", trim($user->name) !== "" ? $user->name . " - Portfolio" : null);
        Setting::set("site_description", $validated["tagline"] ?? null);
        Setting::set("contact_email", $user->email);

        return back()->with("success", "Settings updated successfully.");
    }

    private function resolvePortfolioProfile(User $fallbackUser): Profile
    {
        $profile = Profile::with("user")->orderBy("id")->first();

        if ($profile) {
            if (!$profile->user) {
                $profile->user()->associate($fallbackUser);
                $profile->save();

                return $profile->load("user");
            }

            return $profile;
        }

        return Profile::create([
            "user_id" => $fallbackUser->id,
        ])->load("user");
    }

    private function normalizeProfileValues(array $values): array
    {
        return collect($values)
            ->map(fn ($value) => is_string($value) && trim($value) === "" ? null : $value)
            ->all();
    }
}

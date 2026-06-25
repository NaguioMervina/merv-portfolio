<?php

namespace Tests\Feature\Admin;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_settings_updates_the_public_portfolio_profile_and_linked_user(): void
    {
        $this->withoutMiddleware();

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        $portfolioUser = User::factory()->create([
            'name' => 'Old Portfolio Name',
            'email' => 'old-portfolio@example.com',
        ]);

        $profile = Profile::create([
            'user_id' => $portfolioUser->id,
            'tagline' => 'Old tagline',
            'bio' => 'Old bio',
            'location' => 'Old location',
            'github_url' => 'https://github.com/old-user',
        ]);

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'name' => 'Mervina Naguio',
                'email' => 'mervina@example.com',
                'tagline' => 'Full Stack Developer',
                'bio' => 'Builds practical full-stack products.',
                'photo' => '/thumbnails/mervina.png',
                'location' => 'Philippines',
                'github_url' => 'https://github.com/NaguioMervina',
                'linkedin_url' => 'https://www.linkedin.com/in/mervina-naguio',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $portfolioUser->id,
            'name' => 'Mervina Naguio',
            'email' => 'mervina@example.com',
        ]);

        $this->assertDatabaseHas('profiles', [
            'id' => $profile->id,
            'tagline' => 'Full Stack Developer',
            'bio' => 'Builds practical full-stack products.',
            'photo' => '/thumbnails/mervina.png',
            'location' => 'Philippines',
            'github_url' => 'https://github.com/NaguioMervina',
            'linkedin_url' => 'https://www.linkedin.com/in/mervina-naguio',
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'contact_email',
            'value' => 'mervina@example.com',
        ]);
    }

    public function test_admin_settings_creates_a_public_profile_for_the_current_admin_when_none_exists(): void
    {
        $this->withoutMiddleware();

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'name' => 'Mervina Naguio',
                'email' => 'mervina@example.com',
                'tagline' => 'Full Stack Developer',
                'bio' => 'Builds practical full-stack products.',
                'photo' => '/thumbnails/mervina.png',
                'location' => 'Philippines',
                'github_url' => 'https://github.com/NaguioMervina',
                'linkedin_url' => 'https://www.linkedin.com/in/mervina-naguio',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('profiles', [
            'user_id' => $admin->id,
            'tagline' => 'Full Stack Developer',
        ]);
    }
}

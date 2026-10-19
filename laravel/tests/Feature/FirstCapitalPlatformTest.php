<?php

namespace Tests\Feature;

use App\Models\AdminAccount;
use App\Models\Lead;
use Database\Seeders\AppSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FirstCapitalPlatformTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AppSettingSeeder::class);
    }

    /**
     * Test public landing page loads.
     */
    public function test_public_landing_page_loads_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test Design Option 2 page loads.
     */
    public function test_design_option_2_loads_successfully(): void
    {
        $response = $this->get('/design-option-2');
        $response->assertStatus(200);
    }

    /**
     * Test personality share page loads.
     */
    public function test_personality_share_page_loads(): void
    {
        $response = $this->get('/keep-it-cool-female.html');
        $response->assertStatus(200);
    }

    /**
     * Test public API returns questions.
     */
    public function test_api_questions_returns_active_questions(): void
    {
        $response = $this->getJson('/api/questions');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test public API returns personality results.
     */
    public function test_api_results_returns_outcomes(): void
    {
        $response = $this->getJson('/api/results');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test public lead capture validates inputs.
     */
    public function test_api_lead_submission_requires_valid_data(): void
    {
        $response = $this->postJson('/api/leads', [
            'name' => '',
            'email' => 'invalid-email',
            'phone' => '',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test public lead capture saves to database.
     */
    public function test_api_lead_submission_creates_record(): void
    {
        $payload = [
            'name' => 'Automated Test Prospect',
            'email' => 'prospect.test@firstcapital.lk',
            'phone' => '+94 77 999 8888',
            'gender' => 'female',
            'profileKey' => 'A',
            'profileName' => 'The Keep-It-Cool Investor',
            'matchedProduct' => 'First Capital Money Market Fund (FCMMF)*',
            'source' => 'Landing Page Quiz',
            'answers' => [
                ['questionId' => 1, 'selected' => 'A'],
                ['questionId' => 2, 'selected' => 'A'],
            ],
        ];

        $response = $this->postJson('/api/leads', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'profileKey' => 'A',
            ]);

        $this->assertDatabaseHas('quiz_leads', [
            'email' => 'prospect.test@firstcapital.lk',
            'result_code' => 'A',
        ]);
    }

    /**
     * Test honeypot blocks automated bot submissions silently.
     */
    public function test_honeypot_traps_spam_bots(): void
    {
        $response = $this->postJson('/api/leads', [
            'name' => 'Spam Bot',
            'email' => 'spambot@example.com',
            'phone' => '+1234567890',
            'website' => 'http://spam-link.ru', // honeypot triggered
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'leadId' => 0,
            ]);

        $this->assertDatabaseMissing('quiz_leads', [
            'email' => 'spambot@example.com',
        ]);
    }

    /**
     * Test RestrictIpAddress blocks unauthorized IP addresses with 403.
     */
    public function test_admin_portal_blocks_unauthorized_ip(): void
    {
        $response = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.42'])
            ->get('/admin/login');

        $response->assertStatus(403);
    }

    /**
     * Test RestrictIpAddress allows whitelisted IP addresses.
     */
    public function test_admin_portal_allows_whitelisted_ip(): void
    {
        // Create an admin account first so showLogin doesn't redirect to /admin/setup
        AdminAccount::create([
            'name' => 'Existing Admin',
            'email' => 'existing@firstcapital.lk',
            'password_hash' => bcrypt('Password123!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        // 112.134.215.162 is explicitly whitelisted in config/security.php
        $response = $this->withServerVariables(['REMOTE_ADDR' => '112.134.215.162'])
            ->get('/admin/login');

        $response->assertStatus(200);
        $response->assertSee('Investor Week Admin Portal');
    }

    /**
     * Test admin login and dashboard access.
     */
    public function test_admin_can_login_and_view_leads(): void
    {
        $admin = AdminAccount::create([
            'name' => 'Test Super Admin',
            'email' => 'testadmin@firstcapital.lk',
            'password_hash' => bcrypt('Secret12345!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->get('/admin/leads');

        $response->assertStatus(200);
        $response->assertSee('Investor Leads & Quiz Submissions', false);
    }

    /**
     * Test admin can access visual settings editor.
     */
    public function test_admin_can_access_visual_settings_editor(): void
    {
        $admin = AdminAccount::create([
            'name' => 'Settings Admin',
            'email' => 'settings@firstcapital.lk',
            'password_hash' => bcrypt('Secret12345!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->get('/admin/settings');

        $response->assertStatus(200);
        $response->assertSee('Investor Persona Scoring & Questions');
        $response->assertSee('Questions & Scoring');
        $response->assertSee('Quiz Result Profiles');
    }

    /**
     * Test admin can update quiz questions via visual form submission.
     */
    public function test_admin_can_update_quiz_questions_via_visual_form(): void
    {
        $admin = AdminAccount::create([
            'name' => 'Settings Admin 2',
            'email' => 'settings2@firstcapital.lk',
            'password_hash' => bcrypt('Secret12345!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        $payload = [
            'setting_key' => 'quiz_questions',
            'editor_mode' => 'visual',
            'active_tab' => 'quiz_questions',
            'questions' => [
                [
                    'id' => 1,
                    'question' => 'Updated question wording for testing?',
                    'options' => [
                        'A' => ['key' => 'A', 'text' => 'Updated Choice A'],
                        'B' => ['key' => 'B', 'text' => 'Updated Choice B'],
                        'C' => ['key' => 'C', 'text' => 'Updated Choice C'],
                        'D' => ['key' => 'D', 'text' => 'Updated Choice D'],
                    ],
                ],
            ],
        ];

        $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->post('/admin/settings', $payload);

        $response->assertRedirect('/admin/settings?tab=quiz_questions');
        $response->assertSessionHas('success');

        $saved = \App\Models\AppSetting::getValue('quiz_questions');
        $this->assertEquals('Updated question wording for testing?', $saved[0]['question']);
        $this->assertEquals('Updated Choice A', $saved[0]['options'][0]['text']);
    }

    /**
     * Test admin:create artisan command encrypts password in database and does not store plaintext.
     */
    public function test_admin_create_artisan_command_encrypts_password_in_db(): void
    {
        $rawPassword = 'DynamicPassword123!';
        
        $this->artisan('admin:create', [
            '--name' => 'CLI Admin',
            '--email' => 'cli.admin@firstcapital.lk',
            '--password' => $rawPassword,
            '--role' => 'Super Admin',
        ])->assertExitCode(0);

        $admin = AdminAccount::where('email', 'cli.admin@firstcapital.lk')->first();
        $this->assertNotNull($admin);
        $this->assertNotEquals($rawPassword, $admin->password_hash);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check($rawPassword, $admin->password_hash));
    }

    /**
     * Test admin can view and update their profile.
     */
    public function test_admin_can_view_and_update_profile(): void
    {
        $admin = AdminAccount::create([
            'name' => 'Original Name',
            'email' => 'original@firstcapital.lk',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('InitialPassword123!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        // Test view profile
        $viewResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->get('/admin/profile');

        $viewResponse->assertStatus(200);
        $viewResponse->assertSee('Operator Information');
        $viewResponse->assertSee('Original Name');

        // Test update name and email
        $updateResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->put('/admin/profile', [
                'name' => 'Updated Admin Name',
                'email' => 'updated.admin@firstcapital.lk',
            ]);

        $updateResponse->assertSessionHas('success');
        $admin->refresh();
        $this->assertEquals('Updated Admin Name', $admin->name);
        $this->assertEquals('updated.admin@firstcapital.lk', $admin->email);

        // Test password update with correct current password
        $passwordResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->put('/admin/profile', [
                'name' => 'Updated Admin Name',
                'email' => 'updated.admin@firstcapital.lk',
                'current_password' => 'InitialPassword123!',
                'new_password' => 'BrandNewPassword123!',
                'new_password_confirmation' => 'BrandNewPassword123!',
            ]);

        $passwordResponse->assertSessionHas('success');
        $admin->refresh();
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('BrandNewPassword123!', $admin->password_hash));

        // Test password update fails with incorrect current password
        $badPasswordResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->put('/admin/profile', [
                'name' => 'Updated Admin Name',
                'email' => 'updated.admin@firstcapital.lk',
                'current_password' => 'WrongCurrentPassword123!',
                'new_password' => 'AnotherNewPassword123!',
                'new_password_confirmation' => 'AnotherNewPassword123!',
            ]);

        $badPasswordResponse->assertSessionHasErrors(['current_password']);
    }

    /**
     * Test admin can view and manage testimonials with star ratings and visibility.
     */
    public function test_admin_can_manage_testimonials_with_stars_and_visibility(): void
    {
        $admin = AdminAccount::create([
            'username' => 'test_admin_testimony',
            'email' => 'admin.testimony@firstcapital.lk',
            'name' => 'Testimony Admin',
            'password_hash' => bcrypt('SecretPass123!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        // 1. View settings testimonials tab
        $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->get('/admin/settings?tab=testimonials');

        $response->assertStatus(200);
        $response->assertSee('Client Testimonials &amp; Social Proof', false);
        $response->assertSee('Achira Paranavithana');
        $response->assertSee('Live on Site');
        $response->assertSee('Draft');

        // 2. Add a new testimonial with 4 stars and Draft status
        $addResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->post('/admin/settings', [
                'setting_key' => 'testimonials',
                'editor_mode' => 'visual',
                'sub_action' => 'save_single_testimonial',
                'active_tab' => 'testimonials',
                'testimonial_id' => '0',
                'name' => 'Kasun Mendis',
                'role' => 'Tech Entrepreneur',
                'quote' => 'Great platform for starting unit trusts.',
                'rating' => 4,
                'status' => 'Draft',
            ]);

        $addResponse->assertSessionHas('success');

        // Verify it was added to database
        $testimonials = \App\Models\AppSetting::getValue('testimonials', []);
        $found = collect($testimonials)->firstWhere('name', 'Kasun Mendis');
        $this->assertNotNull($found);
        $this->assertEquals(4, $found['rating']);
        $this->assertEquals('Draft', $found['status']);
        $this->assertFalse($found['visible']);

        // 3. Toggle status to Active / Live on Site
        $toggleResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->post('/admin/settings', [
                'setting_key' => 'testimonials',
                'editor_mode' => 'visual',
                'sub_action' => 'toggle_testimonial_status',
                'active_tab' => 'testimonials',
                'testimonial_id' => $found['id'],
            ]);

        $toggleResponse->assertSessionHas('success');
        $testimonialsAfter = \App\Models\AppSetting::getValue('testimonials', []);
        $foundAfter = collect($testimonialsAfter)->firstWhere('id', $found['id']);
        $this->assertEquals('Active', $foundAfter['status']);
        $this->assertTrue($foundAfter['visible']);
    }

    /**
     * Test admin can delete a testimonial.
     */
    public function test_admin_can_delete_testimonial(): void
    {
        $admin = AdminAccount::create([
            'username' => 'test_admin_del',
            'email' => 'admin.del@firstcapital.lk',
            'name' => 'Del Admin',
            'password_hash' => bcrypt('SecretPass123!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        $testimonials = \App\Models\AppSetting::getValue('testimonials', []);
        $this->assertNotEmpty($testimonials);
        $firstId = $testimonials[0]['id'];

        $deleteResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->post('/admin/settings', [
                'setting_key' => 'testimonials',
                'editor_mode' => 'visual',
                'sub_action' => 'delete_testimonial',
                'active_tab' => 'testimonials',
                'delete_testimonial_id' => $firstId,
            ]);

        $deleteResponse->assertSessionHas('success');

        $remaining = \App\Models\AppSetting::getValue('testimonials', []);
        $this->assertNull(collect($remaining)->firstWhere('id', $firstId));
    }

    /**
     * Test public API testimonials endpoint returns only active reviews.
     */
    public function test_public_api_testimonials_only_returns_active_visible_reviews(): void
    {
        $response = $this->getJson('/api/testimonials');
        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertIsArray($data);

        // Dinuka P. is seeded as Draft in our seeder, so it should not be in public output
        $draftItem = collect($data)->firstWhere('status', 'Draft');
        $this->assertNull($draftItem, 'Draft testimonials must never be returned to the public endpoint.');

        // All returned items must have status === 'Active'
        foreach ($data as $item) {
            $this->assertEquals('Active', $item['status']);
        }
    }

    /**
     * Test admin can view and update investment products and verify advanced JSON button is removed.
     */
    public function test_admin_can_view_and_update_investment_products_tab(): void
    {
        $admin = AdminAccount::create([
            'username' => 'test_admin_prod',
            'email' => 'admin.prod@firstcapital.lk',
            'name' => 'Prod Admin',
            'password_hash' => bcrypt('SecretPass123!'),
            'role' => 'Super Admin',
            'status' => 'Active',
        ]);

        // 1. Visit settings with tab=investment_options (as sidebar does)
        $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->get('/admin/settings?tab=investment_options');

        $response->assertStatus(200);
        $response->assertSee('Investment Products &amp; Educational Resources', false);
        $response->assertSee('Unit Trust Funds');
        $response->assertSee('Government Securities');
        $response->assertSee('Equities');
        // Advanced JSON button should NOT be present anywhere in HTML
        $response->assertDontSee('Advanced JSON');
        $response->assertDontSee('tab-content-raw_json');

        // 2. Update investment products via visual editor
        $updateResponse = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
            ->actingAs($admin, 'admin')
            ->post('/admin/settings', [
                'setting_key' => 'investment_options',
                'editor_mode' => 'visual',
                'active_tab' => 'investment_options',
                'products' => [
                    'unit-trust' => [
                        'title' => 'Unit Trust Funds Premium',
                        'shortCopy' => 'Updated unit trust short copy for testing.',
                        'tags' => 'Fund Choice A, Fund Choice B',
                        'video' => [
                            'title' => 'Learn Unit Trust Funds',
                            'url' => 'https://www.youtube.com/watch?v=example123',
                            'platform' => 'YouTube',
                        ],
                        'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/guide.pdf',
                        'guideLabel' => 'guide.pdf',
                        'disclaimer' => 'Terms apply.',
                    ],
                ],
            ]);

        $updateResponse->assertSessionHas('success');

        // Verify update in DB
        $products = \App\Models\AppSetting::getValue('investment_products', []);
        $utProduct = collect($products)->firstWhere('id', 'unit-trust');
        $this->assertEquals('Unit Trust Funds Premium', $utProduct['title']);
        $this->assertEquals('Updated unit trust short copy for testing.', $utProduct['shortCopy']);
        $this->assertContains('Fund Choice A', $utProduct['tags']);
    }

    /**
     * Test custom 404 page renders the Oops page and no Laravel default error pages.
     */
    public function test_custom_404_page_displays_oops_page(): void
    {
        $response = $this->get('/non-existent-route-for-testing-404');
        $response->assertStatus(404);
        $response->assertSee('Oops! That page can’t be found.', false);
        $response->assertSee('It looks like nothing was found at this location.', false);
        $response->assertSee('404-illustration.png');
        $response->assertDontSee('Server Error');
        $response->assertDontSee('Laravel');
    }

    /**
     * Test forbidden 403 routes render the Oops page and no Laravel default error pages.
     */
    public function test_forbidden_pages_display_oops_page(): void
    {
        $response = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.99'])
            ->get('/admin/login');
        $response->assertStatus(403);
        $response->assertSee('Oops! That page can’t be found.', false);
        $response->assertSee('It looks like nothing was found at this location.', false);
        $response->assertSee('404-illustration.png');
        $response->assertDontSee('Laravel');
    }
}


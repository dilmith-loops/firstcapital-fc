<?php

namespace Database\Seeders;

use App\Models\AdminAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // STRICT ARCHITECTURAL DIRECTIVE:
        // No admin credentials are hardcoded into source code or seeders.
        // Administrators must be created through:
        // 1. One-time browser setup at /admin/setup
        // 2. Interactive CLI command: `php artisan admin:create`
        // 3. Super Admin user management inside /admin/users
        if (isset($this->command)) {
            $this->command->info('No hardcoded admin credentials seeded. Provision your admin account via /admin/setup or `php artisan admin:create`.');
        }
    }
}

<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {--name=} {--email=} {--password=} {--role=Super Admin}', function () {
    $this->info('First Capital Holdings PLC - Create Administrator');

    $name = $this->option('name') ?: $this->ask('Enter Administrator Full Name');
    while (empty($name)) {
        $this->error('Name cannot be empty.');
        $name = $this->ask('Enter Administrator Full Name');
    }

    $email = strtolower(trim($this->option('email') ?: $this->ask('Enter Administrator Corporate Email')));
    while (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $this->error('Please enter a valid email address.');
        $email = strtolower(trim($this->ask('Enter Administrator Corporate Email')));
    }

    if (\App\Models\AdminAccount::where('email', $email)->exists()) {
        $this->error("An administrator with email [{$email}] already exists.");
        return 1;
    }

    $password = $this->option('password') ?: $this->secret('Enter Strong Password (min 10 characters)');
    while (strlen($password) < 10) {
        $this->error('Password must be at least 10 characters.');
        $password = $this->secret('Enter Strong Password (min 10 characters)');
    }

    if (!$this->option('password')) {
        $confirmPassword = $this->secret('Confirm Password');
        if ($password !== $confirmPassword) {
            $this->error('Passwords do not match.');
            return 1;
        }
    }

    $role = $this->option('role') ?: $this->choice('Select Role', ['Super Admin', 'Manager', 'Advisor', 'Auditor'], 0);

    $admin = \App\Models\AdminAccount::create([
        'name' => $name,
        'email' => $email,
        'password_hash' => \Illuminate\Support\Facades\Hash::make($password),
        'role' => $role,
        'status' => 'Active',
        'last_login' => null,
    ]);

    $this->info("Administrator [{$admin->name}] ({$admin->email}) created successfully with role [{$admin->role}].");
    $this->comment('Password was securely hashed with Bcrypt and stored in the database.');
    return 0;
})->purpose('Interactively create a new Administrator account with encrypted password');

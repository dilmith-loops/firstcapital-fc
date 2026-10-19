<!DOCTYPE html>
<html lang="en" class="h-full bg-[#061325]">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Administrator Initialization Setup | First Capital Investor Week</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        fc: {
                            navy: '#061325',
                            dark: '#0A1E38',
                            border: '#1E3E66',
                            gold: '#E5A823',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        display: ['"Space Grotesk"', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="h-full flex items-center justify-center p-4 font-sans text-slate-100 bg-[#061325] antialiased">
    <div class="max-w-lg w-full">
        <div class="text-center mb-6">
            <img src="{{ asset('first-capital-logo-white.png') }}" alt="First Capital" class="h-12 w-auto mx-auto object-contain drop-shadow">
            <h1 class="text-xl font-bold font-display text-white mt-4">One-Time Administrator Setup</h1>
            <p class="text-xs text-slate-400 mt-1">Initialize the primary Super Admin account for Investor Week</p>
        </div>

        <div class="bg-[#0A1E38] border border-[#1E3E66] rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-600"></div>

            <div class="p-3.5 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                <strong>🔒 Setup Security Gate:</strong> This initialization form requires the secret <code class="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-200">ADMIN_SETUP_TOKEN</code> configured on the server. As soon as the first admin is created, this route is permanently disabled.
            </div>

            @if($errors->any())
            <div class="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $err)
                        <li>{{ $err }}</li>
                    @endforeach
                </ul>
            </div>
            @endif

            <form method="POST" action="{{ route('admin.setup.submit') }}" class="space-y-4">
                @csrf

                <!-- Setup Token -->
                <div>
                    <label for="token" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Admin Setup Token</label>
                    <input type="password" id="token" name="token" required
                           placeholder="Enter token from db_config.php / .env"
                           class="w-full px-4 py-2.5 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm focus:outline-none focus:border-amber-400 font-mono">
                </div>

                <!-- Full Name -->
                <div>
                    <label for="name" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Super Admin Name</label>
                    <input type="text" id="name" name="name" value="{{ old('name') }}" required
                           placeholder="e.g. Dilmith (Lead Admin)"
                           class="w-full px-4 py-2.5 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm focus:outline-none focus:border-amber-400">
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Corporate Email</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required
                           placeholder="admin@firstcapital.lk"
                           class="w-full px-4 py-2.5 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm focus:outline-none focus:border-amber-400">
                </div>

                <!-- Password -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                        <input type="password" id="password" name="password" required
                               placeholder="Min. 10 chars"
                               class="w-full px-4 py-2.5 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm focus:outline-none focus:border-amber-400">
                    </div>
                    <div>
                        <label for="password_confirmation" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" required
                               placeholder="Repeat password"
                               class="w-full px-4 py-2.5 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm focus:outline-none focus:border-amber-400">
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        class="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2">
                    <span>Create Super Administrator</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </form>
        </div>
    </div>
</body>
</html>

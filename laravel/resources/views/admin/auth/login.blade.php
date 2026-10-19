<!DOCTYPE html>
<html lang="en" class="h-full bg-[#061325]">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Administrator Sign In | First Capital Investor Week</title>
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
                            surface: '#0F294A',
                            border: '#1E3E66',
                            gold: '#E5A823',
                            goldLight: '#F3C358',
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
    <div class="max-w-md w-full">
        <!-- Logo & Branding Header -->
        <div class="text-center mb-8">
            <a href="{{ route('campaign.home') }}" class="inline-block transition-transform hover:scale-105">
                <img src="{{ asset('first-capital-logo-white.png') }}" alt="First Capital" class="h-12 w-auto mx-auto object-contain drop-shadow">
            </a>
            <h1 class="text-xl font-bold font-display text-white mt-4 tracking-tight">Investor Week Admin Portal</h1>
            <p class="text-xs text-slate-400 mt-1">Enterprise Lead Management & Quiz Configuration</p>
        </div>

        <!-- Login Card -->
        <div class="bg-[#0A1E38] border border-[#1E3E66] rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <!-- Decorative Accent -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

            @if(session('success'))
            <div class="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>{{ session('success') }}</span>
            </div>
            @endif

            @if(session('error'))
            <div class="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                <span>{{ session('error') }}</span>
            </div>
            @endif

            @if($errors->any())
            <div class="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $err)
                        <li>{{ $err }}</li>
                    @endforeach
                </ul>
            </div>
            @endif

            <form method="POST" action="{{ route('admin.login.submit') }}" class="space-y-5">
                @csrf

                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Corporate Email</label>
                    <div class="relative">
                        <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                               placeholder="advisor@firstcapital.lk"
                               class="w-full px-4 py-3 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition">
                    </div>
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required
                               placeholder="••••••••••••"
                               class="w-full px-4 py-3 rounded-xl bg-[#061325] border border-[#1E3E66] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition pr-10">
                        <button type="button" onclick="togglePasswordVisibility()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">
                            <svg id="eye-icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Remember Me -->
                <div class="flex items-center text-xs">
                    <label class="flex items-center space-x-2 text-slate-300 cursor-pointer">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-0 bg-[#061325]">
                        <span>Keep me signed in</span>
                    </label>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        class="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2">
                    <span>Sign In to Console</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </form>
        </div>
    </div>

    <script>
        function togglePasswordVisibility() {
            const pwd = document.getElementById('password');
            pwd.type = pwd.type === 'password' ? 'text' : 'password';
        }
    </script>
</body>
</html>

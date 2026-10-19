<!DOCTYPE html>
<html lang="en" class="h-full bg-white">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Oops! That page can’t be found.</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
        }
    </style>
</head>
<body class="h-full min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white antialiased selection:bg-amber-100">
    <main class="w-full max-w-3xl flex flex-col items-center justify-center my-auto py-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight mb-8 sm:mb-12">
            Oops! That page can’t be found.
        </h1>

        <div class="w-full flex justify-center items-center my-2 sm:my-4">
            <a href="{{ url('/') }}" title="Return to Homepage" class="inline-block transition hover:opacity-95 focus:outline-none">
                <img src="{{ asset('images/404-illustration.png') }}" 
                     alt="404 Page Not Found" 
                     class="w-full max-w-[620px] h-auto object-contain select-none mx-auto drop-shadow-xs"
                     loading="eager" />
            </a>
        </div>

        <p class="text-sm sm:text-base text-slate-800 font-normal mt-8 sm:mt-12">
            It looks like nothing was found at this location.
        </p>
    </main>
</body>
</html>

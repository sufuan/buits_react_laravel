<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Barishal University IT Society (BUITS) is the official IT society of the University of Barishal — workshops, seminars, training courses, tech events and a community of student innovators.">
        <meta name="keywords" content="BUITS, Barishal University IT Society, University of Barishal, IT Society, buits.org">
        <meta name="author" content="Barishal University IT Society">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Barishal University IT Society">
        <meta property="og:title" content="Barishal University IT Society (BUITS)">
        <meta property="og:description" content="Barishal University IT Society (BUITS) is the official IT society of the University of Barishal — workshops, seminars, training courses, tech events and a community of student innovators.">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:image" content="{{ asset('img/logo.png') }}">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="Barishal University IT Society (BUITS)">
        <meta name="twitter:description" content="Barishal University IT Society (BUITS) is the official IT society of the University of Barishal — workshops, seminars, training courses, tech events and a community of student innovators.">
        <meta name="twitter:image" content="{{ asset('img/logo.png') }}">

        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Barishal University IT Society",
            "alternateName": "BUITS",
            "url": "https://buits.org",
            "logo": "https://buits.org/img/logo.png"
        }
        </script>
        

        <title inertia>{{ config('app.name', 'Barishal University IT Society') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

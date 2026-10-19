@extends('layouts.admin')

@section('title', 'Security Telemetry & System Health')

@section('content')
<div class="space-y-5">
    <div>
        <h1 class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Security Telemetry & Health</h1>
        <p class="text-xs text-slate-500 mt-0.5">Perimeter IP verification, reverse proxy telemetry, and runtime environment status</p>
    </div>

    <!-- Telemetry Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Reverse Proxy & IP Inspection -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-bold text-slate-900 font-display flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Reverse Proxy & Client IP Telemetry</span>
            </h3>

            <div class="space-y-2.5 text-xs">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Resolved Client IP (Effective Gatekeeper IP)</span>
                    <span class="font-mono text-base font-bold text-amber-600 block mt-0.5">{{ $detectedIp }}</span>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Incap-Client-IP Header</span>
                    <span class="font-mono text-xs text-slate-700 block mt-0.5">{{ $incapHeader }}</span>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">CF-Connecting-IP (Cloudflare Edge)</span>
                    <span class="font-mono text-xs text-slate-700 block mt-0.5">{{ $cfHeader }}</span>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">X-Forwarded-For Chain</span>
                    <span class="font-mono text-xs text-slate-700 block mt-0.5 break-all">{{ $forwardedHeader }}</span>
                </div>
            </div>
        </div>

        <!-- Runtime Environment & Database -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-bold text-slate-900 font-display flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Runtime Environment & Database Health</span>
            </h3>

            <div class="space-y-2.5 text-xs">
                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span class="text-slate-500">Laravel Framework</span>
                    <span class="font-mono font-bold text-slate-800">v{{ $laravelVersion }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span class="text-slate-500">PHP Engine Version</span>
                    <span class="font-mono font-bold text-slate-800">PHP {{ $phpVersion }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span class="text-slate-500">Database Connection</span>
                    <span class="font-mono font-bold text-emerald-600 flex items-center space-x-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>[{{ strtoupper($dbDriver) }}] {{ $dbStatus }}</span>
                    </span>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span class="text-slate-500">Server Platform</span>
                    <span class="font-mono text-xs text-slate-800 truncate max-w-[200px]" title="{{ $serverSoftware }}">{{ $serverSoftware }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Active IP Whitelist Configuration -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 class="text-sm font-bold text-slate-900 font-display mb-3">Active Admin IP Whitelist Policy</h3>

        <div class="flex flex-wrap gap-2">
            @foreach($allowedIps as $ip)
            <span class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-amber-700 font-bold flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{{ $ip }}</span>
            </span>
            @endforeach
        </div>
    </div>
</div>
@endsection

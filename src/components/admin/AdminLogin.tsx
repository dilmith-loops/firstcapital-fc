import React, { useState } from "react";
import { Lock, Mail, Shield, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Sparkles, Eye, EyeOff } from "lucide-react";
import logoImg from "@/assets/first-capital-logo.png";
import { AdminStore } from "@/lib/admin-store";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const ok = AdminStore.login(email, password);
      if (ok) {
        onSuccess();
      } else {
        setError("Invalid email or password. Please verify your credentials or contact an administrator.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0d1f1b] text-white flex flex-col justify-between selection:bg-[#f1c91e] selection:text-[#142d27]">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="../" className="block" title="Back to Home">
              <img
                src={logoImg}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.tried1) {
                    target.dataset.tried1 = "true";
                    target.src = "./first-capital-logo.png";
                  } else if (!target.dataset.tried2) {
                    target.dataset.tried2 = "true";
                    target.src = "../first-capital-logo.png";
                  } else if (!target.dataset.tried3) {
                    target.dataset.tried3 = "true";
                    target.src = "assets/first-capital-logo.png";
                  }
                }}
                alt="First Capital — A Janashakthi Group Company"
                className="h-8 sm:h-9 w-auto"
                width="1698"
                height="432"
              />
            </a>
          </div>

          <a
            href="../"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft className="size-3.5" />
            Back to Public Site
          </a>
        </div>
      </header>

      {/* Center Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-[#142d27] border border-emerald-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Background ambient glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#f1c91e]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Portal Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[#f1c91e] text-xs font-bold uppercase tracking-wider">
                <Shield className="size-3.5" />
                <span>Executive Management</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/70 mt-1.5">
                First Capital Investor Week • Management Console
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 text-red-400 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                    <Mail className="size-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@firstcapital.lk"
                    className="w-full bg-[#0b1a17] border border-emerald-800/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#f1c91e] focus:ring-1 focus:ring-[#f1c91e] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                    <Lock className="size-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0b1a17] border border-emerald-800/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#f1c91e] focus:ring-1 focus:ring-[#f1c91e] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/80 hover:text-[#f1c91e] transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f1c91e] hover:bg-[#e2bb18] active:scale-[0.99] text-[#142d27] font-black py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Sign In to Console <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/40 bg-[#081512] px-6 py-4 text-center">
        <p className="text-xs text-emerald-400/60">
          © {new Date().getFullYear()} First Capital Holdings PLC • Secure Internal Operations
        </p>
      </footer>
    </div>
  );
}

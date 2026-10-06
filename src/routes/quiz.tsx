import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import logoAsset from "@/assets/first-capital-logo.png.asset.json";
import { QuizFlow } from "@/components/quiz/QuizFlow";

const disclaimer =
  "This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Investor Quiz | First Capital" },
      {
        name: "description",
        content: "Discover your investor personality and find your ideal investment match.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          <Link to="/" aria-label="First Capital Home" className="block">
            <img
              src={logoAsset.url}
              alt="First Capital"
              className="h-auto w-36 sm:w-44"
              width="1698"
              height="432"
            />
          </Link>

          <div className="w-24 sm:w-28" />
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <QuizFlow />
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] leading-relaxed text-slate-500 max-w-2xl mx-auto">
            {disclaimer}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} First Capital Holdings PLC. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

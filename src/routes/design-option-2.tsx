import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CircleDollarSign,
  ExternalLink,
  Landmark,
  LineChart,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { useState } from "react";
import FCmainImage from "@/assets/FCmain.png";
import investorType01 from "@/assets/investor-type-01.png";
import investorType02 from "@/assets/investor-type-02.png";
import investorType03 from "@/assets/investor-type-03.png";
import investorType04 from "@/assets/investor-type-04.png";
import thingsYouKnowImage from "@/assets/image.png";
import logoAsset from "@/assets/first-capital-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { QuizModal } from "@/components/quiz/QuizModal";

const disclaimer =
  "This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.";

export const Route = createFileRoute("/design-option-2")({
  head: () => ({
    meta: [
      { title: "Investor Week: Comic Design | First Capital" },
      { name: "description", content: "Explore First Capital Investor Week through a bold, comic-inspired second design direction." },
      { property: "og:title", content: "Investor Week: Comic Design | First Capital" },
      { property: "og:description", content: "A bold second design option for discovering your investor personality and investment match." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ai.loopsintegrated.co/fc/assets/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://ai.loopsintegrated.co/fc/assets/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Investor Week: Comic Design | First Capital" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Investor Week: Comic Design | First Capital" },
      { name: "twitter:description", content: "Explore First Capital Investor Week through a bold, comic-inspired second design direction." },
      { name: "twitter:image", content: "https://ai.loopsintegrated.co/fc/assets/og-image.jpg" },
    ],
  }),
  component: DesignOptionTwo,
});

type InvestmentOptionItem = {
  id: string;
  number: string;
  title: string;
  shortCopy: string;
  tags?: string[];
  fullCopy?: string;
  simplyPut?: string;
  keyBenefits?: string[];
  icon: typeof CircleDollarSign;
  products?: {
    icon: typeof CircleDollarSign;
    title: string;
    tags: string[];
    copy: string;
  }[];
  video: {
    title: string;
    url: string;
    platform: string;
  };
  disclaimer: string;
  guideUrl?: string;
  guideLabel?: string;
};

const investmentOptions: InvestmentOptionItem[] = [
  {
    id: "unit-trust",
    number: "01",
    title: "Unit Trust Funds",
    icon: CircleDollarSign,
    shortCopy: "A Unit Trust Fund pools money from multiple investors into a single fund. This money is professionally managed and invested in a range of investments based on the fund’s investment objective. When you invest, you receive units in the fund based on the amount you invest. You can choose from three Unit Trust Funds.",
    tags: ["3 Fund Choices", "From LKR 1,000", "High Liquidity"],
    fullCopy: "",
    products: [
      {
        icon: CircleDollarSign,
        title: "First Capital Money Market Fund",
        tags: ["Short-term", "Relatively lower risk", "Withdraw anytime", "Start with LKR 1,000"],
        copy: "For investors who want to keep their money accessible while putting it to work.",
      },
      {
        icon: ShieldCheck,
        title: "First Capital Fixed Income Fund",
        tags: ["Medium to long term", "Relatively stable returns", "Access anytime", "Start with LKR 1,000"],
        copy: "For investors looking for relatively stable returns while keeping access to their money.",
      },
      {
        icon: LineChart,
        title: "First Capital Equity Fund",
        tags: ["Long-term", "Growth", "Market exposure", "Start with LKR 1,000"],
        copy: "For investors looking to grow their wealth over the long term through the stock market and who are comfortable with market fluctuations. Key benefits: Start from LKR 1,000 | Withdraw anytime (Withdrawals made within one year are subject to an exit fee).",
      },
    ],
    video: {
      title: "Learn more about Unit Trust Funds",
      url: "https://www.tiktok.com/@first.capital/video/7593165117668265223",
      platform: "TikTok",
    },
    disclaimer: "*Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust Funds to understand our internal procedures related to products and transactions: ",
    guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
    guideLabel: "firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
  },
  {
    id: "gov-securities",
    number: "02",
    title: "Government Securities",
    icon: Landmark,
    shortCopy: "Government securities are instrument issued by the Government of Sri Lanka to raise money. When you invest, you lend your money to the government for a defined period. In return, you receive interest periodically, with the original investment paid back at maturity.",
    simplyPut: "You invest money → The government uses your money → You receive regular interest → Your investment is repaid at maturity.",
    keyBenefits: ["Government-issued", "Regular interest", "Defined maturity", "Risk-free instrument"],
    video: {
      title: "Government Securities explained",
      url: "https://www.youtube.com/watch?v=LZoAwRqGr9M&t=20s",
      platform: "YouTube",
    },
    disclaimer: "*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ",
    guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
    guideLabel: "firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
  },
  {
    id: "equities",
    number: "03",
    title: "Equities",
    icon: TrendingUp,
    shortCopy: "It simply means investing in shares of listed companies. When you buy shares, you own a % of the company. The value of your investment can rise or fall based on the company’s performance and market conditions.",
    keyBenefits: ["Long-term growth potential", "Own listed shares", "Market participation"],
    simplyPut: "You buy shares → You own a part of a company → The share value can rise or fall → You can benefit if the value increases.",
    video: {
      title: "How do equities work?",
      url: "https://www.youtube.com/shorts/HGL82Tv1wJE",
      platform: "YouTube",
    },
    disclaimer: "*Disclaimer: Equity investments are subject to market risk | Please refer to the Procedure Guide related to Equities to understand our internal procedures related to products and transactions: ",
    guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
    guideLabel: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
  },
];

const reasons = [
  { icon: Users, title: "Professional Management", copy: "With the premier Unit Trust company in Sri Lanka, there’s no need to pick assets; specialists track the market for you." },
  { icon: BarChart3, title: "Diversification", copy: "Your risk spreads across multiple investments, not one big bet." },
  { icon: Sparkles, title: "Start Small", copy: "Begin with only LKR 1,000." },
  { icon: RefreshCw, title: "Easy Entry and Exit", copy: "Buy or sell units with flexibility, because you deserve the power to control your assets." },
  { icon: Landmark, title: "40+ Years of Investment Expertise", copy: "Over four decades of experience in Sri Lanka’s capital markets." },
  { icon: CircleDollarSign, title: "Investment Options for Different Goals", copy: "Investments in different asset classes to suit different goals and time horizons." },
  { icon: Building2, title: "Backed by Janashakthi Group", copy: "Part of one of Sri Lanka’s established financial conglomerates." },
  { icon: BookOpen, title: "Gain Research Insights and Education", copy: "Access market insights, research and educational content to invest with confidence." },
];

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-4 text-xs font-extrabold uppercase ${className || "text-muted-foreground"}`}>{children}</p>;
}

function DesignOptionTwo() {
  const [isQuizOpen, setIsQuizOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.search.includes("quiz=open") || window.location.hash === "#quiz";
    }
    return false;
  });

  const [activeOption, setActiveOption] = useState<InvestmentOptionItem | null>(null);

  return (
    <div className="comic-page min-h-screen overflow-hidden bg-background text-foreground">
      <header className="comic-header border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl w-full items-center justify-between gap-5 px-5 py-2 sm:py-2.5 sm:px-8 lg:px-12">
          <a href="#top" aria-label="First Capital home" className="block min-w-0">
            <img src={logoAsset.url} alt="First Capital — A Janashakthi Group Company" className="h-auto w-36 sm:w-44" width="1698" height="432" />
          </a>
          <div className="comic-badge flex shrink-0 items-center border-l-2 border-primary pl-3.5">
            <span className="text-right text-[11px] font-extrabold uppercase leading-tight text-foreground sm:text-xs">Investor<br />Week</span>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative py-6 sm:py-10 lg:py-14">
          <div className="comic-hero mx-auto grid max-w-7xl w-full items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1.18fr] lg:gap-10 lg:px-12">
            <div className="relative z-10 max-w-xl xl:max-w-2xl flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-extrabold leading-[1.14] text-[#1a214c]">
                You Already Save, Plan and Prepare for the Future.<br />
                <span className="comic-title-highlight relative inline-block mt-2 border-b-[6px] sm:border-b-[8px] border-primary pb-2 sm:pb-3 text-[#1a214c]">
                  It’s the same with investing.
                </span>
              </h1>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base italic font-medium text-slate-600">
                Answer 7 simple questions and discover your investor personality.
              </p>
              <div className="mt-5 sm:mt-6">
                <Button
                  id="btn-find-investor-type"
                  onClick={() => setIsQuizOpen(true)}
                  className="comic-btn min-h-13 px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold tracking-wide gap-3 cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-[0.99] transition-all uppercase"
                >
                  <span>FIND MY INVESTOR PERSONALITY</span>
                  <ArrowRight className="size-5 stroke-[2.5]" />
                </Button>
              </div>
              <p className="mt-5 max-w-xl text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-bold text-foreground">Disclaimer: </span>{disclaimer}
              </p>
            </div>

            <div className="relative flex items-center justify-center w-full">
              <div className="comic-shadow absolute bottom-4 left-1/2 -translate-x-1/2 h-[68%] w-[94%] border-b-[18px] border-primary" />
              <img
                src={FCmainImage}
                alt="First Capital Investor Personas"
                className="relative z-10 h-auto w-full max-w-2xl lg:max-w-none lg:scale-105 object-contain mx-auto transition-transform"
                width={1408}
                height={1056}
              />
              <div style={{ display: "none" }} className="hidden relative z-20 mt-4 sm:mt-5 grid grid-cols-2 border border-border bg-background sm:grid-cols-4">
                {[
                  { name: "Keep-It-Cool", number: "01", image: investorType01 },
                  { name: "Smooth Operator", number: "02", image: investorType02 },
                  { name: "Patient Player", number: "03", image: investorType03 },
                  { name: "Opportunity Hunter", number: "04", image: investorType04 },
                ].map((type, index) => (
                  <div
                    key={type.name}
                    className={`comic-panel flex flex-col p-3 sm:p-4 ${
                      index > 0 ? "sm:border-l sm:border-border" : ""
                    }`}
                  >
                    <div className="mb-2.5 size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary/30 shadow-xs">
                      <img
                        src={type.image}
                        alt={type.name}
                        className="size-full object-cover"
                        width={56}
                        height={56}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{type.number}</span>
                    <p className="mt-1 text-xs font-extrabold leading-tight sm:text-sm">{type.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="options" className="comic-options px-5 py-14 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.65fr_1fr] lg:items-end">
              <div>
                <SectionLabel>Investment Options</SectionLabel>
                <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">Explore Your<br />Investment Options</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
                Discover different ways to invest and find options that align with your goals.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {investmentOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    data-option-id={opt.id}
                    onClick={() => setActiveOption(opt)}
                    className="comic-box group relative flex flex-col justify-between border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Top Section: Blue background (#1a214c) with Yellow text & icon (#f1ca1f) */}
                    <div className="p-6 sm:p-7 min-h-[92px] sm:min-h-[104px] flex items-center transition-colors border-b-2 border-foreground" style={{ backgroundColor: '#1a214c', color: '#f1ca1f' }}>
                      <div className="flex items-center gap-3.5 w-full">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-white/10 border-2 border-foreground shadow-xs" style={{ color: '#f1ca1f' }}>
                          <Icon className="size-6" style={{ color: '#f1ca1f' }} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug" style={{ color: '#f1ca1f' }}>
                          {opt.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Section: White background with aligned description & CTA */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-white" style={{ backgroundColor: '#ffffff' }}>
                      <div className="flex flex-col flex-1">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {opt.shortCopy}
                        </p>
                      </div>

                      <div className="mt-7 pt-4 border-t-2 border-foreground/15 flex items-center justify-between text-sm font-extrabold group-hover:underline underline-offset-4 transition-colors" style={{ color: '#1a214c' }}>
                        <span>View Details & Info</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" style={{ color: '#1a214c' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Investment Option Detail Modal */}
        <Dialog open={!!activeOption} onOpenChange={(open) => !open && setActiveOption(null)}>
          <DialogContent
            className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-8 rounded-none border-2 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activeOption && (
              <div className="space-y-6">
                <DialogHeader className="text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Investment Option Details
                    </span>
                  </div>
                  <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">
                    {activeOption.title}
                  </DialogTitle>
                  <DialogDescription className={activeOption.fullCopy ? "text-sm sm:text-base text-muted-foreground leading-relaxed pt-1" : "sr-only"}>
                    {activeOption.fullCopy || activeOption.title}
                  </DialogDescription>
                </DialogHeader>

                {/* Option 01: Unit Trust sub-products */}
                {activeOption.products && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Available Fund Types:</h4>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {activeOption.products.map((p) => {
                        const PIcon = p.icon;
                        return (
                          <div key={p.title} className="border border-border bg-card p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2.5 mb-2">
                                <PIcon className="size-5 text-primary shrink-0" />
                                <h5 className="text-sm sm:text-base font-extrabold leading-snug">{p.title}</h5>
                              </div>
                              <p className="text-xs leading-5 text-muted-foreground">{p.copy}</p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1">
                              {p.tags.map((t) => (
                                <span key={t} className="border border-border bg-secondary px-1.5 py-0.5 text-[9px] font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Simply put flow */}
                {activeOption.simplyPut && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Simply put:
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      {activeOption.simplyPut.split("→").map((step, idx, arr) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-2.5">
                          <div className="flex items-center gap-2 border-2 border-foreground bg-card px-3.5 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary border border-foreground text-[10px] font-black text-primary-foreground">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              {step.trim()}
                            </span>
                          </div>
                          {idx < arr.length - 1 && (
                            <ArrowRight className="size-4 shrink-0 text-foreground stroke-[2.5]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key benefits */}
                {activeOption.keyBenefits && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Key Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeOption.keyBenefits.map((b) => (
                        <span key={b} className="border-2 border-foreground bg-card px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Link */}
                {activeOption.video && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border border-primary/30 bg-primary/5 p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Play className="size-4 fill-current ml-0.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{activeOption.video.title}</p>
                      </div>
                    </div>
                    <a
                      href={activeOption.video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="comic-btn inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 hover:bg-primary/90 transition-colors"
                    >
                      Watch Video <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}

                {/* CTAs inside dialog */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild size="default" className="comic-btn flex-1 px-4 text-xs sm:text-sm whitespace-nowrap bg-[#f1ca1f] text-[#142d27] hover:bg-[#e0b815] font-bold" style={{ backgroundColor: "#f1ca1f", color: "#142d27" }}>
                    <a href="https://eonboarding.firstcapital.lk/#/pre-login/account-open/verify/nic-verify" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap" style={{ backgroundColor: "#f1ca1f", color: "#142d27" }}>
                      <span style={{ color: "#142d27" }}>I would like to create my account</span> <ArrowRight className="size-4 shrink-0" style={{ color: "#142d27" }} />
                    </a>
                  </Button>
                  <Button asChild size="default" className="comic-btn flex-1 px-4 text-xs sm:text-sm whitespace-nowrap bg-[#1a214c] text-white hover:bg-[#252f6b] border-2 border-foreground font-bold" style={{ backgroundColor: "#1a214c", color: "#ffffff" }}>
                    <a href="https://firstcapital.lk/contact-us/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap" style={{ backgroundColor: "#1a214c", color: "#ffffff" }}>
                      <span style={{ color: "#ffffff" }}>I would like to speak to someone first</span>
                    </a>
                  </Button>
                </div>

                {/* Disclaimer with Procedure Guide Link */}
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground border-t border-border pt-3">
                  <span>{activeOption.disclaimer}</span>
                  {activeOption.guideUrl && (
                    <a
                      href={activeOption.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all"
                    >
                      <span>{activeOption.guideLabel || activeOption.guideUrl}</span>
                      <ExternalLink className="size-2.5 inline shrink-0" />
                    </a>
                  )}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <section className="comic-reasons bg-secondary px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">Why First Capital?</h2>
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <article key={reason.title} className="bg-background p-4 sm:p-6 min-h-[140px] sm:min-h-64 flex flex-col justify-start">
                    <Icon className="size-6 sm:size-7 text-accent" />
                    <h3 className="mt-3 sm:mt-8 text-sm sm:text-lg font-extrabold leading-snug">{reason.title}</h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed sm:leading-6 text-muted-foreground">{reason.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <TestimonialSlider />

        <section className="comic-final relative overflow-hidden bg-foreground px-5 py-20 text-background sm:px-8 lg:px-12">
          <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border-[48px] border-primary/20" />
          <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <SectionLabel className="text-slate-300">Become an investor today!</SectionLabel>
              <h2 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
                Ready to take the next step and become an investor?
              </h2>
            </div>
            <div className="flex flex-col items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button asChild size="lg" className="comic-btn w-full sm:w-auto min-w-0 sm:min-w-[360px] px-5 sm:px-7 text-xs sm:text-sm md:text-base whitespace-nowrap bg-[#f1ca1f] text-[#142d27] hover:bg-[#e0b815] font-bold" style={{ backgroundColor: "#f1ca1f", color: "#142d27" }}>
                <a href="https://eonboarding.firstcapital.lk/#/pre-login/account-open/verify/nic-verify" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap" style={{ backgroundColor: "#f1ca1f", color: "#142d27" }}>
                  <span style={{ color: "#142d27" }}>I would like to create my account</span>
                  <ArrowRight className="size-4.5 shrink-0" style={{ color: "#142d27" }} />
                </a>
              </Button>
              <Button asChild size="lg" className="comic-btn w-full sm:w-auto min-w-0 sm:min-w-[360px] px-5 sm:px-7 text-xs sm:text-sm md:text-base whitespace-nowrap bg-[#1a214c] text-white hover:bg-[#252f6b] border-2 border-white/40 font-bold" style={{ backgroundColor: "#1a214c", color: "#ffffff" }}>
                <a href="https://firstcapital.lk/contact-us/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap" style={{ backgroundColor: "#1a214c", color: "#ffffff" }}>
                  <span style={{ color: "#ffffff" }}>I would like to speak to someone first</span>
                  <ArrowRight className="size-4.5 shrink-0" style={{ color: "#ffffff" }} />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="comic-footer bg-background px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.4fr_1fr]">
          <div><img src={logoAsset.url} alt="First Capital" className="h-auto w-44" width="1698" height="432" /><p className="mt-5 text-sm font-bold">0112 651 651</p><a href="mailto:info@firstcapital.lk" className="mt-1 block text-sm font-bold underline decoration-primary decoration-2 underline-offset-4">info@firstcapital.lk</a></div>
          <div className="md:border-l md:border-border md:pl-8"><p className="text-xs font-extrabold uppercase">Disclaimer</p><p className="mt-3 max-w-3xl text-[11px] leading-5 text-muted-foreground">{disclaimer}</p><div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground"><p>© First Capital. A Janashakthi Group Company.</p></div></div>
        </div>
      </footer>

      <QuizModal open={isQuizOpen} onOpenChange={setIsQuizOpen} />
    </div>
  );
}

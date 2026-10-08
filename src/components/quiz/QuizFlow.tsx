import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Copy,
  Download,
  ExternalLink,
  Landmark,
  LineChart,
  Loader2,
  Mail,
  Phone,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { submitLeadDetails, submitQuizResult } from "@/lib/leads-api";
import { AdminStore } from "@/lib/admin-store";
import keepItCoolMale from "@/assets/keep-it-cool-male.png";
import keepItCoolFemale from "@/assets/keep-it-cool-female.png";
import smoothOperatorMale from "@/assets/smooth-operator-male.png";
import smoothOperatorFemale from "@/assets/smooth-operator-female.png";
import patientPlayerMale from "@/assets/patient-player-male.png";
import patientPlayerFemale from "@/assets/patient-player-female.png";
import opportunityHunterMale from "@/assets/opportunity-hunter-male.png";
import opportunityHunterFemale from "@/assets/opportunity-hunter-female.png";
import maleCharacter from "@/assets/keep-it-cool-male.png";
import femaleCharacter from "@/assets/keep-it-cool-female.png";
import shareKeepItCoolMale from "@/assets/share-keep-it-cool-male.jpg";
import shareKeepItCoolFemale from "@/assets/share-keep-it-cool-female.jpg";
import shareSmoothOperatorMale from "@/assets/share-smooth-operator-male.jpg";
import shareSmoothOperatorFemale from "@/assets/share-smooth-operator-female.jpg";
import sharePatientPlayerMale from "@/assets/share-patient-player-male.jpg";
import sharePatientPlayerFemale from "@/assets/share-patient-player-female.jpg";
import shareOpportunityHunterMale from "@/assets/share-opportunity-hunter-male.jpg";
import shareOpportunityHunterFemale from "@/assets/share-opportunity-hunter-female.jpg";
import shareKeepItCool from "@/assets/share-keep-it-cool.jpg";

export type ProfileKey = "A" | "B" | "C" | "D";

export interface ProfileInfo {
  key: ProfileKey;
  number: string;
  name: string;
  style: string;
  product: string;
  productShort: string;
  productOptionId: "unit-trust" | "gov-securities" | "equities";
  description: string;
  vibe: string;
  productDisclaimer: string;
  procedureGuide?: {
    label: string;
    url: string;
  };
  colorClass: string;
  badgeBg: string;
  image: string;
  maleImage: string;
  femaleImage: string;
}

export const PROFILES: Record<ProfileKey, ProfileInfo> = {
  A: {
    key: "A",
    number: "01",
    name: "The Keep-It-Cool Investor",
    style: "Flexible & Agile",
    product: "First Capital Money Market Fund (FCMMF)*",
    productShort: "First Capital Money Market Fund (FCMMF)*",
    productOptionId: "unit-trust",
    description:
      "You like keeping things simple, flexible and within your comfort zone. You want your money to work, but you also like knowing you can access it when you need it.",
    vibe: "Keep calm. Keep flexible.",
    productDisclaimer:
      "* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ",
    procedureGuide: {
      label: "firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
      url: "https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
    },
    colorClass: "text-[#1a214c]",
    badgeBg: "bg-blue-50/80 border-blue-200 text-[#1a214c]",
    image: keepItCoolMale,
    maleImage: keepItCoolMale,
    femaleImage: keepItCoolFemale,
  },
  B: {
    key: "B",
    number: "02",
    name: "The Smooth Operator",
    style: "Income-Focused & Flexible",
    product: "First Capital Fixed Income Fund (FCFIF)*",
    productShort: "First Capital Fixed Income Fund (FCFIF)*",
    productOptionId: "unit-trust",
    description:
      "You’re looking for the sweet spot between earning a return and keeping your money accessible. You’re not chasing every opportunity - you prefer a more measured approach.",
    vibe: "Thoughtful choices. Smarter Investing.",
    productDisclaimer:
      "* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ",
    procedureGuide: {
      label: "firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
      url: "https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
    },
    colorClass: "text-[#1a214c]",
    badgeBg: "bg-blue-50/80 border-blue-200 text-[#1a214c]",
    image: smoothOperatorMale,
    maleImage: smoothOperatorMale,
    femaleImage: smoothOperatorFemale,
  },
  C: {
    key: "C",
    number: "03",
    name: "The Patient Player",
    style: "Long-term & income-focused",
    product: "Treasury Bonds*",
    productShort: "Treasury Bonds*",
    productOptionId: "gov-securities",
    description:
      "You’re comfortable giving your money time to work. You prefer a defined investment period and regular return as you build towards your bigger financial goals.",
    vibe: "Play the long game.",
    productDisclaimer:
      "*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ",
    procedureGuide: {
      label: "firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
      url: "https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
    },
    colorClass: "text-[#1a214c]",
    badgeBg: "bg-blue-50/80 border-blue-200 text-[#1a214c]",
    image: patientPlayerMale,
    maleImage: patientPlayerMale,
    femaleImage: patientPlayerFemale,
  },
  D: {
    key: "D",
    number: "04",
    name: "The Opportunity Hunter",
    style: "Growth-focused",
    product: "Equities*",
    productShort: "Equities*",
    productOptionId: "equities",
    description:
      "You’re thinking beyond the short term. You’re comfortable with market ups and downs and are focused on growing your wealth over the long run.",
    vibe: "Spot the opportunity. Think long term.",
    productDisclaimer:
      "*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ",
    procedureGuide: {
      label: "firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
      url: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
    },
    colorClass: "text-[#1a214c]",
    badgeBg: "bg-blue-50/80 border-blue-200 text-[#1a214c]",
    image: opportunityHunterMale,
    maleImage: opportunityHunterMale,
    femaleImage: opportunityHunterFemale,
  },
};

const OPTION_DETAILS: Record<string, {
  title: string;
  number: string;
  products?: Array<{ icon: any; title: string; tags: string[]; copy: string }>;
  simplyPut?: string;
  keyBenefits?: string[];
  video: { title: string; url: string; platform: string };
  disclaimer: string;
  guideUrl: string;
  guideLabel: string;
}> = {
  "unit-trust": {
    number: "01",
    title: "Unit Trust Funds",
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
        tags: ["Medium to long term", "Access anytime", "Start with LKR 1,000"],
        copy: "For investors looking for investment return while keeping access to their money.",
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
  "gov-securities": {
    number: "02",
    title: "Government Securities",
    simplyPut: "You invest money → The government uses your money → You receive regular interest → Your investment is repaid at maturity.",
    keyBenefits: ["Government-issued", "Regular interest", "Defined maturity", "Risk-free instrument"],
    video: {
      title: "Government Securities explained",
      url: "https://www.youtube.com/shorts/HGL82Tv1wJE",
      platform: "YouTube",
    },
    disclaimer: "*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ",
    guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
    guideLabel: "firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
  },
  "equities": {
    number: "03",
    title: "Equities",
    simplyPut: "You buy shares → You own a part of a company → The share value can rise or fall → You can benefit if the value increases.",
    keyBenefits: ["Long-term growth potential", "Own listed shares", "Market participation"],
    video: {
      title: "How do equities work?",
      url: "https://www.youtube.com/shorts/HGL82Tv1wJE",
      platform: "YouTube",
    },
    disclaimer: "*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ",
    guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
    guideLabel: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
  },
};

export const PROFILE_SLUGS: Record<ProfileKey, string> = {
  A: "keep-it-cool",
  B: "smooth-operator",
  C: "patient-player",
  D: "opportunity-hunter",
};

export const PROFILE_SHARE_CARDS: Record<ProfileKey, { male: string; female: string }> = {
  A: { male: shareKeepItCoolMale, female: shareKeepItCoolFemale },
  B: { male: shareSmoothOperatorMale, female: shareSmoothOperatorFemale },
  C: { male: sharePatientPlayerMale, female: sharePatientPlayerFemale },
  D: { male: shareOpportunityHunterMale, female: shareOpportunityHunterFemale },
};

export interface QuestionItem {
  id: number;
  question: string;
  options: {
    key: ProfileKey;
    label: string;
    text: string;
  }[];
}

export const QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "You have some extra money sitting in your account. What’s your first thought?",
    options: [
      {
        key: "A",
        label: "A",
        text: "I’d keep it somewhere safe, but I want to be able to access it anytime.",
      },
      {
        key: "B",
        label: "B",
        text: "I’m happy to leave it invested for a few months if I can earn a return.",
      },
      {
        key: "C",
        label: "C",
        text: "I’m comfortable leaving it invested for longer if it can grow steadily.",
      },
      {
        key: "D",
        label: "D",
        text: "I’d rather invest for the potential of higher long-term growth",
      },
    ],
  },
  {
    id: 2,
    question: "How long can you comfortably leave your money invested?",
    options: [
      { key: "A", label: "A", text: "1 - 6 months" },
      { key: "B", label: "B", text: "6 months – 1 year" },
      { key: "C", label: "C", text: "1–2 years" },
      { key: "D", label: "D", text: "More than 2 years" },
    ],
  },
  {
    id: 3,
    question: "Interest rates in the market move up and down frequently. What is your reaction?",
    options: [
      {
        key: "A",
        label: "A",
        text: "I’d probably want to take my money out.",
      },
      {
        key: "B",
        label: "B",
        text: "A little movement is fine, but I prefer stability.",
      },
      {
        key: "C",
        label: "C",
        text: "I can handle some ups and downs if I have a longer-term plan.",
      },
      {
        key: "D",
        label: "D",
        text: "I’m comfortable with bigger ups and downs for the chance of higher growth.",
      },
    ],
  },
  {
    id: 4,
    question: "What is your priority for investing right now?",
    options: [
      { key: "A", label: "A", text: "A financial safety net" },
      { key: "B", label: "B", text: "A goal coming up in the next year or so" },
      { key: "C", label: "C", text: "A bigger milestone in the next few years" },
      { key: "D", label: "D", text: "Long-term wealth and financial freedom" },
    ],
  },
  {
    id: 5,
    question: "What would you say is your pattern for investing?",
    options: [
      { key: "A", label: "A", text: "Setting aside an amount every month" },
      { key: "B", label: "B", text: "Investing when I have some extra money" },
      { key: "C", label: "C", text: "Investing a large amount at once and letting it work" },
      { key: "D", label: "D", text: "Investing when I spot an opportunity I believe in" },
    ],
  },
  {
    id: 6,
    question: "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
    options: [
      {
        key: "A",
        label: "A",
        text: "Keep it flexible and invest for the short term.",
      },
      {
        key: "B",
        label: "B",
        text: "Aim for a relatively stable return while keeping access to my money.",
      },
      {
        key: "C",
        label: "C",
        text: "Lock it into a longer-term government investment and earn regular interest.",
      },
      {
        key: "D",
        label: "D",
        text: "Invest in shares and stay invested for long-term growth.",
      },
    ],
  },
  {
    id: 7,
    question: "Which statement sounds most like you?",
    options: [
      { key: "A", label: "A", text: "“I like knowing my money is there when I need it.”" },
      { key: "B", label: "B", text: "“I want my money to grow, without taking on too much risk.”" },
      { key: "C", label: "C", text: "“I’m happy to wait if it means building my money for the potential of long-term growth.”" },
      { key: "D", label: "D", text: "“I’m playing the long game when it comes to my wealth.”" },
    ],
  },
];

/**
 * Scoring logic:
 * - Count selections of A, B, C, D across all answered questions
 * - Profile with highest score wins
 * - Tie-breaker 1: Q6 or second-to-last answer
 * - Tie-breaker 2: Q3 answer
 */
export function calculateResult(answers: Record<number, ProfileKey>): ProfileKey {
  const counts: Record<ProfileKey, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((ans) => {
    if (ans && counts[ans] !== undefined) {
      counts[ans]++;
    }
  });

  const maxScore = Math.max(counts.A, counts.B, counts.C, counts.D);
  const candidates: ProfileKey[] = (["A", "B", "C", "D"] as const).filter(
    (key) => counts[key] === maxScore
  );

  if (candidates.length === 1 && candidates[0]) {
    return candidates[0];
  }

  // Primary tie-breaker: Q6
  const q6 = answers[6];
  if (q6 && candidates.includes(q6)) {
    return q6;
  }

  // Secondary tie-breaker: Q3
  const q3 = answers[3];
  if (q3 && candidates.includes(q3)) {
    return q3;
  }

  return candidates[0] ?? "A";
}

interface QuizFlowProps {
  onComplete?: (result: ProfileInfo, answers: Record<number, ProfileKey>) => void;
  onExploreMatch?: (result: ProfileInfo) => void;
  className?: string;
  showCardContainer?: boolean;
}

export function QuizFlow({
  onComplete,
  onExploreMatch,
  className = "",
  showCardContainer = true,
}: QuizFlowProps) {
  // stage can be "quiz" (questions), "details" (capturing user info after questions), or "results"
  const [stage, setStage] = useState<"quiz" | "details" | "results">("quiz");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, ProfileKey>>({});
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>(() => AdminStore.getQuestions());

  useEffect(() => {
    setQuestions(AdminStore.getQuestions());
    const unsub = AdminStore.subscribe(() => {
      setQuestions(AdminStore.getQuestions());
    });
    return unsub;
  }, []);

  // User details state
  const [leadDetails, setLeadDetails] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male" as "male" | "female",
  });
  const [leadId, setLeadId] = useState<number | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});
  const [postCopied, setPostCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const totalQuestions = questions.length || 1;
  const isResultsStep = stage === "results";
  const isQuizStep = stage === "quiz";
  const isDetailsStep = stage === "details";
  const currentQuestion = questions[currentStep] as QuestionItem | undefined;

  const sanitizeInput = (val: string) => {
    return val.replace(/<[^>]*>/g, "").replace(/\0/g, "");
  };

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    const cleanName = sanitizeInput(leadDetails.name).trim();
    const cleanEmail = sanitizeInput(leadDetails.email).trim().toLowerCase();
    const cleanPhone = sanitizeInput(leadDetails.phone).trim();
    const digitsOnly = cleanPhone.replace(/\D/g, "");

    if (!cleanName) {
      errors["name"] = "Please enter your full name.";
    } else if (cleanName.length < 2) {
      errors["name"] = "Name must be at least 2 characters.";
    }

    if (!cleanEmail) {
      errors["email"] = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors["email"] = "Please enter a valid email address.";
    }

    if (!cleanPhone) {
      errors["phone"] = "Please enter your phone number.";
    } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors["phone"] = "Please enter a valid phone number (8 to 15 digits).";
    }

    return errors;
  };

  const hasCapturedLead = Boolean(
    leadDetails.name.trim() &&
    leadDetails.email.trim() &&
    leadDetails.phone.trim()
  );

  const processLeadSubmission = async (currentLeadData = leadDetails) => {
    // Cleaned & sanitized payload
    const sanitizedName = sanitizeInput(currentLeadData.name).replace(/[^\p{L}\s.'-]/gu, "").replace(/\s+/g, " ").trim();
    const sanitizedEmail = sanitizeInput(currentLeadData.email).trim().toLowerCase();
    const sanitizedPhone = sanitizeInput(currentLeadData.phone).replace(/[^\d+\-()\s]/g, "").replace(/\s+/g, " ").trim();
    const selectedGender = currentLeadData.gender || "male";

    setIsSubmittingDetails(true);
    setDetailsErrors({});

    const winnerKey = calculateResult(answers);
    const winnerProfile = PROFILES[winnerKey];

    try {
      const id = await submitLeadDetails({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        gender: selectedGender,
        profileKey: winnerKey,
        resultCode: winnerKey,
        profileName: winnerProfile.name,
        resultProfile: winnerProfile.name,
        matchedProduct: winnerProfile.productShort,
        answers,
        source: typeof window !== "undefined" && window.location.pathname.includes("design-option-2") ? "Design Option 2 Quiz" : "Main Quiz Flow",
        status: "NEW",
      });
      setLeadId(id);

      // Save to Admin Store
      AdminStore.saveLead({
        dbId: id || undefined,
        id: id ? `FC-${id}` : undefined,
        name: sanitizedName || "Investor Quiz User",
        email: sanitizedEmail || "N/A",
        phone: sanitizedPhone || "N/A",
        gender: selectedGender,
        profileKey: winnerKey,
        profileName: winnerProfile.name,
        matchedProduct: winnerProfile.productShort,
        answers,
        source: typeof window !== "undefined" && window.location.pathname.includes("design-option-2") ? "Design Option 2 Quiz" : "Main Quiz Flow",
        status: "NEW",
      });

      setIsAnalyzing(true);
      setStage("results");

      setTimeout(() => {
        setIsAnalyzing(false);
        if (onComplete) {
          onComplete(winnerProfile, answers);
        }
      }, 1600);
    } catch (err: any) {
      // Fallback to AdminStore
      AdminStore.saveLead({
        name: sanitizedName || "Investor Quiz User",
        email: sanitizedEmail || "N/A",
        phone: sanitizedPhone || "N/A",
        gender: selectedGender,
        profileKey: winnerKey,
        profileName: winnerProfile.name,
        matchedProduct: winnerProfile.productShort,
        answers,
        source: typeof window !== "undefined" && window.location.pathname.includes("design-option-2") ? "Design Option 2 Quiz" : "Main Quiz Flow",
        status: "NEW",
      });

      setIsAnalyzing(true);
      setStage("results");

      setTimeout(() => {
        setIsAnalyzing(false);
        if (onComplete) {
          onComplete(winnerProfile, answers);
        }
      }, 1600);
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateDetails();
    if (Object.keys(errors).length > 0) {
      setDetailsErrors(errors);
      return;
    }
    await processLeadSubmission(leadDetails);
  };

  const handleSelectOption = (key: ProfileKey) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === totalQuestions - 1) {
      // If user details have already been captured (e.g., retaking quiz), don't ask again and reveal results immediately
      if (hasCapturedLead) {
        processLeadSubmission(leadDetails);
      } else {
        // Questions finished -> Collect user details before results
        setStage("details");
      }
    }
  };

  const handleBack = () => {
    if (stage === "details") {
      setStage("quiz");
      setCurrentStep(totalQuestions - 1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setStage("quiz");
    setIsAnalyzing(false);
    setCopied(false);
    setShowDisclaimer(false);
    setSelectedProductModal(null);
    setShowShareModal(false);
  };
  const handleReset = handleRetake;

  // Progress percentage for questions
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  // Result calculation
  const winnerKey = calculateResult(answers);
  const resultProfile = PROFILES[winnerKey];

  const personalitySlug = PROFILE_SLUGS[winnerKey] || "keep-it-cool";
  const shareGender = leadDetails.gender || "male";
  const shareCardImage = (PROFILE_SHARE_CARDS[winnerKey] && PROFILE_SHARE_CARDS[winnerKey][shareGender]) || PROFILE_SHARE_CARDS[winnerKey]?.male;
  const basePath = typeof window !== "undefined"
    ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1)
    : "/fc/";
  const isLocalHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.includes("192.168."));
  const shareUrl = typeof window !== "undefined" && !isLocalHost
    ? `${window.location.origin}${basePath}${personalitySlug}-${shareGender}.html?v=fc3`
    : `https://ai.loopsintegrated.co/fc/${personalitySlug}-${shareGender}.html?v=fc3`;
  const sharePostText = `I just found my investor personality with First Capital! I'm "${resultProfile?.name || "Investor"}" - "${resultProfile?.vibe || ""}".\n\nFind your investor type here:\n${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(sharePostText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleNativeShareImage = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share && shareCardImage) {
        const res = await fetch(shareCardImage);
        const blob = await res.blob();
        const file = new File([blob], `first-capital-${personalitySlug}-${shareGender}.jpg`, { type: "image/jpeg" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `First Capital - ${resultProfile?.name}`,
            text: sharePostText,
          });
          return true;
        }
      }
    } catch (e) {
      console.log("Native share fallback", e);
    }
    return false;
  };

  const handleShareResult = () => {
    setShowShareModal(true);
  };



  const handleExploreMatchClick = () => {
    if (onExploreMatch) {
      onExploreMatch(resultProfile);
    } else {
      const optionsEl = document.getElementById("options");
      if (optionsEl) {
        optionsEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Progress Bar Container: shown only during questions */}
      {isQuizStep && (
        <div className={`w-full max-w-3xl mx-auto mb-6 sm:mb-8 ${showCardContainer ? "px-4" : "px-0"}`}>
          <div className="w-full h-2 bg-slate-200/90 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#f1c91e]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 px-0.5 text-left">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-wider">
              {String(currentStep + 1).padStart(2, "0")}-{String(totalQuestions).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {/* Main Quiz Card */}
      <div
        className={
          showCardContainer
            ? "max-w-3xl mx-auto bg-white !rounded-[28px] sm:!rounded-[32px] p-6 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 transition-all"
            : "w-full"
        }
      >
        {isQuizStep && currentQuestion ? (
          <div className="animate-in fade-in duration-300">
            {/* Question Heading */}
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#142d27] tracking-tight leading-snug max-w-2xl mx-auto">
                {currentQuestion.question}
              </h2>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    className={`group relative w-full py-4 px-5 sm:px-6 rounded-2xl text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#f1c91e] bg-amber-50/40 text-[#142d27] font-semibold shadow-sm ring-2 ring-[#f1c91e]/20"
                        : "border border-slate-200/90 bg-white text-slate-700 hover:border-[#f1c91e]/70 hover:bg-slate-50/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 pr-3">
                      <span
                        className={`size-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-[#f1c91e] text-[#142d27] font-extrabold"
                            : "bg-slate-100 text-slate-600 group-hover:bg-[#f1c91e]/20 group-hover:text-[#142d27]"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-sm sm:text-base leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`size-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#f1c91e] text-[#142d27]"
                          : "border border-slate-300 group-hover:border-[#f1c91e]"
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 sm:mt-10 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer text-sm sm:text-base ${
                    currentStep === 0 ? "invisible pointer-events-none" : ""
                  }`}
                >
                  <ArrowLeft className="size-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.98] text-[#142d27] px-7 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                >
                  {currentStep === totalQuestions - 1 ? "Continue" : "Next"}{" "}
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Small Disclaimer Section Under Next Button */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 text-left">
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-400">
                  <strong className="font-semibold text-slate-500">* Disclaimer: </strong>
                  This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.
                </p>
              </div>
            </div>
          </div>
        ) : isDetailsStep ? (
          /* User Details Capture Form after completing all questions */
          <div className="animate-in fade-in duration-300 py-1 sm:py-2">
            <div className="text-center max-w-xl mx-auto mb-7 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#142d27] text-xs font-bold mb-3">
                <Sparkles className="size-3.5 text-[#d4af15]" /> Almost Done!
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142d27] tracking-tight mb-2">
                Tell us about yourself
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Please provide your details so we can calculate your investor personality and reveal your personalized recommendations.
              </p>
            </div>

            <form onSubmit={handleDetailsSubmit} className="max-w-md mx-auto space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="size-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={leadDetails.name}
                    onChange={(e) => {
                      setLeadDetails((prev) => ({ ...prev, name: e.target.value }));
                      if (detailsErrors["name"]) {
                        setDetailsErrors((prev) => {
                          const next = { ...prev };
                          delete next["name"];
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. Ruwan Perera"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none shadow-xs text-slate-800 placeholder:text-slate-400 ${
                      detailsErrors["name"]
                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 shadow-sm"
                        : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md"
                    }`}
                  />
                </div>
                {detailsErrors["name"] && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{detailsErrors["name"]}</p>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLeadDetails((prev) => ({ ...prev, gender: "male" }))}
                    className={`flex items-center justify-center py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      leadDetails.gender === "male"
                        ? "border-2 border-[#f1c91e] bg-[#f1c91e]/15 text-[#142d27] ring-2 ring-[#f1c91e]/40 font-extrabold shadow-sm"
                        : "border border-slate-300 bg-white text-slate-700 shadow-xs hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                  >
                    <span>Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadDetails((prev) => ({ ...prev, gender: "female" }))}
                    className={`flex items-center justify-center py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      leadDetails.gender === "female"
                        ? "border-2 border-[#f1c91e] bg-[#f1c91e]/15 text-[#142d27] ring-2 ring-[#f1c91e]/40 font-extrabold shadow-sm"
                        : "border border-slate-300 bg-white text-slate-700 shadow-xs hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                  >
                    <span>Female</span>
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="size-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={leadDetails.email}
                    onChange={(e) => {
                      setLeadDetails((prev) => ({ ...prev, email: e.target.value }));
                      if (detailsErrors["email"]) {
                        setDetailsErrors((prev) => {
                          const next = { ...prev };
                          delete next["email"];
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. ruwan@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none shadow-xs text-slate-800 placeholder:text-slate-400 ${
                      detailsErrors["email"]
                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 shadow-sm"
                        : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md"
                    }`}
                  />
                </div>
                {detailsErrors["email"] && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{detailsErrors["email"]}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="size-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={leadDetails.phone}
                    onChange={(e) => {
                      setLeadDetails((prev) => ({ ...prev, phone: e.target.value }));
                      if (detailsErrors["phone"]) {
                        setDetailsErrors((prev) => {
                          const next = { ...prev };
                          delete next["phone"];
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. 077 123 4567"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none shadow-xs text-slate-800 placeholder:text-slate-400 ${
                      detailsErrors["phone"]
                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 shadow-sm"
                        : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md"
                    }`}
                  />
                </div>
                {detailsErrors["phone"] && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{detailsErrors["phone"]}</p>
                )}
              </div>

              {detailsErrors["general"] && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {detailsErrors["general"]}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingDetails}
                  className="w-full bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.99] text-[#142d27] py-3.5 px-6 rounded-xl font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmittingDetails ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Calculating Results…
                    </>
                  ) : (
                    <>
                      <span>Reveal My Investor Personality</span>
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStage("quiz");
                    setCurrentStep(totalQuestions - 1);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="size-3" /> Back to questions
                </button>
              </div>

              {/* Small Disclaimer Section Under Start Quiz Button */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 text-left">
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-400">
                  <strong className="font-semibold text-slate-500">* Disclaimer: </strong>
                  This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.
                </p>
              </div>
            </form>
          </div>
        ) : isAnalyzing ? (
          /* Short Loading Screen */
          <div className="animate-in fade-in duration-300 py-14 sm:py-20 text-center max-w-md mx-auto">
            <div className="relative size-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-35" />
              <div className="relative size-16 rounded-full bg-amber-50 border-2 border-[#f1c91e]/40 flex items-center justify-center shadow-xs">
                <Loader2 className="size-8 text-[#d4af15] animate-spin" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#142d27] mb-2.5 tracking-tight">
              Finding your investor type…
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Evaluating your preferences and matching your profile with First Capital investment options.
            </p>

            <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
              <div className="h-full bg-[#e0b815] rounded-full animate-pulse w-full" />
            </div>
          </div>
        ) : selectedProductModal && OPTION_DETAILS[selectedProductModal] ? (
          /* Full In-Modal Product Details Screen (Utilizes 100% modal space) */
          <div className="animate-in fade-in duration-200 py-1 w-full text-left space-y-5">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-extrabold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to My Result</span>
              </button>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Option {OPTION_DETAILS[selectedProductModal].number}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">
                {OPTION_DETAILS[selectedProductModal].title}
              </h3>
            </div>

            {/* Available Fund Types */}
            {OPTION_DETAILS[selectedProductModal].products && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Available Fund Types:
                </h4>
                <div className="grid gap-3.5 sm:grid-cols-3">
                  {OPTION_DETAILS[selectedProductModal].products.map((p) => {
                    const PIcon = p.icon;
                    const isMatch = resultProfile.product.toLowerCase().includes(p.title.toLowerCase().replace(" fund", ""));
                    return (
                      <div
                        key={p.title}
                        className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                          isMatch
                            ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-300/40 shadow-xs"
                            : "border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="size-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#1a214c] shadow-2xs shrink-0">
                              <PIcon className="size-4 text-[#1a214c]" />
                            </div>
                            <h5 className="text-sm sm:text-base font-extrabold text-[#1a214c] leading-snug">{p.title}</h5>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.copy}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60">
                          {p.tags.map((t) => (
                            <span key={t} className="border border-slate-200 bg-white rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-600">
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

            {/* Simply Put Flow */}
            {OPTION_DETAILS[selectedProductModal].simplyPut && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Simply put:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {OPTION_DETAILS[selectedProductModal].simplyPut.split("→").map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 border border-slate-200 bg-slate-50/80 rounded-2xl p-3.5 shadow-2xs">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1a214c] text-xs font-black text-white">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {step.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {OPTION_DETAILS[selectedProductModal].keyBenefits && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Key Benefits:</h4>
                <div className="flex flex-wrap gap-2">
                  {OPTION_DETAILS[selectedProductModal].keyBenefits.map((b) => (
                    <span key={b} className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Explainer Card */}
            {OPTION_DETAILS[selectedProductModal].video && (
              <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-200 bg-amber-50/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#1a214c] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Play className="size-5 fill-current ml-0.5 text-[#e0b815]" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{OPTION_DETAILS[selectedProductModal].video.title}</p>
                  </div>
                </div>
                <a
                  href={OPTION_DETAILS[selectedProductModal].video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#1a214c] text-white px-4 py-2 rounded-xl hover:bg-[#252f6b] transition-colors"
                >
                  Watch Video <ExternalLink className="size-3.5 text-[#e0b815]" />
                </a>
              </div>
            )}

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://portal.firstcapital.lk/#/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#1a214c] hover:bg-[#252f6b] text-white py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>I would like to create my account</span>
                <ArrowRight className="size-4 text-[#e0b815]" />
              </a>
              <a
                href="https://firstcapital.lk/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#e0b815] hover:bg-[#cba40e] text-[#1a214c] py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-center shadow-xs transition-colors"
              >
                <span>I would like to speak to someone first</span>
              </a>
            </div>

            {/* Back to Result Card Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to My Result Card</span>
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
              <span>{OPTION_DETAILS[selectedProductModal].disclaimer}</span>
              {OPTION_DETAILS[selectedProductModal].guideUrl && (
                <a
                  href={OPTION_DETAILS[selectedProductModal].guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all"
                >
                  <span>{OPTION_DETAILS[selectedProductModal].guideLabel}</span>
                  <ExternalLink className="size-2.5 inline shrink-0" />
                </a>
              )}
            </p>
          </div>
        ) : showShareModal ? (
          /* Full In-Modal Share Screen (Seamless full-space view, no nested popups, no border clipping) */
          <div className="animate-in fade-in duration-200 py-1 w-full text-left space-y-4">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-extrabold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to My Result</span>
              </button>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                Share Result
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">
                Share Your Result
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Post your investor personality on social media or download your personalized card.
              </p>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center pt-2">
              {/* Left Column: Share Card Preview */}
              <div className="bg-slate-50/80 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Share Card Preview
                  </span>
                  <a
                    href={shareCardImage}
                    download={`first-capital-${personalitySlug}-${shareGender}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1a214c] hover:text-[#e0b815] underline"
                  >
                    <Download className="size-3.5" />
                    <span>Save Image</span>
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden shadow-xs bg-white">
                  <img
                    src={shareCardImage}
                    alt={`${resultProfile?.name || "Investor"} Share Card`}
                    className="w-full h-auto object-cover block"
                  />
                </div>
              </div>

              {/* Right Column: 1-Click Share Actions */}
              <div className="space-y-4 flex flex-col justify-center">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-2.5">
                    Share directly to:
                  </h4>
                  <div className="space-y-2.5">
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <WhatsAppIcon className="size-5 shrink-0" />
                        <span>Share on WhatsApp</span>
                      </div>
                      <ArrowRight className="size-4 opacity-70" />
                    </a>

                    {/* Facebook */}
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(sharePostText);
                        }
                      }}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FacebookIcon className="size-5 shrink-0" />
                        <span>Share on Facebook</span>
                      </div>
                      <ArrowRight className="size-4 opacity-70" />
                    </a>

                    {/* Copy Post / Link */}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(sharePostText);
                          setPostCopied(true);
                          setTimeout(() => setPostCopied(false), 2500);
                        }
                      }}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-bold text-sm transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Copy className="size-5 shrink-0" />
                        <span>{postCopied ? "Post & Link Copied!" : "Copy Share Post & Link"}</span>
                      </div>
                      {postCopied ? <Check className="size-4 text-emerald-600 stroke-[3]" /> : <ArrowRight className="size-4 opacity-70" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Result Card</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Screen: Left Column (Character Image top-left + Disclaimer) + Right Column (Personality Card, Match Card, CTAs) */
          <div className="animate-in fade-in duration-300 py-0.5 w-full text-left">
            <div className="grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[245px_1fr] gap-4 sm:gap-5 items-start">
              {/* Left Column: Character Image Card + Disclaimer Box Underneath */}
              <div className="flex flex-col space-y-2.5 w-full max-w-[225px] lg:max-w-[245px] mx-auto md:mx-0">
                {/* Character Image Card (Border snugly fits the image) */}
                <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm bg-white">
                  <img
                    src={(leadDetails.gender === "female" ? resultProfile.femaleImage : resultProfile.maleImage) || resultProfile.image}
                    alt={resultProfile.name}
                    className="w-full h-auto block object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                {/* Disclaimer Section - Under the image on desktop */}
                <div className="hidden md:block bg-slate-50 border border-slate-200/90 rounded-xl p-2 sm:p-2.5 text-[8.5px] sm:text-[9.5px] leading-relaxed text-slate-500">
                  <p>
                    <strong className="font-bold text-slate-700">* Disclaimers: </strong>
                    {resultProfile.productDisclaimer.replace(/^\*\s*Disclaimers?:\s*/i, "")}
                    {resultProfile.procedureGuide && (
                      <a
                        href={resultProfile.procedureGuide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all transition-colors"
                      >
                        <span>{resultProfile.procedureGuide.label}</span>
                        <ExternalLink className="size-2.5 inline shrink-0" />
                      </a>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Personality Card, Suggested Match, Action Buttons */}
              <div className="space-y-3 text-left">
                {/* Persona Card - Deep Navy #1a214c with Name, Gold Quote, and Description */}
                <div className="bg-[#1a214c] text-white rounded-2xl p-4 sm:p-4.5 shadow-md border border-[#1a214c] relative overflow-hidden">
                  <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-tight">
                    {resultProfile.name}
                  </h2>

                  <div className="mt-2 inline-block bg-[#e0b815] text-[#1a214c] px-3 py-0.5 rounded-md shadow-xs">
                    <p className="text-xs sm:text-sm font-black italic">
                      “{resultProfile.vibe}”
                    </p>
                  </div>

                  <p className="mt-2.5 text-slate-100 text-xs sm:text-sm leading-relaxed font-normal">
                    {resultProfile.description}
                  </p>
                </div>

                {/* Suggested Investment Match Card */}
                <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                      <TrendingUp className="size-3.5 text-[#1a214c] shrink-0 stroke-[2.5]" />
                      <span className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider">
                        Suggested Investment Match
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-extrabold text-[#1a214c] leading-snug">
                      {resultProfile.product}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProductModal(resultProfile.productOptionId)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a214c] hover:bg-[#252f6b] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-center border border-[#1a214c]"
                  >
                    <span>Explore Product</span>
                    <ArrowRight className="size-3.5 text-[#e0b815]" />
                  </button>
                </div>

                {/* Heading */}
                <div className="pt-0.5 mb-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1a214c]">
                    Become an investor today!
                  </h3>
                </div>

                {/* Stacked CTA Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  {/* CTA 1: Speak to someone - Gold #e0b815 */}
                  <a
                    href="https://firstcapital.lk/contact-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#e0b815] hover:bg-[#cba40e] active:scale-[0.99] text-[#1a214c] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer text-center"
                  >
                    <span>I would like to speak to someone first</span>
                  </a>

                  {/* CTA 2: Create account - Navy #1a214c */}
                  <a
                    href="https://portal.firstcapital.lk/#/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1a214c] hover:bg-[#252f6b] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer text-center border border-[#1a214c]"
                  >
                    <span>I would like to create my account</span>
                  </a>
                </div>

                {/* Footer Action Links: Share & Retake side by side */}
                <div className="pt-1.5 flex items-center justify-center gap-6 sm:gap-10 text-xs">
                  <button
                    type="button"
                    onClick={handleShareResult}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#1a214c] hover:underline cursor-pointer transition-colors"
                  >
                    <Share2 className="size-3.5 text-[#1a214c]" />
                    <span>{copied ? "Link Copied!" : "Share Result"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRetake}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#1a214c] hover:underline cursor-pointer transition-colors"
                  >
                    <RotateCcw className="size-3.5 text-[#1a214c]" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

                {/* Mobile Disclaimer Section - At the very bottom */}
                <div className="block md:hidden mt-4 pt-3 border-t border-slate-100 bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-[9px] leading-relaxed text-slate-500">
                  <p>
                    <strong className="font-bold text-slate-700">* Disclaimers: </strong>
                    {resultProfile.productDisclaimer.replace(/^\*\s*Disclaimers?:\s*/i, "")}
                    {resultProfile.procedureGuide && (
                      <a
                        href={resultProfile.procedureGuide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all transition-colors"
                      >
                        <span>{resultProfile.procedureGuide.label}</span>
                        <ExternalLink className="size-2.5 inline shrink-0" />
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
    </svg>
  );
}

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  );
}

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

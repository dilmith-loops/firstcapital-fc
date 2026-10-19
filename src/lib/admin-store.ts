import { ProfileKey, PROFILES, ProfileInfo } from "../components/quiz/QuizFlow";
import { getApiUrl } from "./api-url";

export type LeadStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED";

export interface QuizLead {
  id: string;
  dbId?: number | undefined;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  gender?: "male" | "female" | string | undefined;
  profileKey: ProfileKey;
  profileName: string;
  matchedProduct: string;
  investmentAmount?: string | undefined;
  preferredContact?: "phone" | "email" | "whatsapp" | undefined;
  status: LeadStatus;
  notes?: string | undefined;
  answers?: Record<number, ProfileKey | string> | undefined;
  source?: string | undefined;
}

export interface InvestmentProduct {
  id: string;
  title: string;
  shortTitle: string;
  assetClass: string;
  riskLevel: "Low" | "Moderate" | "High";
  minInvestment: string;
  expectedReturn: string;
  description: string;
  disclaimer: string;
  status: "Active" | "Under Review";
}

export interface AdminSettings {
  adminEmail: string;
  adminName: string;
  notificationEmail: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  dailyDigest: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  details: string;
}

export interface QuestionOption {
  key: ProfileKey;
  label: string;
  text: string;
}

export interface QuestionItem {
  id: number;
  question: string;
  options: QuestionOption[];
}

export interface DbStatusInfo {
  connected: boolean;
  host: string;
  database: string;
  port: number;
  totalLeads: number;
  timestamp: string;
  tables: string[];
  error?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
  status: "Active" | "Draft" | "Archived";
  createdAt?: string;
}

export interface WhyReasonItem {
  id: string;
  icon: string;
  title: string;
  copy: string;
  visible: boolean;
  order: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "Super Admin" | "Manager" | "Wealth Advisor" | "Viewer";
  status: "Active" | "Inactive";
  createdAt: string;
  lastLogin?: string;
}

const STORAGE_KEY_LEADS = "fc_admin_leads";
const STORAGE_KEY_PRODUCTS = "fc_admin_products";
const STORAGE_KEY_SETTINGS = "fc_admin_settings";
const STORAGE_KEY_LOGS = "fc_admin_logs";
const STORAGE_KEY_QUESTIONS = "fc_admin_questions";
const STORAGE_KEY_TESTIMONIALS = "fc_admin_testimonials";
const STORAGE_KEY_QUIZ_RESULTS = "fc_admin_quiz_results";
const STORAGE_KEY_WHY_REASONS = "fc_admin_why_reasons";

export function mergeWithDefaultProfiles(
  customProfiles?: Record<string, Partial<ProfileInfo>> | null
): Record<ProfileKey, ProfileInfo> {
  const result: Record<ProfileKey, ProfileInfo> = { ...PROFILES };
  if (!customProfiles || typeof customProfiles !== "object") return result;

  (["A", "B", "C", "D"] as ProfileKey[]).forEach((key) => {
    if (customProfiles[key]) {
      result[key] = {
        ...PROFILES[key],
        ...customProfiles[key],
        key,
        procedureGuide: customProfiles[key].procedureGuide || PROFILES[key].procedureGuide,
        image: PROFILES[key].image,
        maleImage: PROFILES[key].maleImage,
        femaleImage: PROFILES[key].femaleImage,
      };
    }
  });

  return result;
}

// Admin accounts live server-side (api/auth.php); the first one is created via the one-time setup screen.
export const DEFAULT_ADMIN_USERS: AdminUser[] = [];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    quote: "I started with just LKR 1,000, mostly to see what would happen. A year later, investing is simply part of my monthly routine.",
    name: "Dinuka P.",
    role: "First-time investor",
    rating: 5,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-2",
    quote: "Everything was explained in plain language. I never felt like I needed a finance degree to take the first step.",
    name: "Shanika F.",
    role: "Young professional",
    rating: 5,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-3",
    quote: "Knowing I can get to my money when I need it made starting far less intimidating. That flexibility is why I began at all.",
    name: "Aravinda P.",
    role: "Saver turned investor",
    rating: 5,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-4",
    quote: "It helps knowing the people managing your money have been doing this for over forty years. I just stay consistent and let it grow.",
    name: "Malsha S.",
    role: "Long-term investor",
    rating: 5,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_WHY_REASONS: WhyReasonItem[] = [
  {
    id: "reason-1",
    icon: "Users",
    title: "Professional Management",
    copy: "With the premier Unit Trust company in Sri Lanka, there’s no need to pick assets; specialists track the market for you.",
    visible: true,
    order: 1,
  },
  {
    id: "reason-2",
    icon: "BarChart3",
    title: "Diversification",
    copy: "Your risk spreads across multiple investments, not one big bet.",
    visible: true,
    order: 2,
  },
  {
    id: "reason-3",
    icon: "Sparkles",
    title: "Start Small",
    copy: "Begin with only LKR 1,000.",
    visible: true,
    order: 3,
  },
  {
    id: "reason-4",
    icon: "RefreshCw",
    title: "Easy Entry and Exit",
    copy: "Buy or sell units with flexibility, because you deserve the power to control your assets.",
    visible: true,
    order: 4,
  },
  {
    id: "reason-5",
    icon: "Landmark",
    title: "40+ Years of Investment Expertise",
    copy: "Over four decades of experience in Sri Lanka’s capital markets.",
    visible: true,
    order: 5,
  },
  {
    id: "reason-6",
    icon: "CircleDollarSign",
    title: "Investment Options for Different Goals",
    copy: "Investments in different asset classes to suit different goals and time horizons.",
    visible: true,
    order: 6,
  },
  {
    id: "reason-7",
    icon: "Building2",
    title: "Backed by Janashakthi Group",
    copy: "Part of one of Sri Lanka’s established financial conglomerates.",
    visible: true,
    order: 7,
  },
  {
    id: "reason-8",
    icon: "BookOpen",
    title: "Gain Research Insights and Education",
    copy: "Access market insights, research and educational content to invest with confidence.",
    visible: true,
    order: 8,
  },
];

export const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "You have some extra money sitting in your account. What’s your first thought?",
    options: [
      { key: "A", label: "A", text: "I’d keep it somewhere safe, but I want to be able to access it anytime." },
      { key: "B", label: "B", text: "I’m happy to leave it invested for a few months if I can earn a return." },
      { key: "C", label: "C", text: "I’m comfortable leaving it invested for longer if it can grow steadily." },
      { key: "D", label: "D", text: "I’d rather put it to work for bigger long-term growth." },
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
      { key: "A", label: "A", text: "I’d probably want to take my money out." },
      { key: "B", label: "B", text: "A little movement is fine, but I prefer stability." },
      { key: "C", label: "C", text: "I can handle some ups and downs if I have a longer-term plan." },
      { key: "D", label: "D", text: "I’m comfortable with bigger ups and downs for the chance of higher growth." },
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
      { key: "A", label: "A", text: "Keep it flexible and invest for the short term." },
      { key: "B", label: "B", text: "Aim for a relatively stable return while keeping access to my money." },
      { key: "C", label: "C", text: "Lock it into a longer-term government investment and earn regular interest." },
      { key: "D", label: "D", text: "Invest in shares and stay invested for long-term growth." },
    ],
  },
  {
    id: 7,
    question: "Which statement sounds most like you?",
    options: [
      { key: "A", label: "A", text: "“I like knowing my money is there when I need it.”" },
      { key: "B", label: "B", text: "“I want my money working, without taking on too much risk.”" },
      { key: "C", label: "C", text: "“I’m happy to wait if it means building my money for the potential of long-term growth.”" },
      { key: "D", label: "D", text: "“I’m playing the long game when it comes to my wealth.”" },
    ],
  },
];

// Default Initial Products
const DEFAULT_PRODUCTS: InvestmentProduct[] = [
  {
    id: "fcmmf",
    title: "First Capital Money Market Fund (FCMMF)",
    shortTitle: "Money Market Fund",
    assetClass: "Unit Trust Fund (Short-term)",
    riskLevel: "Low",
    minInvestment: "LKR 1,000",
    expectedReturn: "Variable Yield (Market-linked)",
    description: "For investors who want to keep their money accessible while putting it to work in high-quality short-term instruments.",
    disclaimer: "The current yield is variable and subject to change. Past performance is not an indicator of future performance. KIID available upon request. SEC Approved.",
    status: "Active",
  },
  {
    id: "fcfif",
    title: "First Capital Fixed Income Fund (FCFIF)",
    shortTitle: "Fixed Income Fund",
    assetClass: "Unit Trust Fund (Medium-to-Long term)",
    riskLevel: "Moderate",
    minInvestment: "LKR 1,000",
    expectedReturn: "Steady Income Yield",
    description: "For investors looking for investment return while keeping access to their money.",
    disclaimer: "Current yield is variable and subject to change. SEC Approved. Terms & conditions apply.",
    status: "Active",
  },
  {
    id: "tbonds",
    title: "Government Securities (Treasury Bonds & Bills)",
    shortTitle: "Treasury Bonds",
    assetClass: "Government Debt",
    riskLevel: "Low",
    minInvestment: "LKR 100,000",
    expectedReturn: "Fixed Coupon Interest",
    description: "Backed by the Government of Sri Lanka with defined maturity periods and regular coupon interest payments.",
    disclaimer: "Subject to market conditions and sovereign terms. 100% principal repayment backed at maturity.",
    status: "Active",
  },
  {
    id: "equities",
    title: "Equity & Share Market Investments",
    shortTitle: "Equities",
    assetClass: "Colombo Stock Exchange (CSE)",
    riskLevel: "High",
    minInvestment: "LKR 1,000",
    expectedReturn: "Capital Growth + Dividends",
    description: "Direct exposure to top listed companies in Sri Lanka for maximum long-term capital appreciation.",
    disclaimer: "Equities investments are subject to market risks. Past returns do not guarantee future growth.",
    status: "Active",
  },
];

const DEFAULT_SETTINGS: AdminSettings = {
  adminEmail: "admin@firstcapital.lk",
  adminName: "Executive Administrator",
  notificationEmail: "leads@firstcapital.lk",
  emailAlerts: true,
  smsAlerts: false,
  dailyDigest: true,
};

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    admin: "admin@firstcapital.lk",
    action: "DB_SYNC",
    details: "Connected to MySQL database 'firstcapital'",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fc_admin_store_updated"));
  }
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  data?: any;
}

let sessionAdmin: AdminUser | null = null;
let adminUsersCache: AdminUser[] = [];
let inMemoryLeads: QuizLead[] = [];
let setupState = { setupRequired: false, setupEnabled: false };

function authUrl(action: string): string {
  return getApiUrl(`api/auth.php?action=${action}`);
}

// Same-origin fetch for admin-only endpoints; a 401 means the server session ended,
// so drop back to the login screen.
async function adminFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { credentials: "same-origin", ...init });
  if (res.status === 401 && sessionAdmin) {
    sessionAdmin = null;
    notify();
  }
  return res;
}

async function authPost(action: string, body: unknown): Promise<AuthResult> {
  try {
    const res = await adminFetch(authUrl(action), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      return { ok: false, error: json.error || "Request failed. Please try again." };
    }
    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again." };
  }
}

// Remove the old browser-only login data and unencrypted lead persistence (SEC-VULN-02).
function clearLegacyAuthStorage() {
  if (typeof window === "undefined") return;
  try {
    ["fc_admin_auth", "fc_admin_current_user", "fc_admin_users", "fc_admin_pwd", STORAGE_KEY_LEADS].forEach((k) => localStorage.removeItem(k));
  } catch {}
}

export const AdminStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Auth Operations (server-side sessions via api/auth.php)
  isAuthenticated(): boolean {
    return sessionAdmin !== null;
  },

  getCurrentAdmin(): AdminUser | null {
    return sessionAdmin;
  },

  getSetupState(): { setupRequired: boolean; setupEnabled: boolean } {
    return setupState;
  },

  // Asks the server who is logged in; call once when the admin page loads.
  async refreshSession(): Promise<boolean> {
    clearLegacyAuthStorage();
    try {
      const res = await fetch(authUrl("me"), { credentials: "same-origin" });
      const json = await res.json();
      sessionAdmin = json.authenticated && json.admin ? json.admin : null;
      setupState = { setupRequired: !!json.setupRequired, setupEnabled: !!json.setupEnabled };
    } catch {
      sessionAdmin = null;
    }
    notify();
    return sessionAdmin !== null;
  },

  async login(email: string, pass: string): Promise<AuthResult> {
    const result = await authPost("login", { email: email.trim(), password: pass });
    if (result.ok) {
      sessionAdmin = result.data.admin;
      this.addLog("ADMIN_LOGIN", `Admin user ${sessionAdmin?.email} logged in.`);
      notify();
    }
    return result;
  },

  async setupFirstAdmin(data: { name: string; email: string; password: string; token: string }): Promise<AuthResult> {
    const result = await authPost("setup", data);
    if (result.ok) {
      sessionAdmin = result.data.admin;
      setupState = { setupRequired: false, setupEnabled: false };
      notify();
    }
    return result;
  },

  async logout() {
    await authPost("logout", {});
    sessionAdmin = null;
    adminUsersCache = [];
    this.addLog("ADMIN_LOGOUT", "Admin session ended.");
    notify();
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResult> {
    const result = await authPost("change_password", { currentPassword, newPassword });
    if (result.ok) this.addLog("SECURITY_UPDATE", "Admin password updated successfully.");
    return result;
  },

  // Admin Users Management (server-side; passwords are never sent back to the browser)
  getAdminUsers(): AdminUser[] {
    return adminUsersCache;
  },

  async fetchAdminUsersFromDb(): Promise<AdminUser[]> {
    try {
      const res = await adminFetch(authUrl("users"));
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.users)) {
          adminUsersCache = json.users;
          notify();
        }
      }
    } catch (err) {
      console.warn("Could not fetch admin users:", err);
    }
    return adminUsersCache;
  },

  async addAdminUser(data: { name: string; email: string; password: string; role: AdminUser["role"]; status?: "Active" | "Inactive" }): Promise<AuthResult> {
    const result = await authPost("user_create", data);
    if (result.ok) {
      this.addLog("ADMIN_CREATED", `Added administrator ${data.name} (${data.email}) with role ${data.role}`);
      await this.fetchAdminUsersFromDb();
    }
    return result;
  },

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AuthResult> {
    const result = await authPost("user_update", { id, ...updates });
    if (result.ok) {
      this.addLog("ADMIN_UPDATED", `Updated administrator ${updates.name || id}`);
      await this.fetchAdminUsersFromDb();
    }
    return result;
  },

  async deleteAdminUser(id: string): Promise<AuthResult> {
    const target = adminUsersCache.find((u) => u.id === id);
    const result = await authPost("user_delete", { id });
    if (result.ok) {
      this.addLog("ADMIN_DELETED", `Removed administrator ${target ? `${target.name} (${target.email})` : id}`);
      await this.fetchAdminUsersFromDb();
    }
    return result;
  },

  // Database Status Check
  async checkDbStatus(): Promise<DbStatusInfo> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/status"), { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return {
        connected: false,
        host: "localhost",
        database: "firstcapital",
        port: 3306,
        totalLeads: 0,
        timestamp: new Date().toISOString(),
        tables: [],
        error: `Server responded with status ${res.status}`,
      };
    } catch (err: any) {
      return {
        connected: false,
        host: "localhost",
        database: "firstcapital",
        port: 3306,
        totalLeads: 0,
        timestamp: new Date().toISOString(),
        tables: [],
        error: err?.message || "Failed to reach backend API",
      };
    }
  },

  // Leads Operations (Secure In-Memory State & MySQL Sync - SEC-VULN-02)
  getLeads(): QuizLead[] {
    return inMemoryLeads;
  },

  async fetchLeadsFromDb(): Promise<QuizLead[]> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/leads"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.leads)) {
          inMemoryLeads = json.leads;
          // Ensure no customer PII is cached unencrypted in browser localStorage
          if (typeof window !== "undefined") {
            try { localStorage.removeItem(STORAGE_KEY_LEADS); } catch {}
          }
          notify();
          return inMemoryLeads;
        }
      }
    } catch (err) {
      console.warn("Could not sync leads from database API:", err);
    }
    return this.getLeads();
  },

  async saveLead(lead: Omit<QuizLead, "id" | "createdAt" | "status"> & { id?: string | undefined; status?: LeadStatus | undefined; dbId?: number | undefined }): Promise<QuizLead> {
    const leads = this.getLeads();
    const tempId = lead.id || `FC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: QuizLead = {
      id: tempId,
      dbId: lead.dbId,
      createdAt: new Date().toISOString(),
      name: lead.name || "Anonymous Investor",
      email: lead.email || "N/A",
      phone: lead.phone || "N/A",
      gender: lead.gender || "male",
      profileKey: lead.profileKey,
      profileName: lead.profileName || (PROFILES[lead.profileKey]?.name ?? "The Keep-It-Cool Investor"),
      matchedProduct: lead.matchedProduct || (PROFILES[lead.profileKey]?.productShort ?? "Money Market Fund"),
      investmentAmount: lead.investmentAmount || "Not specified",
      preferredContact: lead.preferredContact || "phone",
      status: lead.status || "NEW",
      notes: lead.notes || "",
      answers: lead.answers || {},
      source: lead.source || "Landing Page Quiz",
    };

    inMemoryLeads = [newLead, ...leads.filter((l) => l.id !== newLead.id)];
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(STORAGE_KEY_LEADS); } catch {}
    }
    this.addLog("LEAD_CREATED", `New lead received: ${newLead.name} (${newLead.profileName})`);
    notify();

    // Persist to MySQL Backend API if not already persisted with dbId
    if (!lead.dbId) {
      try {
        const res = await adminFetch(getApiUrl("api/admin/leads/create"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newLead.name,
            email: newLead.email,
            phone: newLead.phone,
            gender: newLead.gender,
            profileKey: newLead.profileKey,
            resultCode: newLead.profileKey,
            profileName: newLead.profileName,
            resultProfile: newLead.profileName,
            matchedProduct: newLead.matchedProduct,
            answers: newLead.answers,
            source: newLead.source,
            status: newLead.status,
            notes: newLead.notes,
          }),
        });
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.leadId) {
            newLead.dbId = resJson.leadId;
            newLead.id = `FC-${resJson.leadId}`;
            inMemoryLeads = inMemoryLeads.map((l) => (l.id === tempId ? { ...l, id: newLead.id, dbId: resJson.leadId } : l));
            notify();
          }
        }
      } catch (e) {
        console.warn("DB save sync error:", e);
      }
    }

    return newLead;
  },

  async updateLeadStatus(id: string, status: LeadStatus, notes?: string) {
    const leads = this.getLeads();
    const target = leads.find((item) => item.id === id);
    inMemoryLeads = leads.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status,
          notes: notes !== undefined ? notes : item.notes,
        };
      }
      return item;
    });

    if (typeof window !== "undefined") {
      try { localStorage.removeItem(STORAGE_KEY_LEADS); } catch {}
    }
    this.addLog("LEAD_UPDATED", `Lead ${id} status set to ${status}`);
    notify();

    // Persist to MySQL Backend API
    try {
      const dbId = (target as any)?.dbId;
      await adminFetch(getApiUrl("api/admin/leads/update"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, dbId, status, notes }),
      });
    } catch (e) {
      console.warn("DB update sync error:", e);
    }
  },

  async updateLead(id: string, updates: Partial<QuizLead>) {
    const leads = this.getLeads();
    const target = leads.find((item) => item.id === id);
    inMemoryLeads = leads.map((item) => (item.id === id ? { ...item, ...updates } : item));
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(STORAGE_KEY_LEADS); } catch {}
    }
    this.addLog("LEAD_UPDATED", `Lead ${id} details updated`);
    notify();

    // Persist to MySQL Backend API
    try {
      const dbId = (target as any)?.dbId;
      await adminFetch(getApiUrl("api/admin/leads/update"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, dbId, status: updates.status, notes: updates.notes }),
      });
    } catch (e) {
      console.warn("DB update sync error:", e);
    }
  },

  async deleteLead(id: string) {
    const leads = this.getLeads();
    const target = leads.find((item) => item.id === id);
    inMemoryLeads = leads.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(STORAGE_KEY_LEADS); } catch {}
    }
    this.addLog("LEAD_DELETED", `Lead ${id} removed`);
    notify();

    // Delete in MySQL Backend API
    try {
      const dbId = (target as any)?.dbId;
      await adminFetch(getApiUrl("api/admin/leads/delete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, dbId }),
      });
    } catch (e) {
      console.warn("DB delete sync error:", e);
    }
  },

  resetDemoLeads() {
    this.fetchLeadsFromDb();
    this.addLog("SYSTEM_RESET", "Leads refreshed from MySQL database");
    notify();
  },

  // Products Operations
  getProducts(): InvestmentProduct[] {
    if (typeof window === "undefined") return DEFAULT_PRODUCTS;
    const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  async fetchProductsFromDb(): Promise<InvestmentProduct[]> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings?key=investment_products"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(json.data));
          }
          notify();
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Could not fetch products from DB:", err);
    }
    return this.getProducts();
  },

  async persistProductsToDb(products: InvestmentProduct[]) {
    try {
      await adminFetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "investment_products", value: products }),
      });
    } catch (err) {
      console.warn("Could not persist products to DB:", err);
    }
  },

  updateProduct(id: string, updates: Partial<InvestmentProduct>) {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    }
    this.persistProductsToDb(updated);
    this.addLog("PRODUCT_UPDATED", `Product ${id} details modified`);
    notify();
  },

  addProduct(data: Omit<InvestmentProduct, "id">): InvestmentProduct {
    const products = this.getProducts();
    const newId = `prod-${Date.now()}`;
    const newProduct: InvestmentProduct = {
      id: newId,
      ...data,
    };
    const updated = [...products, newProduct];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    }
    this.persistProductsToDb(updated);
    this.addLog("PRODUCT_CREATED", `Added new product: ${newProduct.title}`);
    notify();
    return newProduct;
  },

  deleteProduct(id: string) {
    const products = this.getProducts();
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    }
    this.persistProductsToDb(updated);
    this.addLog("PRODUCT_DELETED", `Removed product: ${target ? target.title : id}`);
    notify();
  },

  resetDefaultProducts() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    this.persistProductsToDb(DEFAULT_PRODUCTS);
    this.addLog("PRODUCTS_RESET", "Investment products reset to defaults");
    notify();
  },

  // Settings
  getSettings(): AdminSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(settings: Partial<AdminSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    }
    this.addLog("SETTINGS_UPDATED", "Admin preferences updated");
    notify();
  },

  // Logs
  getLogs(): ActivityLog[] {
    if (typeof window === "undefined") return DEFAULT_LOGS;
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!data) return DEFAULT_LOGS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_LOGS;
    }
  },

  addLog(action: string, details: string) {
    if (typeof window === "undefined") return;
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: this.getSettings().adminEmail,
      action,
      details,
    };
    const updated = [newLog, ...logs.slice(0, 49)];
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  },

  // Export Helpers
  exportLeadsCSV(): string {
    const leads = this.getLeads();
    const headers = [
      "Lead ID",
      "Created At",
      "Name",
      "Email",
      "Phone",
      "Profile Type",
      "Profile Name",
      "Matched Product",
      "Investment Amount",
      "Preferred Contact",
      "Status",
      "Source",
      "Notes",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${l.profileKey}"`,
      `"${(l.profileName || "").replace(/"/g, '""')}"`,
      `"${(l.matchedProduct || "").replace(/"/g, '""')}"`,
      `"${(l.investmentAmount || "").replace(/"/g, '""')}"`,
      `"${l.preferredContact || ""}"`,
      `"${l.status}"`,
      `"${(l.source || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  },

  // Analytics helper
  getAnalytics() {
    const leads = this.getLeads();
    const totalLeads = leads.length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    const contactedCount = leads.filter((l) => l.status === "CONTACTED" || l.status === "IN_PROGRESS").length;
    const convertedCount = leads.filter((l) => l.status === "CONVERTED").length;
    const closedCount = leads.filter((l) => l.status === "CLOSED").length;

    // Distribution by persona
    const byPersona = {
      A: leads.filter((l) => l.profileKey === "A").length,
      B: leads.filter((l) => l.profileKey === "B").length,
      C: leads.filter((l) => l.profileKey === "C").length,
      D: leads.filter((l) => l.profileKey === "D").length,
    };

    // Conversion rate
    const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : "0.0";
    const engagementRate = totalLeads > 0 ? (((contactedCount + convertedCount) / totalLeads) * 100).toFixed(1) : "0.0";

    return {
      totalLeads,
      newCount,
      contactedCount,
      convertedCount,
      closedCount,
      conversionRate,
      engagementRate,
      byPersona,
    };
  },

  // Questions Operations (Live DB Sync + Local Fallback)
  getQuestions(): QuestionItem[] {
    if (typeof window === "undefined") return DEFAULT_QUESTIONS;
    const data = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
      return DEFAULT_QUESTIONS;
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_QUESTIONS;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  },

  async fetchQuestionsFromDb(): Promise<QuestionItem[]> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings?key=quiz_questions"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(json.data));
          }
          notify();
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Could not fetch questions from DB:", err);
    }
    return this.getQuestions();
  },

  async persistQuestionsToDb(questions: QuestionItem[]): Promise<boolean> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "quiz_questions", value: questions }),
      });
      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn("Could not persist questions to DB:", err);
    }
    return false;
  },

  async saveQuestion(question: QuestionItem): Promise<boolean> {
    const list = this.getQuestions();
    const updated = list.map((q) => (q.id === question.id ? question : q));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    }
    this.addLog("QUESTION_UPDATED", `Updated Question #${question.id}: "${question.question.slice(0, 45)}..."`);
    notify();
    return await this.persistQuestionsToDb(updated);
  },

  async addQuestion(data: { question: string; options: QuestionOption[] }): Promise<QuestionItem> {
    const list = this.getQuestions();
    const maxId = list.reduce((max, q) => Math.max(max, q.id), 0);
    const newQuestion: QuestionItem = {
      id: maxId + 1,
      question: data.question,
      options: data.options,
    };
    const updated = [...list, newQuestion];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    }
    this.addLog("QUESTION_CREATED", `Added new Question #${newQuestion.id}: "${newQuestion.question.slice(0, 45)}..."`);
    notify();
    await this.persistQuestionsToDb(updated);
    return newQuestion;
  },

  async deleteQuestion(id: number): Promise<boolean> {
    const list = this.getQuestions();
    const target = list.find((q) => q.id === id);
    const updated = list.filter((q) => q.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    }
    this.addLog("QUESTION_DELETED", `Deleted Question #${id}${target ? `: "${target.question.slice(0, 30)}..."` : ""}`);
    notify();
    return await this.persistQuestionsToDb(updated);
  },

  async resetDefaultQuestions(): Promise<boolean> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
    }
    this.addLog("QUESTIONS_RESET", "Quiz questions reset to default standard set");
    notify();
    return await this.persistQuestionsToDb(DEFAULT_QUESTIONS);
  },

  // Testimonials Operations (Live DB sync + Local Fallback)
  getTestimonials(): TestimonialItem[] {
    if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;
    const data = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  },

  async fetchTestimonialsFromDb(): Promise<TestimonialItem[]> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings?key=testimonials"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(json.data));
          }
          notify();
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Could not fetch testimonials from DB:", err);
    }
    return this.getTestimonials();
  },

  async persistTestimonialsToDb(testimonials: TestimonialItem[]): Promise<boolean> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "testimonials", value: testimonials }),
      });
      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn("Could not persist testimonials to DB:", err);
    }
    return false;
  },

  async addTestimonial(data: Omit<TestimonialItem, "id">): Promise<TestimonialItem> {
    const list = this.getTestimonials();
    const newId = `test-${Date.now()}`;
    const newTestimonial: TestimonialItem = {
      id: newId,
      name: data.name,
      role: data.role,
      quote: data.quote,
      rating: data.rating ?? 5,
      status: data.status || "Active",
      createdAt: new Date().toISOString(),
    };
    const updated = [newTestimonial, ...list];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
    }
    this.addLog("TESTIMONIAL_CREATED", `Added testimonial from ${newTestimonial.name} (${newTestimonial.role})`);
    notify();
    await this.persistTestimonialsToDb(updated);
    return newTestimonial;
  },

  async updateTestimonial(id: string, updates: Partial<TestimonialItem>): Promise<boolean> {
    const list = this.getTestimonials();
    const updated = list.map((t) => (t.id === id ? { ...t, ...updates } : t));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
    }
    const target = updated.find((t) => t.id === id);
    this.addLog("TESTIMONIAL_UPDATED", `Updated testimonial for ${target ? target.name : id}`);
    notify();
    return await this.persistTestimonialsToDb(updated);
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const list = this.getTestimonials();
    const target = list.find((t) => t.id === id);
    const updated = list.filter((t) => t.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
    }
    this.addLog("TESTIMONIAL_DELETED", `Removed testimonial from ${target ? target.name : id}`);
    notify();
    return await this.persistTestimonialsToDb(updated);
  },

  async resetDefaultTestimonials(): Promise<boolean> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    this.addLog("TESTIMONIALS_RESET", "Testimonials reset to default client quotes");
    notify();
    return await this.persistTestimonialsToDb(DEFAULT_TESTIMONIALS);
  },

  // Quiz Results / Personalities Operations (Live DB Sync + Local Fallback)
  getQuizResults(): Record<ProfileKey, ProfileInfo> {
    if (typeof window === "undefined") return PROFILES;
    const data = localStorage.getItem(STORAGE_KEY_QUIZ_RESULTS);
    if (!data) return PROFILES;
    try {
      const parsed = JSON.parse(data);
      return mergeWithDefaultProfiles(parsed);
    } catch {
      return PROFILES;
    }
  },

  async fetchQuizResultsFromDb(): Promise<Record<ProfileKey, ProfileInfo>> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings?key=quiz_results"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && typeof json.data === "object") {
          const merged = mergeWithDefaultProfiles(json.data);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(merged));
          }
          notify();
          return merged;
        }
      }
    } catch (err) {
      console.warn("Could not fetch quiz results from DB:", err);
    }
    return this.getQuizResults();
  },

  async persistQuizResultsToDb(results: Record<ProfileKey, ProfileInfo>): Promise<boolean> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "quiz_results", value: results }),
      });
      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn("Could not persist quiz results to DB:", err);
    }
    return false;
  },

  async updateQuizResult(key: ProfileKey, updates: Partial<ProfileInfo>): Promise<boolean> {
    const current = this.getQuizResults();
    const updated: Record<ProfileKey, ProfileInfo> = {
      ...current,
      [key]: {
        ...current[key],
        ...updates,
      },
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(updated));
    }
    this.addLog("QUIZ_RESULT_UPDATED", `Updated Quiz Result profile [${key}]: ${updates.name || current[key].name}`);
    notify();
    return await this.persistQuizResultsToDb(updated);
  },

  async resetDefaultQuizResults(): Promise<boolean> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(PROFILES));
    }
    this.addLog("QUIZ_RESULTS_RESET", "Quiz personality results reset to default standard profiles");
    notify();
    return await this.persistQuizResultsToDb(PROFILES);
  },

  // Why First Capital Reasons Operations (Live DB Sync + Local Fallback)
  getWhyReasons(): WhyReasonItem[] {
    if (typeof window === "undefined") return DEFAULT_WHY_REASONS;
    const data = localStorage.getItem(STORAGE_KEY_WHY_REASONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(DEFAULT_WHY_REASONS));
      return DEFAULT_WHY_REASONS;
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, index) => ({
          ...item,
          visible: item.visible !== false,
          order: typeof item.order === "number" ? item.order : index + 1,
        }));
      }
      return DEFAULT_WHY_REASONS;
    } catch {
      return DEFAULT_WHY_REASONS;
    }
  },

  async fetchWhyReasonsFromDb(): Promise<WhyReasonItem[]> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings?key=why_first_capital"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map((item: any, index: number) => ({
            ...item,
            visible: item.visible !== false,
            order: typeof item.order === "number" ? item.order : index + 1,
          }));
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(normalized));
          }
          notify();
          return normalized;
        }
      }
    } catch (err) {
      console.warn("Could not fetch why reasons from DB:", err);
    }
    return this.getWhyReasons();
  },

  async persistWhyReasonsToDb(reasons: WhyReasonItem[]): Promise<boolean> {
    try {
      const res = await adminFetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "why_first_capital", value: reasons }),
      });
      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn("Could not persist why reasons to DB:", err);
    }
    return false;
  },

  async saveWhyReason(reason: WhyReasonItem): Promise<boolean> {
    const list = this.getWhyReasons();
    const cleanReason: WhyReasonItem = {
      ...reason,
      visible: reason.visible !== false && (reason.visible as any) !== "false" && (reason.visible as any) !== 0 && (reason.visible as any) !== "0",
    };
    const exists = list.some((r) => r.id === reason.id);
    const updated = exists ? list.map((r) => (r.id === reason.id ? cleanReason : r)) : [...list, cleanReason];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(updated));
    }
    this.addLog("REASON_UPDATED", `Updated Why First Capital card: "${cleanReason.title}" (Visible: ${cleanReason.visible ? "Yes" : "No"})`);
    notify();
    return await this.persistWhyReasonsToDb(updated);
  },

  async toggleWhyReasonVisibility(id: string): Promise<boolean> {
    const list = this.getWhyReasons();
    const target = list.find((r) => r.id === id);
    if (!target) return false;
    const isCurrentlyVis = target.visible !== false && (target.visible as any) !== "false" && (target.visible as any) !== 0 && (target.visible as any) !== "0";
    const newVisible = !isCurrentlyVis;
    const updated = list.map((r) => (r.id === id ? { ...r, visible: newVisible } : r));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(updated));
    }
    this.addLog("REASON_VISIBILITY", `${newVisible ? "Showed" : "Hid"} Why First Capital card: "${target.title}"`);
    notify();
    return await this.persistWhyReasonsToDb(updated);
  },

  async addWhyReason(data: Omit<WhyReasonItem, "id" | "order">): Promise<WhyReasonItem> {
    const list = this.getWhyReasons();
    const newReason: WhyReasonItem = {
      id: `reason-${Date.now()}`,
      order: list.length + 1,
      ...data,
      visible: data.visible !== false,
    };
    const updated = [...list, newReason];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(updated));
    }
    this.addLog("REASON_CREATED", `Added new Why First Capital card: "${newReason.title}"`);
    notify();
    await this.persistWhyReasonsToDb(updated);
    return newReason;
  },

  async deleteWhyReason(id: string): Promise<boolean> {
    const list = this.getWhyReasons();
    const target = list.find((r) => r.id === id);
    const updated = list.filter((r) => r.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(updated));
    }
    this.addLog("REASON_DELETED", `Removed Why First Capital card: "${target ? target.title : id}"`);
    notify();
    return await this.persistWhyReasonsToDb(updated);
  },

  async resetDefaultWhyReasons(): Promise<boolean> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WHY_REASONS, JSON.stringify(DEFAULT_WHY_REASONS));
    }
    this.addLog("REASONS_RESET", "Why First Capital reasons reset to default 8 cards");
    notify();
    return await this.persistWhyReasonsToDb(DEFAULT_WHY_REASONS);
  },
};

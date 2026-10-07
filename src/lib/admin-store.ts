import { ProfileKey, PROFILES } from "@/components/quiz/QuizFlow";
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

const STORAGE_KEY_AUTH = "fc_admin_auth";
const STORAGE_KEY_CURRENT_ADMIN = "fc_admin_current_user";
const STORAGE_KEY_ADMIN_USERS = "fc_admin_users";
const STORAGE_KEY_LEADS = "fc_admin_leads";
const STORAGE_KEY_PRODUCTS = "fc_admin_products";
const STORAGE_KEY_SETTINGS = "fc_admin_settings";
const STORAGE_KEY_LOGS = "fc_admin_logs";
const STORAGE_KEY_QUESTIONS = "fc_admin_questions";
const STORAGE_KEY_TESTIMONIALS = "fc_admin_testimonials";

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1",
    name: "Executive Administrator",
    email: "admin@firstcapital.lk",
    password: "admin123",
    role: "Super Admin",
    status: "Active",
    createdAt: "2026-01-15T09:00:00.000Z",
  },
];

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
}

export const AdminStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Auth Operations
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY_AUTH) === "true";
  },

  getCurrentAdmin(): AdminUser | null {
    if (typeof window === "undefined") return null;
    const email = localStorage.getItem(STORAGE_KEY_CURRENT_ADMIN);
    const users = this.getAdminUsers();
    if (email) {
      const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) return match;
    }
    return users[0] || null;
  },

  login(email: string, pass: string): boolean {
    if (typeof window === "undefined") return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const settings = this.getSettings();
    const storedMasterPass = localStorage.getItem("fc_admin_pwd") || "admin123";

    const users = this.getAdminUsers();
    const matchedUser = users.find(
      (u) => u.status === "Active" && u.email.toLowerCase() === cleanEmail && (u.password === cleanPass || (!u.password && cleanPass === storedMasterPass))
    );

    const isMasterFallback =
      (cleanEmail === settings.adminEmail.toLowerCase() || cleanEmail === "admin@firstcapital.lk" || cleanEmail === "admin") &&
      (cleanPass === storedMasterPass || cleanPass === "admin123" || cleanPass === "admin");

    if (matchedUser || isMasterFallback) {
      localStorage.setItem(STORAGE_KEY_AUTH, "true");
      const loggedEmail = matchedUser ? matchedUser.email : cleanEmail;
      localStorage.setItem(STORAGE_KEY_CURRENT_ADMIN, loggedEmail);

      if (matchedUser) {
        this.updateAdminUser(matchedUser.id, { lastLogin: new Date().toISOString() });
      }

      this.addLog("ADMIN_LOGIN", `Admin user ${loggedEmail} logged in successfully.`);
      notify();
      return true;
    }
    return false;
  },

  logout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_CURRENT_ADMIN);
    this.addLog("ADMIN_LOGOUT", "Admin session ended.");
    notify();
  },

  updatePassword(newPass: string, adminId?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("fc_admin_pwd", newPass);
    if (adminId) {
      this.updateAdminUser(adminId, { password: newPass });
    }
    this.addLog("SECURITY_UPDATE", "Admin password updated successfully.");
    notify();
  },

  // Admin Users Management (Live DB sync + Local Storage)
  getAdminUsers(): AdminUser[] {
    if (typeof window === "undefined") return DEFAULT_ADMIN_USERS;
    const data = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  },

  async fetchAdminUsersFromDb(): Promise<AdminUser[]> {
    try {
      const res = await fetch(getApiUrl("api/admin/settings?key=admin_users"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(json.data));
          }
          notify();
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Could not fetch admin users from DB:", err);
    }
    return this.getAdminUsers();
  },

  async persistAdminUsersToDb(users: AdminUser[]) {
    try {
      await fetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "admin_users", value: users }),
      });
    } catch (err) {
      console.warn("Could not persist admin users to DB:", err);
    }
  },

  addAdminUser(data: { name: string; email: string; password?: string; role: AdminUser["role"]; status?: "Active" | "Inactive" }): AdminUser {
    const list = this.getAdminUsers();
    const newId = `admin-${Date.now()}`;
    const newAdmin: AdminUser = {
      id: newId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password || "admin123",
      role: data.role || "Manager",
      status: data.status || "Active",
      createdAt: new Date().toISOString(),
    };
    const updated = [...list, newAdmin];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updated));
    }
    this.persistAdminUsersToDb(updated);
    this.addLog("ADMIN_CREATED", `Added administrator ${newAdmin.name} (${newAdmin.email}) with role ${newAdmin.role}`);
    notify();
    return newAdmin;
  },

  updateAdminUser(id: string, updates: Partial<AdminUser>) {
    const list = this.getAdminUsers();
    const updated = list.map((u) => (u.id === id ? { ...u, ...updates } : u));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updated));
    }
    this.persistAdminUsersToDb(updated);
    const target = updated.find((u) => u.id === id);
    this.addLog("ADMIN_UPDATED", `Updated administrator ${target ? target.name : id}`);
    notify();
  },

  deleteAdminUser(id: string): boolean {
    const list = this.getAdminUsers();
    const target = list.find((u) => u.id === id);
    if (!target) return false;

    // Check if this is the only active super admin
    const activeSuperAdmins = list.filter((u) => u.role === "Super Admin" && u.status === "Active" && u.id !== id);
    if (target.role === "Super Admin" && activeSuperAdmins.length === 0) {
      alert("Cannot delete the only active Super Admin account.");
      return false;
    }

    const updated = list.filter((u) => u.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(updated));
    }
    this.persistAdminUsersToDb(updated);
    this.addLog("ADMIN_DELETED", `Removed administrator ${target.name} (${target.email})`);
    notify();
    return true;
  },

  // Database Status Check
  async checkDbStatus(): Promise<DbStatusInfo> {
    try {
      const res = await fetch(getApiUrl("api/admin/status"), { method: "GET" });
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

  // Leads Operations (Live DB sync + Local Fallback)
  getLeads(): QuizLead[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY_LEADS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async fetchLeadsFromDb(): Promise<QuizLead[]> {
    try {
      const res = await fetch(getApiUrl("api/admin/leads"), { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.leads)) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(json.leads));
          }
          notify();
          return json.leads;
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

    const updated = [newLead, ...leads.filter((l) => l.id !== newLead.id)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    }
    this.addLog("LEAD_CREATED", `New lead received: ${newLead.name} (${newLead.profileName})`);
    notify();

    // Persist to MySQL Backend API if not already persisted with dbId
    if (!lead.dbId) {
      try {
        const res = await fetch(getApiUrl("api/admin/leads/create"), {
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
            const currentLeads = this.getLeads();
            const reUpdated = currentLeads.map((l) => (l.id === tempId ? { ...l, id: newLead.id, dbId: resJson.leadId } : l));
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(reUpdated));
            }
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
    const updated = leads.map((item) => {
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
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    }
    this.addLog("LEAD_UPDATED", `Lead ${id} status set to ${status}`);
    notify();

    // Persist to MySQL Backend API
    try {
      await fetch(getApiUrl("api/admin/leads/update"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes }),
      });
    } catch (e) {
      console.warn("DB update sync error:", e);
    }
  },

  async updateLead(id: string, updates: Partial<QuizLead>) {
    const leads = this.getLeads();
    const updated = leads.map((item) => (item.id === id ? { ...item, ...updates } : item));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    }
    this.addLog("LEAD_UPDATED", `Lead ${id} details updated`);
    notify();

    // Persist to MySQL Backend API
    try {
      await fetch(getApiUrl("api/admin/leads/update"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: updates.status, notes: updates.notes }),
      });
    } catch (e) {
      console.warn("DB update sync error:", e);
    }
  },

  async deleteLead(id: string) {
    const leads = this.getLeads();
    const updated = leads.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    }
    this.addLog("LEAD_DELETED", `Lead ${id} removed`);
    notify();

    // Delete in MySQL Backend API
    try {
      await fetch(getApiUrl("api/admin/leads/delete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
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
      const res = await fetch(getApiUrl("api/admin/settings?key=investment_products"), { method: "GET" });
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
      await fetch(getApiUrl("api/admin/settings"), {
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
      const res = await fetch(getApiUrl("api/admin/settings?key=quiz_questions"), { method: "GET" });
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

  async persistQuestionsToDb(questions: QuestionItem[]) {
    try {
      await fetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "quiz_questions", value: questions }),
      });
    } catch (err) {
      console.warn("Could not persist questions to DB:", err);
    }
  },

  saveQuestion(question: QuestionItem) {
    const list = this.getQuestions();
    const updated = list.map((q) => (q.id === question.id ? question : q));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    }
    this.persistQuestionsToDb(updated);
    this.addLog("QUESTION_UPDATED", `Updated Question #${question.id}: "${question.question.slice(0, 45)}..."`);
    notify();
  },

  addQuestion(data: { question: string; options: QuestionOption[] }): QuestionItem {
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
    this.persistQuestionsToDb(updated);
    this.addLog("QUESTION_CREATED", `Added new Question #${newQuestion.id}: "${newQuestion.question.slice(0, 45)}..."`);
    notify();
    return newQuestion;
  },

  deleteQuestion(id: number) {
    const list = this.getQuestions();
    const target = list.find((q) => q.id === id);
    const updated = list.filter((q) => q.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    }
    this.persistQuestionsToDb(updated);
    this.addLog("QUESTION_DELETED", `Deleted Question #${id}${target ? `: "${target.question.slice(0, 30)}..."` : ""}`);
    notify();
  },

  resetDefaultQuestions() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
    }
    this.persistQuestionsToDb(DEFAULT_QUESTIONS);
    this.addLog("QUESTIONS_RESET", "Quiz questions reset to default standard set");
    notify();
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
      const res = await fetch(getApiUrl("api/admin/settings?key=testimonials"), { method: "GET" });
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

  async persistTestimonialsToDb(testimonials: TestimonialItem[]) {
    try {
      await fetch(getApiUrl("api/admin/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "testimonials", value: testimonials }),
      });
    } catch (err) {
      console.warn("Could not persist testimonials to DB:", err);
    }
  },

  addTestimonial(data: Omit<TestimonialItem, "id">): TestimonialItem {
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
    this.persistTestimonialsToDb(updated);
    this.addLog("TESTIMONIAL_CREATED", `Added testimonial from ${newTestimonial.name} (${newTestimonial.role})`);
    notify();
    return newTestimonial;
  },

  updateTestimonial(id: string, updates: Partial<TestimonialItem>) {
    const list = this.getTestimonials();
    const updated = list.map((t) => (t.id === id ? { ...t, ...updates } : t));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
    }
    this.persistTestimonialsToDb(updated);
    const target = updated.find((t) => t.id === id);
    this.addLog("TESTIMONIAL_UPDATED", `Updated testimonial for ${target ? target.name : id}`);
    notify();
  },

  deleteTestimonial(id: string) {
    const list = this.getTestimonials();
    const target = list.find((t) => t.id === id);
    const updated = list.filter((t) => t.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(updated));
    }
    this.persistTestimonialsToDb(updated);
    this.addLog("TESTIMONIAL_DELETED", `Removed testimonial from ${target ? target.name : id}`);
    notify();
  },

  resetDefaultTestimonials() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    this.persistTestimonialsToDb(DEFAULT_TESTIMONIALS);
    this.addLog("TESTIMONIALS_RESET", "Testimonials reset to default client quotes");
    notify();
  },
};

import React, { useState, useEffect } from "react";
import {
  AdminStore,
  QuizLead,
  LeadStatus,
  InvestmentProduct,
  ActivityLog,
  AdminSettings,
  QuestionItem,
  QuestionOption,
  DbStatusInfo,
  TestimonialItem,
  AdminUser,
} from "@/lib/admin-store";
import { PROFILES, ProfileKey } from "@/components/quiz/QuizFlow";
import logoAsset from "@/assets/first-capital-logo.png.asset.json";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HelpCircle,
  Settings,
  LogOut,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  RefreshCw,
  RotateCcw,
  FileSpreadsheet,
  Check,
  X,
  FileText,
  Lock,
  Database,
  Server,
  Activity,
  Quote,
  Star,
  UserPlus,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = "leads" | "products" | "quiz" | "testimonials" | "settings";

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("leads");
  const [leads, setLeads] = useState<QuizLead[]>([]);
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(AdminStore.getSettings());
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Filters for Leads view
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfile, setFilterProfile] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<QuizLead | null>(null);
  const [editNotes, setEditNotes] = useState("");

  // Product edit and add modals
  const [editingProduct, setEditingProduct] = useState<InvestmentProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    shortTitle: "",
    assetClass: "Unit Trust Fund",
    riskLevel: "Moderate" as "Low" | "Moderate" | "High",
    minInvestment: "LKR 1,000",
    expectedReturn: "Variable Yield",
    description: "",
    disclaimer: "",
    status: "Active" as "Active" | "Under Review",
  });

  // Question edit and add modals
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState<QuestionOption[]>([
    { key: "A", label: "A", text: "" },
    { key: "B", label: "B", text: "" },
    { key: "C", label: "C", text: "" },
    { key: "D", label: "D", text: "" },
  ]);

  // Testimonial edit and add modals
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);
  const [filterTestimonialSearch, setFilterTestimonialSearch] = useState("");
  const [filterTestimonialStatus, setFilterTestimonialStatus] = useState<string>("ALL");
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
    status: "Active" as "Active" | "Draft" | "Archived",
  });

  // Manual Lead creation modal
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadProfile, setNewLeadProfile] = useState<ProfileKey>("A");
  const [newLeadAmount, setNewLeadAmount] = useState("");
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>("NEW");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Settings form states
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Admin users management states
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(AdminStore.getAdminUsers());
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminUser["role"]>("Manager");
  const [newAdminStatus, setNewAdminStatus] = useState<"Active" | "Inactive">("Active");
  const [editAdminPassword, setEditAdminPassword] = useState("");

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Database Connection State
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state on change
  const refreshData = () => {
    setLeads(AdminStore.getLeads());
    setProducts(AdminStore.getProducts());
    setLogs(AdminStore.getLogs());
    setSettings(AdminStore.getSettings());
    setQuestions(AdminStore.getQuestions());
    setTestimonials(AdminStore.getTestimonials());
    setAdminUsers(AdminStore.getAdminUsers());
  };

  const syncDatabase = async (manual = false) => {
    setIsSyncing(true);
    try {
      const status = await AdminStore.checkDbStatus();
      setDbStatus(status);
      if (status.connected) {
        await AdminStore.fetchLeadsFromDb();
        await AdminStore.fetchQuestionsFromDb();
        await AdminStore.fetchProductsFromDb();
        await AdminStore.fetchTestimonialsFromDb();
        await AdminStore.fetchAdminUsersFromDb();
        if (manual) {
          showToast(`MySQL DB Connected: ${status.database} @ ${status.host} (${status.totalLeads} leads loaded)`);
        }
      } else if (manual) {
        showToast(status.error ? `DB Offline: ${status.error}` : "MySQL DB offline - operating with local fallback");
      }
    } catch {
      if (manual) showToast("Could not contact server API");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshData();
    syncDatabase(false);
    const unsubscribe = AdminStore.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, []);

  const analytics = AdminStore.getAnalytics();

  // Filtered Leads list
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      searchTerm === "" ||
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.matchedProduct.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProfile = filterProfile === "ALL" || l.profileKey === filterProfile;
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus;

    return matchesSearch && matchesProfile && matchesStatus;
  });

  const handleExportCSV = () => {
    const csvContent = AdminStore.exportLeadsCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `first_capital_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Leads successfully exported to CSV!");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `first_capital_leads_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Leads exported to JSON!");
  };

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    AdminStore.updateLeadStatus(id, newStatus);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Lead status updated to ${newStatus}`);
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    AdminStore.updateLead(selectedLead.id, { notes: editNotes });
    setSelectedLead((prev) => (prev ? { ...prev, notes: editNotes } : null));
    showToast("Advisor notes saved!");
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      AdminStore.deleteLead(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
      showToast("Lead removed from database.");
    }
  };

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    await AdminStore.saveLead({
      name: newLeadName,
      email: newLeadEmail || "N/A",
      phone: newLeadPhone || "N/A",
      profileKey: newLeadProfile,
      profileName: PROFILES[newLeadProfile].name,
      matchedProduct: PROFILES[newLeadProfile].productShort,
      investmentAmount: newLeadAmount || "Not specified",
      status: newLeadStatus,
      notes: newLeadNotes,
      source: "Admin Manual Entry",
      answers: { 1: newLeadProfile, 2: newLeadProfile, 3: newLeadProfile, 4: newLeadProfile, 5: newLeadProfile, 6: newLeadProfile, 7: newLeadProfile },
    });

    setIsAddLeadOpen(false);
    setNewLeadName("");
    setNewLeadEmail("");
    setNewLeadPhone("");
    setNewLeadAmount("");
    setNewLeadNotes("");
    showToast("Manual lead added successfully!");
    refreshData();
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    AdminStore.updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    showToast("Product configuration updated!");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title.trim()) {
      alert("Please enter a product title.");
      return;
    }

    const created = AdminStore.addProduct({
      title: newProduct.title.trim(),
      shortTitle: newProduct.shortTitle.trim() || newProduct.title.trim(),
      assetClass: newProduct.assetClass.trim() || "Unit Trust Fund",
      riskLevel: newProduct.riskLevel,
      minInvestment: newProduct.minInvestment.trim() || "LKR 1,000",
      expectedReturn: newProduct.expectedReturn.trim() || "Variable Yield",
      description: newProduct.description.trim(),
      disclaimer: newProduct.disclaimer.trim() || "Terms and conditions apply.",
      status: newProduct.status,
    });

    setIsAddProductOpen(false);
    setNewProduct({
      title: "",
      shortTitle: "",
      assetClass: "Unit Trust Fund",
      riskLevel: "Moderate",
      minInvestment: "LKR 1,000",
      expectedReturn: "Variable Yield",
      description: "",
      disclaimer: "",
      status: "Active",
    });
    showToast(`New Product "${created.shortTitle}" added successfully!`);
  };

  const handleDeleteProduct = (id: string) => {
    if (products.length <= 1) {
      alert("You must keep at least 1 investment product.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this investment product?")) {
      AdminStore.deleteProduct(id);
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
      showToast("Product removed from catalog.");
    }
  };

  const handleResetProducts = () => {
    if (window.confirm("Reset all investment products back to standard First Capital funds?")) {
      AdminStore.resetDefaultProducts();
      showToast("Default products restored!");
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.question.trim()) return;
    const hasEmptyOption = editingQuestion.options.some((o) => !o.text.trim());
    if (hasEmptyOption) {
      alert("Please ensure all 4 options have answer text.");
      return;
    }
    AdminStore.saveQuestion(editingQuestion);
    setEditingQuestion(null);
    showToast(`Question #${editingQuestion.id} updated successfully!`);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      alert("Please enter the question text.");
      return;
    }
    const hasEmpty = newQuestionOptions.some((o) => !o.text.trim());
    if (hasEmpty) {
      alert("Please fill in text for all 4 options (A, B, C, D).");
      return;
    }

    const created = AdminStore.addQuestion({
      question: newQuestionText.trim(),
      options: newQuestionOptions.map((o) => ({
        ...o,
        text: o.text.trim(),
      })),
    });

    setIsAddQuestionOpen(false);
    setNewQuestionText("");
    setNewQuestionOptions([
      { key: "A", label: "A", text: "" },
      { key: "B", label: "B", text: "" },
      { key: "C", label: "C", text: "" },
      { key: "D", label: "D", text: "" },
    ]);
    showToast(`New Question #${created.id} added!`);
  };

  const handleDeleteQuestion = (id: number) => {
    if (questions.length <= 1) {
      alert("You must keep at least 1 question for the quiz flow.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete Question #${id}?`)) {
      AdminStore.deleteQuestion(id);
      if (editingQuestion?.id === id) {
        setEditingQuestion(null);
      }
      showToast(`Question #${id} removed.`);
    }
  };

  const handleResetQuestions = () => {
    if (window.confirm("Reset all quiz questions back to the standard 7 campaign questions?")) {
      AdminStore.resetDefaultQuestions();
      showToast("Default quiz questions restored!");
    }
  };

  // Testimonial Handlers
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name.trim()) {
      alert("Please enter the client's name.");
      return;
    }
    if (!newTestimonial.quote.trim()) {
      alert("Please enter the testimonial quote.");
      return;
    }

    const created = AdminStore.addTestimonial({
      name: newTestimonial.name.trim(),
      role: newTestimonial.role.trim() || "Investor",
      quote: newTestimonial.quote.trim(),
      rating: Number(newTestimonial.rating) || 5,
      status: newTestimonial.status,
    });

    setIsAddTestimonialOpen(false);
    setNewTestimonial({
      name: "",
      role: "",
      quote: "",
      rating: 5,
      status: "Active",
    });
    showToast(`Testimonial from "${created.name}" added successfully!`);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name.trim() || !editingTestimonial.quote.trim()) {
      alert("Please fill in both name and quote.");
      return;
    }

    AdminStore.updateTestimonial(editingTestimonial.id, {
      name: editingTestimonial.name.trim(),
      role: editingTestimonial.role.trim() || "Investor",
      quote: editingTestimonial.quote.trim(),
      rating: Number(editingTestimonial.rating) || 5,
      status: editingTestimonial.status,
    });

    setEditingTestimonial(null);
    showToast(`Testimonial for "${editingTestimonial.name}" updated!`);
  };

  const handleDeleteTestimonial = (id: string) => {
    const target = testimonials.find((t) => t.id === id);
    if (window.confirm(`Are you sure you want to delete the testimonial from "${target?.name || id}"?`)) {
      AdminStore.deleteTestimonial(id);
      if (editingTestimonial?.id === id) {
        setEditingTestimonial(null);
      }
      showToast("Testimonial removed.");
    }
  };

  const handleToggleTestimonialStatus = (t: TestimonialItem) => {
    const nextStatus = t.status === "Active" ? "Draft" : "Active";
    AdminStore.updateTestimonial(t.id, { status: nextStatus });
    showToast(`Testimonial by ${t.name} set to ${nextStatus}`);
  };

  const handleResetTestimonials = () => {
    if (window.confirm("Reset testimonials back to the default 4 investor quotes?")) {
      AdminStore.resetDefaultTestimonials();
      showToast("Default testimonials restored!");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    AdminStore.updateSettings(settings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
    showToast("Settings saved successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }
    AdminStore.updatePassword(newPassword);
    setNewPassword("");
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
    showToast("Admin password changed!");
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    const existing = AdminStore.getAdminUsers().find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      alert("An administrator account with this email already exists.");
      return;
    }
    AdminStore.addAdminUser({
      name: newAdminName.trim(),
      email: cleanEmail,
      password: newAdminPassword.trim(),
      role: newAdminRole,
      status: newAdminStatus,
    });
    setIsAddAdminOpen(false);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPassword("");
    setNewAdminRole("Manager");
    setNewAdminStatus("Active");
    showToast(`Administrator account for ${newAdminName} created successfully!`);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    const updates: Partial<AdminUser> = {
      name: editingAdmin.name,
      role: editingAdmin.role,
      status: editingAdmin.status,
    };
    if (editAdminPassword && editAdminPassword.trim().length >= 4) {
      updates.password = editAdminPassword.trim();
    }
    AdminStore.updateAdminUser(editingAdmin.id, updates);
    setEditingAdmin(null);
    setEditAdminPassword("");
    showToast(`Administrator ${editingAdmin.name} updated successfully!`);
  };

  const handleDeleteAdmin = (id: string) => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to remove administrator ${target.name} (${target.email})?`)) {
      const ok = AdminStore.deleteAdminUser(id);
      if (ok) {
        showToast(`Administrator ${target.name} removed.`);
        if (editingAdmin?.id === id) setEditingAdmin(null);
      }
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm("Reset all leads to the initial demo dataset?")) {
      AdminStore.resetDemoLeads();
      showToast("Demo data reloaded!");
    }
  };

  const statusBadge = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">New Lead</span>;
      case "CONTACTED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Contacted</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">In Discussion</span>;
      case "CONVERTED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Converted</span>;
      case "CLOSED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
    }
  };

  const profileBadge = (key: ProfileKey) => {
    const prof = PROFILES[key] || PROFILES.A;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap shadow-2xs ${prof.badgeBg}`}
      >
        {prof.name}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142d27] text-[#f1c91e] px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 font-bold text-sm">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="../" target="_blank" rel="noreferrer" className="flex items-center group" title="Open Public Site">
              <img
                src={logoAsset.url}
                alt="First Capital — A Janashakthi Group Company"
                className="h-8 sm:h-9 w-auto"
                width="1698"
                height="432"
              />
            </a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="../"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              Public Website <ExternalLink className="size-3.5" />
            </a>

            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#142d27] bg-[#f1c91e] hover:bg-[#e0b815] px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Download className="size-3.5" /> Export Leads
            </button>

            <button
              type="button"
              onClick={() => {
                AdminStore.logout();
                onLogout();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm sticky top-24">
            <div className="p-3 border-b border-slate-100 mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-extrabold text-[#142d27] truncate mt-0.5">{settings.adminEmail}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`size-2 rounded-full ${dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className={`text-[11px] font-semibold ${dbStatus?.connected ? "text-emerald-700" : "text-amber-700"}`}>
                  {dbStatus?.connected ? "MySQL Database Connected" : "Local Storage Mode"}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("leads")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-[#142d27] text-[#f1c91e] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="size-4" />
                  <span>Leads & Submissions</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    activeTab === "leads"
                      ? "bg-[#f1c91e] text-[#142d27]"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {leads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "products"
                    ? "bg-[#142d27] text-[#f1c91e] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="size-4" />
                  <span>Investment Products</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{products.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-[#142d27] text-[#f1c91e] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="size-4" />
                  <span>Quiz Configuration</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{questions.length} Qs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("testimonials")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "testimonials"
                    ? "bg-[#142d27] text-[#f1c91e] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Quote className="size-4" />
                  <span>Testimonials</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{testimonials.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#142d27] text-[#f1c91e] shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="size-4" />
                  <span>Settings & Logs</span>
                </div>
              </button>
            </nav>

            {/* Quick Quick-Action in Sidebar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddLeadOpen(true)}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#142d27] border border-emerald-200/80 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="size-4 text-emerald-700" /> Add Manual Lead
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* LEADS MANAGEMENT */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header + Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#142d27]">Investor Leads & Quiz Submissions</h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage and follow up on client quiz answers and consultation inquiries
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={refreshData}
                    className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Refresh Data"
                  >
                    <RefreshCw className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="size-4 text-emerald-700" /> Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddLeadOpen(true)}
                    className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-4" /> New Lead
                  </button>
                </div>
              </div>

              {/* Database Connection & Sync Status Banner */}
              <div
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  dbStatus?.connected
                    ? "bg-gradient-to-r from-emerald-950 to-[#142d27] text-white border-emerald-800/80 shadow-md"
                    : "bg-gradient-to-r from-amber-950 to-slate-900 text-white border-amber-800/80 shadow-md"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      dbStatus?.connected
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <Database className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        {dbStatus?.connected ? "Database Connected" : "Local Storage Mode"}
                      </span>
                      <span
                        className={`size-2 rounded-full ${
                          dbStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {dbStatus?.connected ? (
                        <>
                          MySQL Server: <code className="text-[#f1c91e] font-mono text-xs">{dbStatus.database}</code> on{" "}
                          <code className="text-slate-300 font-mono text-xs">{dbStatus.host}:{dbStatus.port}</code>
                        </>
                      ) : (
                        <>Local Offline Cache (MySQL connection pending)</>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {dbStatus?.connected
                        ? `Live database sync active. Total records in DB: ${dbStatus.totalLeads} | Tables: ${dbStatus.tables?.join(", ") || "quiz_leads, app_settings"}`
                        : dbStatus?.error || "Running in-memory/browser persistence. Will auto-sync when MySQL is available."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => syncDatabase(true)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing..." : "Sync Database Now"}
                  </button>
                </div>
              </div>

              {/* Total Leads Stat Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#142d27]">
                    <Users className="size-6 text-[#142d27]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Leads</span>
                    <div className="text-3xl font-black text-[#142d27] leading-none mt-1">
                      {analytics.totalLeads}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-amber-700" />
                    <strong>{analytics.newCount}</strong> New
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/60 flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-purple-700" />
                    <strong>{analytics.contactedCount}</strong> Contacted
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
                    <Award className="size-3.5 text-emerald-700" />
                    <strong>{analytics.convertedCount}</strong> Converted
                  </span>
                </div>
              </div>

              {/* Investor Persona Distribution Cards (from screenshot) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-extrabold text-[#142d27]">Investor Persona Distribution</h2>
                    <p className="text-xs text-slate-500">Breakdown of completed quiz results across all 4 personas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(["A", "B", "C", "D"] as ProfileKey[]).map((key) => {
                    const prof = PROFILES[key];
                    const count = analytics.byPersona[key] || 0;
                    const percent = analytics.totalLeads > 0 ? Math.round((count / analytics.totalLeads) * 100) : 0;

                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#142d27] text-[#f1c91e]">
                              {prof.number}
                            </span>
                            <span className="text-lg font-black text-[#142d27]">{count}</span>
                          </div>
                          <h3 className="font-extrabold text-sm text-[#142d27] leading-snug">{prof.name}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{prof.style}</p>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>{prof.productShort}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#f1c91e] rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, phone, ID..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#142d27] focus:bg-white transition-all"
                  />
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                    <Filter className="size-3.5" />
                    <span>Filter:</span>
                  </div>

                  <select
                    value={filterProfile}
                    onChange={(e) => setFilterProfile(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Personalities</option>
                    <option value="A">The Keep-It-Cool Investor</option>
                    <option value="B">The Smooth Operator</option>
                    <option value="C">The Patient Player</option>
                    <option value="D">The Opportunity Hunter</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="IN_PROGRESS">In Discussion</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Lead / ID</th>
                        <th className="py-3.5 px-4">Investor Personality</th>
                        <th className="py-3.5 px-4">Matched Fund</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No leads match the current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <div>{l.name}</div>
                              <span className="text-[10px] font-mono text-slate-400">{l.id}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              {profileBadge(l.profileKey)}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800">{l.matchedProduct}</span>
                              {l.investmentAmount && (
                                <span className="block text-[10px] text-slate-400">Budget: {l.investmentAmount}</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                {l.phone !== "N/A" && (
                                  <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-slate-600 hover:text-emerald-700">
                                    <Phone className="size-3 text-slate-400" />
                                    <span>{l.phone}</span>
                                  </a>
                                )}
                                {l.email !== "N/A" && (
                                  <a href={`mailto:${l.email}`} className="flex items-center gap-1 text-slate-500 hover:text-emerald-700">
                                    <Mail className="size-3 text-slate-400" />
                                    <span className="truncate max-w-[130px]">{l.email}</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={l.status}
                                onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer"
                              >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="IN_PROGRESS">In Discussion</option>
                                <option value="CONVERTED">Converted</option>
                                <option value="CLOSED">Closed</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                              {new Date(l.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLead(l);
                                    setEditNotes(l.notes || "");
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-[#142d27] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                  title="View Full Profile & Qs"
                                >
                                  <Eye className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(l.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVESTMENT PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#142d27]">Investment Products Configuration</h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage fund details, minimum amounts, expected returns, and regulatory disclaimers ({products.length} products active)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetProducts}
                    className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    title="Restore standard 4 First Capital funds"
                  >
                    <RotateCcw className="size-3.5" /> Restore Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct({
                        title: "",
                        shortTitle: "",
                        assetClass: "Unit Trust Fund",
                        riskLevel: "Moderate",
                        minInvestment: "LKR 1,000",
                        expectedReturn: "Variable Yield",
                        description: "",
                        disclaimer: "Terms & Conditions apply. KIID available upon request.",
                        status: "Active",
                      });
                      setIsAddProductOpen(true);
                    }}
                    className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-4" /> Add New Product
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {p.assetClass}
                          </span>
                          <h2 className="text-lg font-extrabold text-[#142d27] mt-1.5">{p.title}</h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                              p.riskLevel === "Low"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.riskLevel === "Moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.riskLevel} Risk
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.description}</p>

                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 mb-4 bg-slate-50/50 px-3 rounded-xl">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Min Investment</span>
                          <p className="text-xs font-extrabold text-slate-900">{p.minInvestment}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Return</span>
                          <p className="text-xs font-extrabold text-emerald-800">{p.expectedReturn}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 italic mb-4">
                        <strong>Disclaimer: </strong> {p.disclaimer}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="flex-1 bg-slate-100 hover:bg-[#142d27] hover:text-[#f1c91e] text-slate-800 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="size-3.5" /> Edit Product Parameters
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZ CONFIGURATION */}
          {activeTab === "quiz" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#142d27]">Investor Persona Scoring & Questions</h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Add, edit, and configure investor profiling questions and answer mappings ({questions.length} active questions)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    title="Restore standard 7 questions"
                  >
                    <RotateCcw className="size-3.5" /> Restore Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewQuestionText("");
                      setNewQuestionOptions([
                        { key: "A", label: "A", text: "" },
                        { key: "B", label: "B", text: "" },
                        { key: "C", label: "C", text: "" },
                        { key: "D", label: "D", text: "" },
                      ]);
                      setIsAddQuestionOpen(true);
                    }}
                    className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-4" /> Add New Question
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="size-7 rounded-full bg-[#142d27] text-[#f1c91e] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Question #{q.id}
                          </span>
                          <h2 className="font-extrabold text-base text-[#142d27] leading-snug">{q.question}</h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingQuestion(JSON.parse(JSON.stringify(q)))}
                          className="bg-slate-100 hover:bg-[#142d27] hover:text-[#f1c91e] text-slate-700 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Edit Question & Options"
                        >
                          <Edit className="size-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key + opt.label}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex items-start gap-3 transition-colors"
                        >
                          <span className="size-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-black shrink-0 text-slate-800 shadow-2xs">
                            {opt.label}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 leading-snug">{opt.text}</p>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${PROFILES[opt.key]?.badgeBg || "bg-emerald-50 text-emerald-800"}`}>
                                Weights: {PROFILES[opt.key]?.name || opt.key} ({opt.key})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS MANAGER */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header + Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#142d27]">Client Testimonials & Stories</h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage, create, edit, and organize investor quotes shown on the public landing page slider ({testimonials.length} total, {testimonials.filter((t) => t.status === "Active").length} active)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetTestimonials}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                    title="Reset to default quotes"
                  >
                    <RotateCcw className="size-3.5" /> Reset Defaults
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddTestimonialOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#142d27] bg-[#f1c91e] hover:bg-[#e0b815] px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="size-4" /> Add Testimonial
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stories</p>
                    <span className="p-2 rounded-xl bg-emerald-50 text-[#142d27]">
                      <Quote className="size-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-[#142d27] mt-2">{testimonials.length}</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Recorded investor experiences</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Live on Site</p>
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="size-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
                    {testimonials.filter((t) => t.status === "Active").length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Visible on public landing page</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Draft / Inactive</p>
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                      <Clock className="size-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
                    {testimonials.filter((t) => t.status !== "Active").length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Hidden from public view</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Star className="size-4 fill-amber-500 text-amber-500" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-[#142d27] mt-2">
                    {testimonials.length > 0
                      ? (
                          testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) /
                          testimonials.length
                        ).toFixed(1)
                      : "5.0"}
                    <span className="text-sm font-semibold text-amber-600 ml-1">★</span>
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Client satisfaction rating</p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by client name, role, or quote content..."
                    value={filterTestimonialSearch}
                    onChange={(e) => setFilterTestimonialSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#142d27] focus:bg-white transition-all"
                  />
                  {filterTestimonialSearch && (
                    <button
                      type="button"
                      onClick={() => setFilterTestimonialSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Filter className="size-3.5 text-slate-400" />
                    <select
                      value={filterTestimonialStatus}
                      onChange={(e) => setFilterTestimonialStatus(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses ({testimonials.length})</option>
                      <option value="Active">Active / Live ({testimonials.filter((t) => t.status === "Active").length})</option>
                      <option value="Draft">Draft ({testimonials.filter((t) => t.status === "Draft").length})</option>
                      <option value="Archived">Archived ({testimonials.filter((t) => t.status === "Archived").length})</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Testimonials Grid */}
              {(() => {
                const filtered = testimonials.filter((t) => {
                  const matchesSearch =
                    filterTestimonialSearch.trim() === "" ||
                    t.name.toLowerCase().includes(filterTestimonialSearch.toLowerCase()) ||
                    t.role.toLowerCase().includes(filterTestimonialSearch.toLowerCase()) ||
                    t.quote.toLowerCase().includes(filterTestimonialSearch.toLowerCase());

                  const matchesStatus =
                    filterTestimonialStatus === "ALL" || t.status === filterTestimonialStatus;

                  return matchesSearch && matchesStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                      <Quote className="size-12 mx-auto text-slate-300 mb-3" />
                      <h3 className="text-base font-bold text-slate-800">No testimonials found</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {filterTestimonialSearch || filterTestimonialStatus !== "ALL"
                          ? "Try clearing your search term or status filters to view all recorded quotes."
                          : "Start building social proof by creating your first client testimonial."}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        {filterTestimonialSearch || filterTestimonialStatus !== "ALL" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilterTestimonialSearch("");
                              setFilterTestimonialStatus("ALL");
                            }}
                            className="text-xs font-bold text-[#142d27] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl"
                          >
                            Clear Filters
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setIsAddTestimonialOpen(true)}
                          className="text-xs font-bold text-[#142d27] bg-[#f1c91e] hover:bg-[#e0b815] px-4 py-2 rounded-xl flex items-center gap-1.5"
                        >
                          <Plus className="size-3.5" /> Add Testimonial
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((t) => {
                      const initials = t.name
                        .split(" ")
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "FC";

                      return (
                        <div
                          key={t.id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                        >
                          {/* Top: Author & Rating & Status */}
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3.5">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-[#142d27] text-[#f1c91e] font-black text-sm flex items-center justify-center shadow-2xs shrink-0">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-extrabold text-[#142d27] truncate">
                                    {t.name}
                                  </h3>
                                  <p className="text-xs text-slate-500 truncate font-medium">
                                    {t.role}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleTestimonialStatus(t)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                                    t.status === "Active"
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                      : t.status === "Draft"
                                      ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                                  }`}
                                  title="Click to toggle between Active & Draft"
                                >
                                  {t.status === "Active" ? "● Live on Site" : t.status === "Draft" ? "○ Draft" : "Archived"}
                                </button>
                              </div>
                            </div>

                            {/* Stars Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3.5 ${
                                    i < (t.rating || 5)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-200"
                                  }`}
                                />
                              ))}
                              <span className="text-[11px] font-bold text-slate-400 ml-1.5">
                                {t.rating || 5}.0
                              </span>
                            </div>

                            {/* Quote Box */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 relative mb-4">
                              <Quote className="size-4 text-[#142d27]/20 absolute top-2.5 right-2.5" />
                              <p className="text-xs font-medium text-slate-700 leading-relaxed italic pr-4">
                                “{t.quote}”
                              </p>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {t.createdAt
                                ? `Added ${new Date(t.createdAt).toLocaleDateString()}`
                                : "Verified Quote"}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingTestimonial(t)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                              >
                                <Edit className="size-3" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete testimonial"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-black text-[#142d27]">Admin Settings & Security</h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage notification triggers, credentials, and system maintenance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Administrator Accounts Management */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-base font-extrabold text-[#142d27] flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-700" />
                          <span>Administrator Accounts</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manage login credentials, roles, and administrative team access
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddAdminOpen(true)}
                        className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <UserPlus className="size-3.5" />
                        <span>Add New Admin</span>
                      </button>
                    </div>

                    {/* List of Admin Accounts */}
                    <div className="space-y-2.5 mt-4">
                      {adminUsers.map((admin) => (
                        <div
                          key={admin.id}
                          className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-xl bg-[#142d27] text-[#f1c91e] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {admin.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {admin.name}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                    admin.role === "Super Admin"
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : admin.role === "Manager"
                                        ? "bg-blue-100 text-blue-900 border-blue-300"
                                        : admin.role === "Wealth Advisor"
                                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                          : "bg-slate-100 text-slate-800 border-slate-300"
                                  }`}
                                >
                                  {admin.role}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                    admin.status === "Active"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-200 text-slate-600"
                                  }`}
                                >
                                  {admin.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                                {admin.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmin({ ...admin });
                                setEditAdminPassword("");
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 cursor-pointer"
                              title="Edit Administrator"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            {adminUsers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                title="Delete Administrator"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Total Active Admins: <strong className="text-slate-800">{adminUsers.filter(a => a.status === "Active").length}</strong></span>
                    <span className="text-slate-400">Credentials synchronized with MySQL</span>
                  </div>
                </div>

                {/* Password / Security */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <h2 className="text-base font-extrabold text-[#142d27] mb-4">Security & Password</h2>

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span>Password changed successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new admin password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>

                  {/* System Reset & Database Diagnostics */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                      MySQL Database Diagnostics
                    </h3>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Connection Status:</span>
                        <span className={`font-bold flex items-center gap-1.5 ${dbStatus?.connected ? "text-emerald-700" : "text-rose-700"}`}>
                          <span className={`size-2 rounded-full ${dbStatus?.connected ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {dbStatus?.connected ? "CONNECTED (MySQL 8+)" : "DISCONNECTED / OFFLINE"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Target Database:</span>
                        <span className="font-mono font-bold text-slate-800">{dbStatus?.database || "firstcapital"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Host & Port:</span>
                        <span className="font-mono text-slate-800">{dbStatus?.host || "localhost"}:{dbStatus?.port || 3306}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Total Leads in DB:</span>
                        <span className="font-bold text-slate-900">{dbStatus?.totalLeads ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Synchronized Tables:</span>
                        <span className="font-mono text-[11px] text-slate-700">{dbStatus?.tables?.join(", ") || "quiz_leads, app_settings"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => syncDatabase(true)}
                        disabled={isSyncing}
                        className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} /> Test & Re-sync MySQL
                      </button>
                      <button
                        type="button"
                        onClick={handleResetDemoData}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="size-3.5" /> Re-fetch All Leads
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Lead {selectedLead.id}
                </span>
                <h2 className="text-2xl font-black text-[#142d27] mt-0.5">{selectedLead.name}</h2>
                <p className="text-xs text-slate-500">
                  Submitted {new Date(selectedLead.createdAt).toLocaleString()} via {selectedLead.source}
                </p>
              </div>
            </div>

            {/* Persona Result Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                  Matched Persona
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  {PROFILES[selectedLead.profileKey]?.style}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#142d27]">
                {selectedLead.profileName}
              </h3>
              <p className="text-xs font-semibold text-emerald-900 mt-1">
                Suggested Fund: {selectedLead.matchedProduct}
              </p>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <a
                href={`tel:${selectedLead.phone}`}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 flex items-center gap-2.5 text-xs font-bold text-slate-800 transition-colors"
              >
                <Phone className="size-4 text-emerald-600" />
                <span className="truncate">{selectedLead.phone}</span>
              </a>

              <a
                href={`mailto:${selectedLead.email}`}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 flex items-center gap-2.5 text-xs font-bold text-slate-800 transition-colors"
              >
                <Mail className="size-4 text-blue-600" />
                <span className="truncate">{selectedLead.email}</span>
              </a>

              {selectedLead.phone !== "N/A" && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2.5 text-xs font-bold text-emerald-900 transition-colors"
                >
                  <MessageSquare className="size-4 text-emerald-600" />
                  <span>WhatsApp Client</span>
                </a>
              )}
            </div>

            {/* Status Selector */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Lead Pipeline Status</label>
                <span className="text-[11px] text-slate-500">Update investor consultation status</span>
              </div>
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_PROGRESS">In Discussion</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Answered Questions Breakdown */}
            {selectedLead.answers && Object.keys(selectedLead.answers).length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">
                  Quiz Answers Breakdown ({questions.length} Questions)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {questions.map((q) => {
                    const ansKey = selectedLead.answers?.[q.id];
                    const selectedOpt = q.options.find((o) => o.key === ansKey);
                    return (
                      <div key={q.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="font-bold text-slate-800 leading-tight">
                          Q{q.id}: {q.question}
                        </div>
                        {selectedOpt && (
                          <div className="mt-1 text-emerald-800 font-semibold flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[10px] font-black">
                              {selectedOpt.label}
                            </span>
                            <span>{selectedOpt.text}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Advisor Notes */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Advisor Notes & Follow-up Log
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about phone conversations, investment amount, follow-up meetings..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#142d27] focus:bg-white transition-all"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" /> Delete Lead
              </button>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL LEAD MODAL */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-black text-[#142d27] mb-1">Add Manual Investor Lead</h2>
            <p className="text-xs text-slate-500 mb-6">Enter details for walk-in or telephone investor inquiries</p>

            <form onSubmit={handleAddManualLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Investor Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Chaminda Silva"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Persona Match</label>
                  <select
                    value={newLeadProfile}
                    onChange={(e) => setNewLeadProfile(e.target.value as ProfileKey)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="A">The Keep-It-Cool Investor</option>
                    <option value="B">The Smooth Operator</option>
                    <option value="C">The Patient Player</option>
                    <option value="D">The Opportunity Hunter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Investment Amount</label>
                  <input
                    type="text"
                    value={newLeadAmount}
                    onChange={(e) => setNewLeadAmount(e.target.value)}
                    placeholder="e.g. LKR 500,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Advisor Notes</label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Inquiry notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-black text-[#142d27] mb-1">Edit Fund Configuration</h2>
            <p className="text-xs text-slate-500 mb-6">Modify product parameters displayed across public routes</p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fund Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Investment</label>
                  <input
                    type="text"
                    value={editingProduct.minInvestment}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minInvestment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Return Benchmark</label>
                  <input
                    type="text"
                    value={editingProduct.expectedReturn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expectedReturn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Regulatory Disclaimer</label>
                <textarea
                  rows={2}
                  value={editingProduct.disclaimer}
                  onChange={(e) => setEditingProduct({ ...editingProduct, disclaimer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="size-6 rounded-full bg-[#f1c91e] text-[#142d27] text-xs font-black flex items-center justify-center">
                <Plus className="size-3.5" />
              </div>
              <h2 className="text-xl font-black text-[#142d27]">Add Investment Product</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">Create a new First Capital fund offering or financial asset</p>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Fund Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. First Capital High Yield Fund (FCHYF)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={newProduct.shortTitle}
                    onChange={(e) => setNewProduct({ ...newProduct, shortTitle: e.target.value })}
                    placeholder="e.g. High Yield Fund"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asset Class / Category</label>
                  <input
                    type="text"
                    value={newProduct.assetClass}
                    onChange={(e) => setNewProduct({ ...newProduct, assetClass: e.target.value })}
                    placeholder="e.g. Unit Trust Fund (Growth)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Risk Level</label>
                  <select
                    value={newProduct.riskLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, riskLevel: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Investment</label>
                  <input
                    type="text"
                    value={newProduct.minInvestment}
                    onChange={(e) => setNewProduct({ ...newProduct, minInvestment: e.target.value })}
                    placeholder="e.g. LKR 5,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Return</label>
                  <input
                    type="text"
                    value={newProduct.expectedReturn}
                    onChange={(e) => setNewProduct({ ...newProduct, expectedReturn: e.target.value })}
                    placeholder="e.g. 14.5% p.a."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Key investor benefits and investment strategy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Regulatory Disclaimer</label>
                <textarea
                  rows={2}
                  value={newProduct.disclaimer}
                  onChange={(e) => setNewProduct({ ...newProduct, disclaimer: e.target.value })}
                  placeholder="e.g. Current yield is variable and subject to change. SEC Approved."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingQuestion(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="size-6 rounded-full bg-[#142d27] text-[#f1c91e] text-xs font-black flex items-center justify-center">
                {editingQuestion.id}
              </span>
              <h2 className="text-xl font-black text-[#142d27]">Edit Quiz Question</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Update the question wording, answer options, and persona scoring weights
            </p>

            <form onSubmit={handleSaveQuestion} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question: e.target.value })
                  }
                  placeholder="Enter the quiz question..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#142d27] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Answer Options & Persona Weights (4 Options)
                </label>
                <div className="space-y-3">
                  {editingQuestion.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-lg bg-[#142d27] text-[#f1c91e] flex items-center justify-center text-xs font-black shrink-0">
                            {opt.label || String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs font-bold text-slate-700">Option {opt.label || String.fromCharCode(65 + idx)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500">Maps to:</span>
                          <select
                            value={opt.key}
                            onChange={(e) => {
                              const newOpts = [...editingQuestion.options];
                              const target = newOpts[idx];
                              if (target) {
                                newOpts[idx] = { ...target, key: e.target.value as ProfileKey };
                                setEditingQuestion({ ...editingQuestion, options: newOpts });
                              }
                            }}
                            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                          >
                            <option value="A">Keep-It-Cool (A) - Money Market</option>
                            <option value="B">Smooth Operator (B) - Fixed Income</option>
                            <option value="C">Patient Player (C) - Treasury Bonds</option>
                            <option value="D">Opportunity Hunter (D) - Equities</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options];
                          const target = newOpts[idx];
                          if (target) {
                            newOpts[idx] = { ...target, text: e.target.value };
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }
                        }}
                        placeholder={`Enter text for option ${opt.label}...`}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(editingQuestion.id)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="size-3.5" /> Delete Question
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {isAddQuestionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddQuestionOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="size-6 rounded-full bg-[#f1c91e] text-[#142d27] text-xs font-black flex items-center justify-center">
                <Plus className="size-3.5" />
              </div>
              <h2 className="text-xl font-black text-[#142d27]">Add New Quiz Question</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Create an investor profiling question and set the 4 persona answer choices
            </p>

            <form onSubmit={handleAddQuestion} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. How do you prefer to manage unexpected financial expenses?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#142d27] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Answer Options & Persona Weights (4 Options)
                </label>
                <div className="space-y-3">
                  {newQuestionOptions.map((opt, idx) => (
                    <div
                      key={opt.key}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-lg bg-[#142d27] text-[#f1c91e] flex items-center justify-center text-xs font-black shrink-0">
                            {opt.label}
                          </span>
                          <span className="text-xs font-bold text-slate-700">Option {opt.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500">Maps to:</span>
                          <select
                            value={opt.key}
                            onChange={(e) => {
                              const newOpts = [...newQuestionOptions];
                              const target = newOpts[idx];
                              if (target) {
                                newOpts[idx] = { ...target, key: e.target.value as ProfileKey };
                                setNewQuestionOptions(newOpts);
                              }
                            }}
                            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                          >
                            <option value="A">Keep-It-Cool (A) - Money Market</option>
                            <option value="B">Smooth Operator (B) - Fixed Income</option>
                            <option value="C">Patient Player (C) - Treasury Bonds</option>
                            <option value="D">Opportunity Hunter (D) - Equities</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...newQuestionOptions];
                          const target = newOpts[idx];
                          if (target) {
                            newOpts[idx] = { ...target, text: e.target.value };
                            setNewQuestionOptions(newOpts);
                          }
                        }}
                        placeholder={`Enter text for option ${opt.label}...`}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TESTIMONIAL MODAL */}
      {isAddTestimonialOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setIsAddTestimonialOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="size-6 rounded-full bg-[#f1c91e] text-[#142d27] text-xs font-black flex items-center justify-center">
                <Plus className="size-3.5" />
              </div>
              <h2 className="text-xl font-black text-[#142d27]">Add Client Testimonial</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Create a new review or quote to feature on the investor landing page slider
            </p>

            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.name}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, name: e.target.value })
                    }
                    placeholder="e.g. Kasun Fernando"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Role / Profession</label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, role: e.target.value })
                    }
                    placeholder="e.g. Tech Entrepreneur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={newTestimonial.rating}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newTestimonial.status}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        status: e.target.value as "Active" | "Draft" | "Archived",
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Live on Website)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={newTestimonial.quote}
                  onChange={(e) =>
                    setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                  }
                  placeholder="e.g. Investing with First Capital gave me the peace of mind I needed to build my long-term savings..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTestimonialOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#f1c91e] hover:bg-[#e0b815] text-[#142d27] font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
                >
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TESTIMONIAL MODAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setEditingTestimonial(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="size-6 rounded-full bg-[#142d27] text-[#f1c91e] text-xs font-black flex items-center justify-center">
                <Edit className="size-3.5" />
              </div>
              <h2 className="text-xl font-black text-[#142d27]">Edit Testimonial</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Update quote wording, client credentials, or public visibility status
            </p>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Role / Profession</label>
                  <input
                    type="text"
                    value={editingTestimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingTestimonial.status}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        status: e.target.value as "Active" | "Draft" | "Archived",
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Live on Website)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(editingTestimonial.id)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="size-3.5" /> Delete Testimonial
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2 px-5 rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADMIN MODAL */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => setIsAddAdminOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="size-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#142d27]">Add New Administrator</h3>
                <p className="text-xs text-slate-500">Create login credentials for a staff member</p>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Kasun Wickremasinghe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. kasun@firstcapital.lk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as AdminUser["role"])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Wealth Advisor">Wealth Advisor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={newAdminStatus}
                    onChange={(e) => setNewAdminStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              type="button"
              onClick={() => {
                setEditingAdmin(null);
                setEditAdminPassword("");
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="size-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Edit className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#142d27]">Edit Administrator</h3>
                <p className="text-xs text-slate-500 font-mono">{editingAdmin.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={editingAdmin.role}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminUser["role"] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Wealth Advisor">Wealth Advisor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editingAdmin.status}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reset Password <span className="text-slate-400 font-normal">(Leave blank to keep existing)</span>
                </label>
                <input
                  type="password"
                  value={editAdminPassword}
                  onChange={(e) => setEditAdminPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#142d27]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {adminUsers.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(editingAdmin.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" /> Remove Admin
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAdmin(null);
                      setEditAdminPassword("");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#142d27] hover:bg-[#1f423a] text-[#f1c91e] font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

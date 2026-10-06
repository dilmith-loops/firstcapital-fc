import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminStore } from "@/lib/admin-store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | First Capital Investor Week" },
      { name: "description", content: "Management console for First Capital Investor Week." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(AdminStore.isAuthenticated());
    setMounted(true);

    const unsubscribe = AdminStore.subscribe(() => {
      setIsAuthenticated(AdminStore.isAuthenticated());
    });

    return unsubscribe;
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d1f1b] flex items-center justify-center text-[#f1c91e]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#f1c91e] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Loading Admin Console...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}

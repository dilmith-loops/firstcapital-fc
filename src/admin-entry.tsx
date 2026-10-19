import React from "react";
import ReactDOM from "react-dom/client";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminStore } from "@/lib/admin-store";
import "@/styles.css";

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);

  React.useEffect(() => {
    // The server session decides whether the dashboard is shown
    AdminStore.refreshSession().then((ok) => {
      setIsAuthenticated(ok);
      setCheckingSession(false);
    });
    return AdminStore.subscribe(() => {
      setIsAuthenticated(AdminStore.isAuthenticated());
    });
  }, []);

  if (checkingSession) {
    return <div className="min-h-screen bg-[#0d1f1b]" />;
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}

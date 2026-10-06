import React from "react";
import ReactDOM from "react-dom/client";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminStore } from "@/lib/admin-store";
import "@/styles.css";

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(AdminStore.isAuthenticated());

  React.useEffect(() => {
    return AdminStore.subscribe(() => {
      setIsAuthenticated(AdminStore.isAuthenticated());
    });
  }, []);

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

export function getApiUrl(endpoint: string): string {
  if (typeof window === "undefined") return endpoint;

  const clean = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const pathname = window.location.pathname;

  // Determine base path for the subfolder
  let base = "/";
  const adminIdx = pathname.indexOf("/admin");
  if (adminIdx !== -1) {
    base = pathname.substring(0, adminIdx) + "/";
  } else {
    const fcIdx = pathname.indexOf("/firstcapitalpages");
    if (fcIdx !== -1) {
      base = pathname.substring(0, fcIdx + "/firstcapitalpages".length) + "/";
    } else {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length > 0 && (parts[0] === "fc" || parts[0] === "begininvesting")) {
        base = `/${parts[0]}/`;
      }
    }
  }

  if (!base.endsWith("/")) base += "/";

  // Check if we are running in local Vite dev server (port 8080 or 5173 on localhost)
  const isViteDev =
    (window.location.port === "8080" || window.location.port === "5173") &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  // Everywhere else (Apache, XAMPP, cPanel, Hostinger, php -S) is a PHP environment
  const isPhpHost = !isViteDev;

  if (isPhpHost) {
    // Map REST routes directly to api/leads.php so it works without server rewrite dependency
    if (clean === "api/admin/status") {
      return `${base}api/leads.php?action=status`;
    }
    if (clean.startsWith("api/admin/settings") || clean.startsWith("api/settings")) {
      const query = clean.includes("?") ? clean.split("?")[1] : "";
      return `${base}api/leads.php?action=settings${query ? "&" + query : ""}`;
    }
    if (clean.startsWith("api/reasons") || clean.startsWith("api/why_first_capital")) {
      const query = clean.includes("?") ? clean.split("?")[1] : "";
      return `${base}api/leads.php?action=settings&key=why_first_capital${query ? "&" + query : ""}`;
    }
    if (clean.startsWith("api/testimonials")) {
      const query = clean.includes("?") ? clean.split("?")[1] : "";
      return `${base}api/leads.php?action=settings&key=testimonials${query ? "&" + query : ""}`;
    }
    if (clean.startsWith("api/questions")) {
      const query = clean.includes("?") ? clean.split("?")[1] : "";
      return `${base}api/leads.php?action=settings&key=quiz_questions${query ? "&" + query : ""}`;
    }
    if (clean === "api/admin/leads/update") {
      return `${base}api/leads.php?action=update`;
    }
    if (clean === "api/admin/leads/delete") {
      return `${base}api/leads.php?action=delete`;
    }
    if (clean === "api/admin/leads/create") {
      return `${base}api/leads.php?action=admin_create`;
    }
    if (
      clean === "api/admin/leads" ||
      clean === "api/leads" ||
      clean === "api/leads/result"
    ) {
      return `${base}api/leads.php`;
    }
  }

  return `${base}${clean}`;
}

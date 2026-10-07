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
      if (parts.length > 0 && parts[0] === "fc") {
        base = "/fc/firstcapitalpages/";
      }
    }
  }

  if (!base.endsWith("/")) base += "/";

  // Check if we are running in production / PHP environment (not local Vite dev server on localhost:8080)
  const isPhpHost =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    !window.location.port.includes("8080") &&
    !window.location.port.includes("5173");

  if (isPhpHost) {
    // Map REST routes directly to api/leads.php so it works without server rewrite dependency
    if (clean === "api/admin/status") {
      return `${base}api/leads.php?action=status`;
    }
    if (clean.startsWith("api/admin/settings")) {
      const query = clean.includes("?") ? clean.split("?")[1] : "";
      return `${base}api/leads.php?action=settings${query ? "&" + query : ""}`;
    }
    if (clean === "api/admin/leads/update") {
      return `${base}api/leads.php?action=update`;
    }
    if (clean === "api/admin/leads/delete") {
      return `${base}api/leads.php?action=delete`;
    }
    if (
      clean === "api/admin/leads" ||
      clean === "api/admin/leads/create" ||
      clean === "api/leads" ||
      clean === "api/leads/result"
    ) {
      return `${base}api/leads.php`;
    }
  }

  return `${base}${clean}`;
}

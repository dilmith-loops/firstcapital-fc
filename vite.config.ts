// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import type { IncomingMessage } from "http";

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const quizLeadsApiPlugin: Plugin = {
  name: "quiz-leads-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split("?")[0];

      // 1. Submit Lead Contact
      if (url === "/api/leads" && req.method === "POST") {
        try {
          const body = await parseJsonBody(req);
          const { handleCreateLead } = await import("./src/server/api-handlers");
          const result = await handleCreateLead(body);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err?.message || "Failed to create lead" }));
          return;
        }
      }

      // 2. Submit Quiz Result
      if (url === "/api/leads/result" && (req.method === "POST" || req.method === "PATCH")) {
        try {
          const body = await parseJsonBody(req);
          const { handleUpdateLeadResult } = await import("./src/server/api-handlers");
          const result = await handleUpdateLeadResult(body);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err?.message || "Failed to update lead result" }));
          return;
        }
      }

      // 3. Admin DB Status Check
      if (url === "/api/admin/status" && req.method === "GET") {
        try {
          const { handleGetDbStatus } = await import("./src/server/api-handlers");
          const result = await handleGetDbStatus();
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 500;
          res.end(JSON.stringify({ connected: false, error: err?.message || "DB check failed" }));
          return;
        }
      }

      // 4. Admin Get All Leads
      if (url === "/api/admin/leads" && req.method === "GET") {
        try {
          const { handleGetLeads } = await import("./src/server/api-handlers");
          const result = await handleGetLeads();
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: err?.message || "Failed to fetch leads" }));
          return;
        }
      }

      // 5. Admin Create Lead
      if (url === "/api/admin/leads/create" && req.method === "POST") {
        try {
          const body = await parseJsonBody(req);
          const { handleCreateLead } = await import("./src/server/api-handlers");
          const result = await handleCreateLead(body);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err?.message || "Failed to create manual lead" }));
          return;
        }
      }

      // 6. Admin Update Lead (Status / Notes)
      if (url === "/api/admin/leads/update" && (req.method === "POST" || req.method === "PATCH" || req.method === "PUT")) {
        try {
          const body = await parseJsonBody(req);
          const { handleUpdateLead } = await import("./src/server/api-handlers");
          const result = await handleUpdateLead(body);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err?.message || "Failed to update lead" }));
          return;
        }
      }

      // 6. Admin Delete Lead
      if (url === "/api/admin/leads/delete" && (req.method === "POST" || req.method === "DELETE")) {
        try {
          const body = await parseJsonBody(req);
          const { handleDeleteLead } = await import("./src/server/api-handlers");
          const result = await handleDeleteLead(body.id);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(result));
          return;
        } catch (err: any) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err?.message || "Failed to delete lead" }));
          return;
        }
      }

      // 7. Admin App Settings (Questions / Products Sync)
      if (url === "/api/admin/settings") {
        if (req.method === "GET") {
          try {
            const queryKey = req.url?.split("?key=")[1]?.split("&")[0];
            const { handleGetAppSetting } = await import("./src/server/api-handlers");
            const val = await handleGetAppSetting(queryKey || "quiz_questions");
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: val }));
            return;
          } catch (err: any) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err?.message }));
            return;
          }
        } else if (req.method === "POST") {
          try {
            const body = await parseJsonBody(req);
            const { handleSaveAppSetting } = await import("./src/server/api-handlers");
            const result = await handleSaveAppSetting(body.key, body.value);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          } catch (err: any) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err?.message }));
            return;
          }
        }
      }

      next();
    });
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [quizLeadsApiPlugin],
  },
});

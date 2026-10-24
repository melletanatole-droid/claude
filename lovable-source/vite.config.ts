// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

const CSP_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.supabase.co https://oauth.lovable.app https://lovable.dev",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const BLOCKED_ROOT_FILES = new Set([
  "/package.json",
  "/.env",
  "/.env.local",
  "/.env.production",
]);

export default defineConfig({
  vite: {
    plugins: [
      {
        name: "medicilline-dev-security-blocks",
        configureServer(server: ViteDevServer) {
          server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
            const path = req.url?.split("?")[0] ?? "";
            if (!BLOCKED_ROOT_FILES.has(path)) {
              next();
              return;
            }
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end("Not found");
          });
        },
      },
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // @ts-ignore — nitro routeRules sont supportés à l'exécution malgré les types restreints de l'overlay.
  nitro: {
    // Headers de sécurité appliqués à toutes les réponses, y compris les assets statiques.
    // La logique est dupliquée dans src/server.ts pour le dev server et les réponses SSR.
    routeRules: {
      "/**": {
        headers: {
          "Content-Security-Policy": CSP_VALUE,
          "X-Frame-Options": "SAMEORIGIN",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy":
            "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        },
      },
      // Bloque l'accès aux fichiers sensibles à la racine du projet.
      "/package.json": { statusCode: 404 },
      "/.env": { statusCode: 404 },
      "/.env.local": { statusCode: 404 },
      "/.env.production": { statusCode: 404 },
    },
  },
} as any);

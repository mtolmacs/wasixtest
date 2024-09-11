import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [wasmMiddleware()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        "top-level-await": true,
      },
    },
  },
});

function wasmMiddleware() {
  return {
    name: "wasm-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.endsWith(".wasm")) {
          const wasmPath = path.join(
            __dirname,
            "node_modules/@wasmer/sdk/dist",
            path.basename(req.url)
          );
          const wasmFile = fs.readFileSync(wasmPath);
          res.setHeader("Content-Type", "application/wasm");
          res.end(wasmFile);
          return;
        }
        next();
      });
    },
  };
}

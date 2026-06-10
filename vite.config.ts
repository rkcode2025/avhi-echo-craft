import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite"; // <--- Add this import

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tanstackStart(), 
    viteReact(),
    cloudflare({
      viteEnvironment: {
        name: "ssr"
      }
    })
  ],
});
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite"; // <--- Add this import

export default defineConfig({
  plugins: [
    tanstackStart(), 
    viteReact(),
    nitro({ preset: "vercel" }) // <--- Force Vercel output here
  ],
});

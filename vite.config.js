import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: "transpile-typescript-in-app-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.split("?")[0].endsWith("/App.jsx")) return null;
        return transformWithEsbuild(code, id, {
          loader: "tsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     // By default, Vite doesn't include shims for NodeJS/
//     // necessary for segment analytics lib to work
//     global: {},
//   },
// });
/* eslint-disable no-undef */
// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
// import scss from 'rollup-plugin-scss'
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ["src"] })],
  build: {
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "lm-chat-lib",
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "react",
        "react-dom",
        "vite",
        "react/jsx-runtime",
        "react-router-dom",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
  optimizeDeps: {
    disabled: false,
  },
});

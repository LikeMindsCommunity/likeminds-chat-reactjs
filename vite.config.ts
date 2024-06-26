import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["react-giphy-searchbox"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": resolve(__dirname, "src"),
//     },
//   },
//   optimizeDeps: {
//     include: ["react-giphy-searchbox"],
//     esbuildOptions: {
//       plugins: [
//         {
//           name: "load-cjs",
//           setup(build) {
//             build.onLoad({ filter: /react-giphy-searchbox/ }, async (args) => {
//               return {
//                 contents: `import * as module from '${args.path}'; export default module;`,
//                 loader: "jsx",
//               };
//             });
//           },
//         },
//       ],
//     },
//   },
//   build: {
//     commonjsOptions: {
//       transformMixedEsModules: true,
//     },
//   },
// });

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
//   build: {
//     minify: false,
//   }
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": resolve(__dirname, "src"),
//     },
//   },
//   optimizeDeps: {
//     include: ["react-giphy-searchbox"],
//   },
// });

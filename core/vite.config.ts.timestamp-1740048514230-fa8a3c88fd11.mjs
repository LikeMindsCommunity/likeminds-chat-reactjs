// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///L:/likeminds-chat-reactjs/core/node_modules/vite/dist/node/index.js";
import react from "file:///L:/likeminds-chat-reactjs/core/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///L:/likeminds-chat-reactjs/core/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///L:/likeminds-chat-reactjs/core/node_modules/vite-plugin-lib-inject-css/dist/index.js";
var __vite_injected_original_dirname = "L:\\likeminds-chat-reactjs\\core";
var vite_config_default = defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ["src"] })],
  build: {
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "lm-chat-lib",
      // the proper extensions will be added
      fileName: "index"
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "react",
        "react-dom",
        "vite",
        "react/jsx-runtime",
        "react-router-dom"
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React"
        }
      }
    }
  },
  optimizeDeps: {
    disabled: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJMOlxcXFxsaWtlbWluZHMtY2hhdC1yZWFjdGpzXFxcXGNvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkw6XFxcXGxpa2VtaW5kcy1jaGF0LXJlYWN0anNcXFxcY29yZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vTDovbGlrZW1pbmRzLWNoYXQtcmVhY3Rqcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7Ly8gaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuLy8gaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5cclxuLy8gLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuLy8gICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbi8vICAgZGVmaW5lOiB7XHJcbi8vICAgICAvLyBCeSBkZWZhdWx0LCBWaXRlIGRvZXNuJ3QgaW5jbHVkZSBzaGltcyBmb3IgTm9kZUpTL1xyXG4vLyAgICAgLy8gbmVjZXNzYXJ5IGZvciBzZWdtZW50IGFuYWx5dGljcyBsaWIgdG8gd29ya1xyXG4vLyAgICAgZ2xvYmFsOiB7fSxcclxuLy8gICB9LFxyXG4vLyB9KTtcclxuXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbi8vIHZpdGUuY29uZmlnLmpzXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG4vLyBpbXBvcnQgc2NzcyBmcm9tICdyb2xsdXAtcGx1Z2luLXNjc3MnXHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcbmltcG9ydCB7IGxpYkluamVjdENzcyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1saWItaW5qZWN0LWNzc1wiO1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBsaWJJbmplY3RDc3MoKSwgZHRzKHsgaW5jbHVkZTogW1wic3JjXCJdIH0pXSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXHJcbiAgICBsaWI6IHtcclxuICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXHJcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXHJcbiAgICAgIG5hbWU6IFwibG0tY2hhdC1saWJcIixcclxuICAgICAgLy8gdGhlIHByb3BlciBleHRlbnNpb25zIHdpbGwgYmUgYWRkZWRcclxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcclxuICAgICAgLy8gaW50byB5b3VyIGxpYnJhcnlcclxuICAgICAgZXh0ZXJuYWw6IFtcclxuICAgICAgICBcInJlYWN0XCIsXHJcbiAgICAgICAgXCJyZWFjdC1kb21cIixcclxuICAgICAgICBcInZpdGVcIixcclxuICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCIsXHJcbiAgICAgICAgXCJyZWFjdC1yb3V0ZXItZG9tXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFByb3ZpZGUgZ2xvYmFsIHZhcmlhYmxlcyB0byB1c2UgaW4gdGhlIFVNRCBidWlsZFxyXG4gICAgICAgIC8vIGZvciBleHRlcm5hbGl6ZWQgZGVwc1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGRpc2FibGVkOiBmYWxzZSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQWVBLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUU3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsb0JBQW9CO0FBcEI3QixJQUFNLG1DQUFtQztBQXFCekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFDNUQsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLElBQ2YsS0FBSztBQUFBO0FBQUEsTUFFSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQTtBQUFBLE1BRU4sVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQTtBQUFBO0FBQUEsTUFHYixVQUFVO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBLFFBR04sU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFVBQVU7QUFBQSxFQUNaO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

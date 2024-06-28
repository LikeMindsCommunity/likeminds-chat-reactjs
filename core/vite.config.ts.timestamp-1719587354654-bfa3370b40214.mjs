// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///Users/omen/likeminds-chat-reactjs/core/node_modules/vite/dist/node/index.js";
import react from "file:///Users/omen/likeminds-chat-reactjs/core/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/omen/likeminds-chat-reactjs/core/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///Users/omen/likeminds-chat-reactjs/core/node_modules/vite-plugin-lib-inject-css/dist/index.js";
var __vite_injected_original_dirname = "/Users/omen/likeminds-chat-reactjs/core";
var vite_config_default = defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ["src"] })],
  build: {
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "react-feed-lib",
      // the proper extensions will be added
      fileName: "index"
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "vite"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb21lbi9saWtlbWluZHMtY2hhdC1yZWFjdGpzL2NvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9vbWVuL2xpa2VtaW5kcy1jaGF0LXJlYWN0anMvY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvb21lbi9saWtlbWluZHMtY2hhdC1yZWFjdGpzL2NvcmUvdml0ZS5jb25maWcudHNcIjsvLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuLy8gaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG4vLyAvLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbi8vICAgcGx1Z2luczogW3JlYWN0KCldLFxuLy8gICBkZWZpbmU6IHtcbi8vICAgICAvLyBCeSBkZWZhdWx0LCBWaXRlIGRvZXNuJ3QgaW5jbHVkZSBzaGltcyBmb3IgTm9kZUpTL1xuLy8gICAgIC8vIG5lY2Vzc2FyeSBmb3Igc2VnbWVudCBhbmFseXRpY3MgbGliIHRvIHdvcmtcbi8vICAgICBnbG9iYWw6IHt9LFxuLy8gICB9LFxuLy8gfSk7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuLy8gdml0ZS5jb25maWcuanNcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbi8vIGltcG9ydCBzY3NzIGZyb20gJ3JvbGx1cC1wbHVnaW4tc2NzcydcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IHsgbGliSW5qZWN0Q3NzIH0gZnJvbSBcInZpdGUtcGx1Z2luLWxpYi1pbmplY3QtY3NzXCI7XG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgbGliSW5qZWN0Q3NzKCksIGR0cyh7IGluY2x1ZGU6IFtcInNyY1wiXSB9KV0sXG4gIGJ1aWxkOiB7XG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIGNvcHlQdWJsaWNEaXI6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxuICAgICAgbmFtZTogXCJyZWFjdC1mZWVkLWxpYlwiLFxuICAgICAgLy8gdGhlIHByb3BlciBleHRlbnNpb25zIHdpbGwgYmUgYWRkZWRcbiAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAvLyBtYWtlIHN1cmUgdG8gZXh0ZXJuYWxpemUgZGVwcyB0aGF0IHNob3VsZG4ndCBiZSBidW5kbGVkXG4gICAgICAvLyBpbnRvIHlvdXIgbGlicmFyeVxuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwidml0ZVwiXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBQcm92aWRlIGdsb2JhbCB2YXJpYWJsZXMgdG8gdXNlIGluIHRoZSBVTUQgYnVpbGRcbiAgICAgICAgLy8gZm9yIGV4dGVybmFsaXplZCBkZXBzXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFjQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFFN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLG9CQUFvQjtBQW5CN0IsSUFBTSxtQ0FBbUM7QUFvQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQzVELE9BQU87QUFBQSxJQUNMLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQTtBQUFBLE1BRUgsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUE7QUFBQSxNQUVOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUE7QUFBQTtBQUFBLE1BR2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxNQUFNO0FBQUEsTUFDdkMsUUFBUTtBQUFBO0FBQUE7QUFBQSxRQUdOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixVQUFVO0FBQUEsRUFDWjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

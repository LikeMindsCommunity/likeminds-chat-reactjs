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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb21lbi9saWtlbWluZHMtY2hhdC1yZWFjdGpzL2NvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9vbWVuL2xpa2VtaW5kcy1jaGF0LXJlYWN0anMvY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvb21lbi9saWtlbWluZHMtY2hhdC1yZWFjdGpzL2NvcmUvdml0ZS5jb25maWcudHNcIjsvLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuLy8gaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG4vLyAvLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbi8vICAgcGx1Z2luczogW3JlYWN0KCldLFxuLy8gICBkZWZpbmU6IHtcbi8vICAgICAvLyBCeSBkZWZhdWx0LCBWaXRlIGRvZXNuJ3QgaW5jbHVkZSBzaGltcyBmb3IgTm9kZUpTL1xuLy8gICAgIC8vIG5lY2Vzc2FyeSBmb3Igc2VnbWVudCBhbmFseXRpY3MgbGliIHRvIHdvcmtcbi8vICAgICBnbG9iYWw6IHt9LFxuLy8gICB9LFxuLy8gfSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4vLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuLy8gaW1wb3J0IHNjc3MgZnJvbSAncm9sbHVwLXBsdWdpbi1zY3NzJ1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tIFwidml0ZS1wbHVnaW4tbGliLWluamVjdC1jc3NcIjtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBsaWJJbmplY3RDc3MoKSwgZHRzKHsgaW5jbHVkZTogW1wic3JjXCJdIH0pXSxcbiAgYnVpbGQ6IHtcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICAvLyBDb3VsZCBhbHNvIGJlIGEgZGljdGlvbmFyeSBvciBhcnJheSBvZiBtdWx0aXBsZSBlbnRyeSBwb2ludHNcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcImxtLWNoYXQtbGliXCIsXG4gICAgICAvLyB0aGUgcHJvcGVyIGV4dGVuc2lvbnMgd2lsbCBiZSBhZGRlZFxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcbiAgICAgIC8vIGludG8geW91ciBsaWJyYXJ5XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICBcInJlYWN0XCIsXG4gICAgICAgIFwicmVhY3QtZG9tXCIsXG4gICAgICAgIFwidml0ZVwiLFxuICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCIsXG4gICAgICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiLFxuICAgICAgXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBQcm92aWRlIGdsb2JhbCB2YXJpYWJsZXMgdG8gdXNlIGluIHRoZSBVTUQgYnVpbGRcbiAgICAgICAgLy8gZm9yIGV4dGVybmFsaXplZCBkZXBzXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFlQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFFN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLG9CQUFvQjtBQXBCN0IsSUFBTSxtQ0FBbUM7QUFxQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQzVELE9BQU87QUFBQSxJQUNMLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQTtBQUFBLE1BRUgsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUE7QUFBQSxNQUVOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUE7QUFBQTtBQUFBLE1BR2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBO0FBQUE7QUFBQSxRQUdOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixVQUFVO0FBQUEsRUFDWjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

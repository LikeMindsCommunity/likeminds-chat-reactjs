import ReactDOM from "react-dom/client";
import "./index.css";
import { appRoute } from "./App.tsx";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={appRoute} />,
);
// ReactDOM.createRoot(document.getElementById("root")!).render(<LMAppLayout />);

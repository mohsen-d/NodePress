import React from "react";
import { createRoot } from "react-dom/client";

import Steps from "./components/steps.component";
import SetupPage from "./pages/setup.page";

export default function App() {
  return <SetupPage />;
}

if (typeof document !== "undefined") {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}

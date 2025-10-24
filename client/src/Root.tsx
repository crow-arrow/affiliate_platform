import { StrictMode } from "react";
import App from "./App.js";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider.js";
import CssBaseline from "@mui/material/CssBaseline";
// import { useMuiMode } from "./data_grid_theme/useMuiMode.tsx";
// import { themeSettings } from "./data_grid_theme/theme.js";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const Root = () => (
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);

const container = document.getElementById("root")!;
const root = createRoot(container);
export default Root;

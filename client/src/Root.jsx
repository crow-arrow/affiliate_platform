import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMuiMode } from "./data_grid_theme/useMuiMode.jsx";
import { themeSettings } from "./data_grid_theme/theme.js";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, useNavigate } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function InnerRoot() {
  const mode = useMuiMode();
  const theme = createTheme(themeSettings(mode));
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <InnerRoot />
    </BrowserRouter>
  );
}

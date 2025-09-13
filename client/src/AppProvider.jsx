import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMuiMode } from "./data_grid_theme/useMuiMode";
import { themeSettings } from "./data_grid_theme/theme.js";
import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("CLERK PUBLISHABLE KEY:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const AppProvider = () => {
  const mode = useMuiMode();
  const theme = createTheme(themeSettings(mode));
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} navigate={navigate}>
        <CssBaseline />
        <App />
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default AppProvider;

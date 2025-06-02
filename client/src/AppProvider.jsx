import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMuiMode } from "./data_grid_theme/useMuiMode";
import { themeSettings } from "./data_grid_theme/theme.js"; // Убедитесь, что путь верен

const AppProvider = () => {
  const mode = useMuiMode();
  const theme = createTheme(themeSettings(mode));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export default AppProvider;

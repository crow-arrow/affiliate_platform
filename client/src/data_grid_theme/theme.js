// theme.js
import { createTheme } from "@mui/material/styles";
// import { dark } from "@mui/material/styles/createPalette";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F2C8ED",
      light: "#e0c060",
      dark: "#b09119",
      contrastText: "#f1f1f1",
    },
    secondary: {
      main: "#A9DFD8",
    },
    background: { default: "rgb(245, 241, 237, 0)" },
  },
  custom: {
    gradient:
      "linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%)",
  },
});

export default theme;

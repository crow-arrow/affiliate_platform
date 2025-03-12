// theme.js
import { createTheme } from "@mui/material/styles";
// import { dark } from "@mui/material/styles/createPalette";

const theme = createTheme({
    palette: {
        primary: {
            main: "#d8b21d",
            light: "#e0c060",
            dark: "#b09119",
            contrastText: "#f1f1f1",
        },
        secondary: {
            main: "#13283c",
        },
        background: { default: 'rgb(245, 241, 237, 0.7)',}
    },
});

export default theme;
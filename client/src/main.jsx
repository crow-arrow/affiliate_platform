import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { ThemeProvider } from "@mui/material/styles"
import theme from "./data_grid_theme/theme.js"
import CssBaseline from "@mui/material/CssBaseline"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
)

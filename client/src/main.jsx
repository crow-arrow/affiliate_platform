import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./AppProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AppProvider />
    </Provider>
  </BrowserRouter>
);

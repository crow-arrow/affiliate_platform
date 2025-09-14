import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import Root from "./Root.jsx"; // это бывший AppProvider, только без BrowserRouter

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);

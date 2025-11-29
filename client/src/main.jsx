import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { setupInterceptors } from "./utils/axios.js"; // Импортируем функцию
import Root from "./Root.jsx";

setupInterceptors(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./global.css";

import { store } from "./redux/store";
import { setupInterceptors } from "./utils/axios";
import Root from "./Root";

setupInterceptors(store);

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);

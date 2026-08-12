import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import { createAppStore } from "./store/store.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import "./index.css";

export function render(url, preloadedState = {}) {
  const store = createAppStore(preloadedState);
  const helmetContext = {};
  let html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <Provider store={store}>
          <App />
          <Toaster position="top-right" />
        </Provider>
      </StaticRouter>
    </HelmetProvider>,
  );

  // React 19 hoists document metadata during SSR. react-helmet-async still
  // manages SPA navigations; this fallback collects React 19's rendered tags.
  const headTags = html.match(/<title[^>]*>[\s\S]*?<\/title>|<meta\s[^>]*\/?\s*>|<link\s[^>]*\/?\s*>/gi) || [];
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>|<meta\s[^>]*\/?\s*>|<link\s[^>]*\/?\s*>/gi, "");

  return { html, head: headTags.join("\n"), helmet: helmetContext.helmet, state: store.getState() };
}

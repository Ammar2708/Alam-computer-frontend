import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { createAppStore } from "./store/store"
import { Toaster } from "@/components/ui/sonner"
import { HelmetProvider } from "react-helmet-async"

const store = createAppStore(window.__PRELOADED_STATE__)

hydrateRoot(document.getElementById('root'),
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster position="top-right" />
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

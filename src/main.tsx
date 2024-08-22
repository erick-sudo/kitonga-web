import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AppProvider from "./context/AppContext.tsx";
// import "primereact/resources/themes/tailwind-light/theme.css"
import "primereact/resources/themes/lara-light-teal/theme.css"

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </PrimeReactProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

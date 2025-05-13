import React from "react";
import ReactDOM from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./auth/AuthContext";
import config from "./config";

//----- Stripe Configuration -----
const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

const options = {
  mode: "payment",
  amount: 10000,
  currency: "usd",
  appearance: {
    theme: "stripe",
  },
  loader: "auto",
  automaticPaymentMethods: {
    enabled: true,
  },
};

//----- Main React Root -----//
const root = ReactDOM.createRoot(document.getElementById("root"));

//----- Main Query Client -----//
const queryClient = new QueryClient();

//----- Main React Render -----//
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Elements stripe={stripePromise} options={options}>
              <App />
            </Elements>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

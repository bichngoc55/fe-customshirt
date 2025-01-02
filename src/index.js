import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./redux/store";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "thirdweb/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThirdwebProvider>
      <MetaMaskProvider
        sdkOptions={{
          dappMetadata: {
            name: "Custom T-shirt DOMDOM website",
            url: window.location.href,
          },
          infuraAPIKey: process.env.INFURA_API_KEY,
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </MetaMaskProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);

reportWebVitals();

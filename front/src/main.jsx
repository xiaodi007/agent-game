import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@mysten/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider, lightTheme } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { getFullnodeUrl } from '@mysten/sui/client';

const queryClient = new QueryClient();
const networks = {
  // custom: { url: "https://fullnode.testnet.sui.io/" },
  custom: { url: "https://rpc-testnet.suiscan.xyz/" },
  // custom: { url: "https://sui-testnet-endpoint.blockvision.org"},
};


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="custom">
        <WalletProvider
          theme={lightTheme}
          autoConnect={true}
          storage={localStorage}
          storageKey="sui-wallet"
          preferredWallets={["Sui Wallet"]}
          stashedWallet={{
            name: "Bucket Protocol",
          }}
        >
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

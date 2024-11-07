import { InjectedConnector } from "@web3-react/injected-connector";
import { useMoralis } from "react-moralis";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const useWalletConnect = () => {
  const { activate, deactivate, account } = useMoralis();

  const connect = async () => {
    try {
      await activate(injectedConnector);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return { connect, disconnect, account };
};

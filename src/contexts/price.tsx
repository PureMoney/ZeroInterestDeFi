import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useConnection } from "./connection";
import { Connection, PublicKey } from "@solana/web3.js";
import { parsePriceData } from "@pythnetwork/client";
import { ENV, useConnectionConfig } from "./connection";

/**
 * Interface for the SOL price to USD
 */
interface PriceConfig {
  solUsdPrice: number;
  updateSolPrice: () => void;
}

/**
 * Create the context for the price
 */
const PriceContext = React.createContext<PriceConfig>({
  solUsdPrice: 0,
  updateSolPrice: () => {},
});

// This is a map of the program addresses of the
// price account for each provider
// TODO: Change to appropriate addresses
const PricePrograms = {
  "mainnet-beta": "",
  testnet: "",
  devnet: "HffCRbY8sq5YVVdYZ3m2KJDNQ2mN1kxJ5iPFqxrNwDKf",
  localnet: "",
};

/**
 * Async function that requests the price account for the updated
 * SOL value
 *
 * @param env {ENV} either mainnet / test net / dev net
 * @param connection {Connection} object
 * @param setSolUsdPrice Setter of the solUsdPrice
 */
const updateSolPrice = (
  env: ENV,
  connection: Connection,
  setSolUsdPrice: Dispatch<SetStateAction<number>>
) => {
  // Get the correct program address based on the current env set
  const pubKey = PricePrograms[env];
  // Do not proceed if there is neither connection nor program address
  if (!connection || !pubKey) {
    return;
  }
  // Perform the price retrieval by getting the data of the price account
  connection.getAccountInfo(new PublicKey(pubKey)).then((accountInfo) => {
    const data = accountInfo?.data;
    if (data) {
      const buffer = Buffer.from(data);
      const priceData = parsePriceData(buffer);
      setSolUsdPrice(priceData.price);
    }
  });
};

/**
 * Create Price provider
 * @returns {PriceContext.Provider}
 */
export function PriceProvider({ children = undefined as any }) {
  // Create hooks for the SOL USD price
  const [solUsdPrice, setSolUsdPrice] = useState(0);

  // Get the connection object from the context
  const connection = useConnection();

  // Get the current configuration set
  const env = useConnectionConfig().env;

  // Perform updating of sol price every after render
  useEffect(() => {
    updateSolPrice(env, connection, setSolUsdPrice);
  }, [env, connection, setSolUsdPrice]);

  return (
    <PriceContext.Provider
      value={{
        solUsdPrice,
        updateSolPrice: () => {
          updateSolPrice(env, connection, setSolUsdPrice);
        },
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

/**
 * Use this method to get the current price
 * @returns Price of SOL in USD as number
 */
export function usePrice() {
  return useContext(PriceContext).solUsdPrice;
}

/**
 * Use this method to update the current price of sol
 * @returns Method for updating SOL
 */
 export function useUpdatePrice() {
  return useContext(PriceContext).updateSolPrice;
}

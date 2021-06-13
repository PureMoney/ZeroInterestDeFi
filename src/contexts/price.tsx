import React, { useContext, useEffect, useState } from "react";
import { useConnection } from "./connection";
import { PublicKey } from "@solana/web3.js";
import { parsePriceData } from "@pythnetwork/client";
import { useConnectionConfig } from "./connection";

/**
 * Interface for the SOL price to USD
 */
interface PriceConfig {
  solUsdPrice: number;
}

/**
 * Create the context for the price
 */
const PriceContext = React.createContext<PriceConfig>({
  solUsdPrice: 0,
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
 * Create Price provider
 * @returns {PriceContext.Provider}
 */
export function PriceProvider({ children = undefined as any }) {
  // Create hooks for the SOL USD price
  const [solUsdPrice, setSolUsdPrice] = useState(0);

  // Get the connection object from the context
  const connection = useConnection();

  // Get the current configuration set
  const config = useConnectionConfig();

  // Fetch the current price of SOLD in USD
  useEffect(() => {
    // Get the correct program address based on the current env set
    const pubKey = PricePrograms[config.env];
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
  });
  return (
    <PriceContext.Provider
      value={{
        solUsdPrice,
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

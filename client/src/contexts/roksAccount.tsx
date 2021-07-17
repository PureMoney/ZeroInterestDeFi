import React, {
  useContext,
  useState,
} from "react";
import { useConnectionConfig } from "./connection";

/**
 * Interface for handling all the zerodefi token accounts of the user
 */
interface RoksAccount {
  vttBalance: number;
  updateVttBalance: (balance: number) => void;
}

/**
 * Create the context for the zero defi accounts
 */
const RoksAccountContext = React.createContext<RoksAccount>({
  vttBalance: 0,
  updateVttBalance: (balance) => {},
});

// This is the mint address depending on the environment
// TODO: Change to appropriate addresses
const VttMintAddress = {
  "mainnet-beta": "",
  testnet: "",
  devnet: "4m3TqQy4Vp4VLp9Bq4FJyWsfxRsU5nNutF2rRQf9QxW5",
  localnet: "",
};

/**
 * Create Roks Account provider
 * @returns {RoksAccountContext.Provider}
 */
export function RoksAccountProvider({ children = undefined as any }) {
  // Create hooks for the VTT balance
  const [vttBalance, setVttBalance] = useState(0);

  return (
    <RoksAccountContext.Provider
      value={{
        vttBalance,
        updateVttBalance: (balance) => setVttBalance(balance),
      }}
    >
      {children}
    </RoksAccountContext.Provider>
  );
}

/**
 * Use this method to get the current vtt balance
 * @returns Current VTT account by the user
 */
export function useVttBalance() {
  return useContext(RoksAccountContext).vttBalance;
}

/**
 * Use this method to update the VTT balance
 * @returns Method for updating vtt balance
 */
export function useUpdateVttBalance() {
  return useContext(RoksAccountContext).updateVttBalance;
}

/**
 * Use this method to get the vtt mint address
 * @returns Vtt mint address depending on the environment
 */
export function useVttMintAddress() {
  const env = useConnectionConfig().env;
  return VttMintAddress[env];
}

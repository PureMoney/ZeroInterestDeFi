/**
 * Get SOL price from Pyth oracle
 */
import Properties from "../properties";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

let provider = null;
let program = null;

// Extract the values from the properties file
const {
  BASE_API_URL,
  PYTH_PRODUCT_KEY,
  PYTH_SOL_PRICE_PROG_KEY,
  PRICE_ACCOUNT_KEY,
} = Properties;

// Create the public key for each relevant account
const priceAcctKey = new PublicKey(PRICE_ACCOUNT_KEY);
const pythnProductInfoKey = new PublicKey(PYTH_PRODUCT_KEY);
const pythPriceInfoKey = new PublicKey(PYTH_SOL_PRICE_PROG_KEY);

const PythController = {
  /**
   * Init routes
   */
  init: router => {
    // Extract provider from the env variable
    // ANCHOR_PROVIDER_URL
    provider = anchor.Provider.env();

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    // Connect to the Pyth oracle program
    program = anchor.workspace.Pyth;

    // Register router
    router.get(BASE_API_URL + "/refresh-price", PythController.updateSolPrice);
  },

  /**
   * Update SOL price from Pyth oracle
   * @param {Object} req Http Request object
   * @param {Object} res Http Response object
   */
  updateSolPrice: async (req, res) => {
    // Execute the RPC.
    await program.rpc.getPrice({
      accounts: {
        myAccount: priceAcctKey,
        pythProductInfo: pythnProductInfoKey,
        pythPriceInfo: pythPriceInfoKey
      }
    });
    // Return success
    res.json("Success");
  }
};

export default PythController;

// Get SOL price from Pyth oracle
// Properties
import Properties from "../properties";

// Logging
import Logger from "../classes/Logger";

// Solana anchor
const anchor = require("@project-serum/anchor");
// const serumCmn = require("@project-serum/common");
// const spl = require("@solana/spl-token");
// const REWARD_TOKEN_MINT = new anchor.web3.PublicKey("8LqpxvoA6pmXMoxDEYVmNTMvawLZLL6dkzFstDK1B9eb");

// Errors
import ErrorManager from "../classes/ErrorManager";
// import Errors from "../classes/Errors";

let provider = null;
let program = null;
let myAccount = null;

Logger.info("PythController");

const pythController = {
  /**
   * Init routes
   */
  init: router => {
    Logger.info("PythController.init");

    // Use a local or env provider.
    provider = anchor.Provider.env();

    // Logger.info('provider = ', provider);

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    // connect to the Pyth oracle program
    program = anchor.workspace.Pyth;

    // create new account whenever init occurs
    myAccount = anchor.web3.Keypair.generate();

    // call pyth init routine
    pythController.pythInit();
    Logger.info("pythInit started")

    const baseUrl = `${Properties.api}`;
    // router.post(baseUrl + "/pyth-init", pythController.pythInit);
    router.get(baseUrl + "/get-sol-price", pythController.getSOLprice);
  },

  /**
   * Initialization function
   *
   */
  pythInit: async () => {
    try {
      Logger.info("pythInit start");
      await program.rpc.initialize({
        accounts: {
          myAccount: myAccount.publicKey,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [myAccount],
        instructions: [
          anchor.web3.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: myAccount.publicKey,
            space: 8 + 300, // Add 8 for the account discriminator.
            lamports: await provider.connection.getMinimumBalanceForRentExemption(
              8 + 300
            ),
            programId: program.programId,
          }),
        ],
      });
      Logger.info("pythInit done, myAccount = ", myAccount.publicKey);
    } catch (err) {
      const safeErr = ErrorManager.getSafeError(err);
      Logger.error(safeErr.message);
    }
  },

  // Get SOL price from Pyth oracle
  // Inputs: none
  getSOLprice: async (req, res) => {
    Logger.info("getSOLprice, req.headers", req.headers);

    const pythProdKey = new anchor.web3.PublicKey("8yrQMUyJRnCJ72NWwMiPV9dNGw465Z8bKUvnUC8P5L6F");
    const pythSOLPriceProgKey = new anchor.web3.PublicKey("BdgHsXrH1mXqhdosXavYxZgX6bGqTdj5mh2sxDhF8bJy");

    // Execute the RPC.
    // #region code-separated
    await program.rpc.getPrice({
      accounts: {
        myAccount: myAccount.publicKey,
        pythProductInfo: pythProdKey,
        pythPriceInfo: pythSOLPriceProgKey
      }
    });

    const accountInfo = await provider.connection.getAccountInfo(myAccount.publicKey);
    Logger.info('data = ', accountInfo);

    res.json(accountInfo);
  }
};

export default pythController;

// Get SOL price from Pyth oracle
// Properties
import Properties from "../properties";

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

console.log("PythController");

const pythController = {
  /**
   * Init routes
   */
  init: router => {
    console.log("PythController.init");

    // Use a local or env provider.
    provider = anchor.Provider.env();

    // console.log('provider = ', provider);

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    // connect to the Pyth oracle program
    program = anchor.workspace.Pyth;

    // create new account whenever init occurs
    myAccount = anchor.web3.Keypair.generate();

    // call pyth init routine
    pythController.pythInit();
    console.log("pythInit started")

    const baseUrl = `${Properties.api}`;
    // router.post(baseUrl + "/pyth-init", pythController.pythInit);
    router.post(baseUrl + "/get-sol-price", pythController.getSOLprice);
  },

  /**
   * Initialization function
   *
   */
  pythInit: async () => {
    try {
      console.log("pythInit start");
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
            space: 8 + 1704, // Add 8 for the account discriminator.
            lamports: await provider.connection.getMinimumBalanceForRentExemption(
              8 + 1704
            ),
            programId: program.programId,
          }),
        ],
      });
      console.log("pythInit done, myAccount = ", myAccount.publicKey);
    } catch (err) {
      const safeErr = ErrorManager.getSafeError(err);
      console.error(safeErr.message);
    }
  },

  getSOLprice: async (req, res) => {}
};

export default pythController;

/**
 * Get SOL price from Pyth oracle
 */
import Properties from "../properties";
import * as anchor from "@project-serum/anchor";
const serumCmn = require("@project-serum/common");
const spl = require("@solana/spl-token");

let provider = null;
let program = null;
let walletKey = null;

// These are in devnet only
const tokenAccount = new anchor.web3.PublicKey("66toRwKMVFGBLrwWzc4yTBfZj1SWvENxSBqxD1Hq3iZy");
const REWARD_TOKEN_MINT = new anchor.web3.PublicKey("4m3TqQy4Vp4VLp9Bq4FJyWsfxRsU5nNutF2rRQf9QxW5");

// Extract the values from the properties file
const {
  BASE_API_URL,
} = Properties;

const StakeController = {
  /**
   * Init routes
   */
  init: router => {
    // Extract provider from the env variable
    // ANCHOR_PROVIDER_URL
    provider = anchor.Provider.env();

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    // Connect to the reward staking program
    program = anchor.workspace.RewardTokenStaking;

    walletKey = new anchor.web3.PublicKey(program.provider.wallet.publicKey);

    // Register router
    router.post(BASE_API_URL + "/stake", StakeController.doStake);
    router.post(BASE_API_URL + "/unstake", StakeController.doUnstake);
  },

  /**
   * Perform the reward token staking
   *
   * @param {Object} req Http Request object
   * @param {Object} res Http Response object
   */
  doStake: async (req, res) => {
    try {
      // Create data account
      const dataAccount = anchor.web3.Keypair.generate();

      // Create a key pair for the vault
      const vault = anchor.web3.Keypair.generate();

      // Get the check signer and nonce
      const [_checkSigner, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [dataAccount.publicKey.toBuffer()],
        program.programId
      );
      const checkSigner = _checkSigner;
      const nonce = _nonce;

      // Convert the amount to the correct value
      const stakeAmount = req.body.amount * 1000000000;

      // Perform the stake request
      await program.rpc.stake(new anchor.BN(stakeAmount), "Zero Interest", nonce, {
        accounts: {
          dataAccount: dataAccount.publicKey,
          vault: vault.publicKey,
          checkSigner,
          from: tokenAccount,
          owner: walletKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [dataAccount, vault],
        instructions: [
          await program.account.stake.createInstruction(dataAccount, 300),
          ...(await serumCmn.createTokenAccountInstrs(
            program.provider,
            vault.publicKey,
            REWARD_TOKEN_MINT,
            checkSigner
          )),
        ],
      });

      // Return the vault and data account public keys
      res.json({
        vault: vault.publicKey.toBase58(),
        dataAccount: dataAccount.publicKey.toBase58(),
      });

    } catch (error) {
      // Log the error if it happens
      console.error(error);

      // Return status 500
      res.status(500);
      res.json("Staking failed. " + error.toString());
    }
  },

  doUnstake: async (req, res) => {
    try {
      // Extract the public keys of both the vault and the data account
      const { vault, dataAccount } = req.body;
      const dataAccountPubKey = await new anchor.web3.PublicKey(dataAccount);
      const vaultPubKey = await new anchor.web3.PublicKey(vault);

      // Get the check signer
      const [_checkSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [dataAccountPubKey.toBuffer()],
        program.programId
      );
      const checkSigner = _checkSigner;

      // Perform the unstake function in the blockchain
      await program.rpc.unstake({
        accounts: {
          dataAccount: dataAccountPubKey,
          vault: vaultPubKey,
          checkSigner,
          from: tokenAccount,
          owner: walletKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        },
      });

      res.json("Unstaking success");
    } catch (error) {
      // Log the error if it happens
      console.error(error)
      res.status(500);
      res.json("Unstaking failed. " + error.toString());
    }
  }
};

export default StakeController;

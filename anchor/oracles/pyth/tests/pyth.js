const assert = require("assert");
const anchor = require("@project-serum/anchor");

describe("Pyth Tests on Node", () => {
  // Use a local provider.
  const provider = anchor.Provider.env(); //.local();

  // console.log('provider = ', provider);

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // The signing Account.
  const myAccount = anchor.web3.Keypair.generate(); // .Wallet.local().payer;

  it("Initialize Pyth", async () => {
    // The program owning the account to create.
    const program = anchor.workspace.Pyth;

    // Atomically create the new account and initialize it with the program.
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

    assert.ok(true);
  });

  it("Get SOL Price", async() => {
    // The program owning the account to create.
    const program = anchor.workspace.Pyth;

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
    console.log('data = ', accountInfo.data);

    assert.ok(accountInfo.data);
    // #endregion code-separated
  });
});

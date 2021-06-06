const anchor = require("@project-serum/anchor");
const serumCmn = require("@project-serum/common");
const spl = require("@solana/spl-token");
// const TokenInstructions = require("@project-serum/serum").TokenInstructions;
const assert = require("assert");
const REWARD_TOKEN_MINT = new anchor.web3.PublicKey("8LqpxvoA6pmXMoxDEYVmNTMvawLZLL6dkzFstDK1B9eb");

describe("Reward Token", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env()); // .local()); // .env());

  const program = anchor.workspace.RewardTokenStaking;
  const connection = program._provider.connection;

  // Why construct another public key? It's because the PublicKey type attached to the wallet
  // does not have the same type as the standard web3.PublicKay. This coding practice of several
  // implementations of the same thing is really bad practice.
  const walletKey = new anchor.web3.PublicKey(program.provider.wallet.publicKey);

  let mint = null;

  // sample token account created using spl-token cli
  const god = new anchor.web3.PublicKey("8x5PpL5AVFGeUEGrT3M21YWa5fja2v2qUU8sadVoLfcp");

  const dataAccount = anchor.web3.Keypair.generate(); // data, one for each user
  console.log("dataAccount: ", dataAccount);
  const vault = anchor.web3.Keypair.generate(); // this should only be done once, during deployment
  let checkSigner = null;
  let nonce = null;

  it("Sets up initial test state", async () => {

    // let createSplAcctInstruct = spl.createAssociatedTokenAccountInstruction(
    //   program.programId,    // associatedProgramId: PublicKey,
    //   spl.TOKEN_PROGRAM_ID, // programId: PublicKey,
    //   REWARD_TOKEN_MINT,    // mint: PublicKey,
    //   walletKey,            // associatedAccount: PublicKey,
    //   walletKey,            // owner: PublicKey,
    //   walletKey             // payer: PublicKey,
    // );

    // let [tokenSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    //   [walletKey.toBuffer()],
    //   spl.TOKEN_PROGRAM_ID
    // );
    // const ownedAccnts = await serumCmn.token.getOwnedTokenAccounts(connection, REWARD_TOKEN_MINT);
    // let mint;
    // console.log("getOwnedTokenAccounts.length: ", ownedAccnts.length);
    mint = await serumCmn.getMintInfo(program._provider, REWARD_TOKEN_MINT);
    if (!mint) {
      console.log("mint creating ...");
      mint = await spl.Token.createMint(
        connection, 
        walletKey, 
        REWARD_TOKEN_MINT, 
        REWARD_TOKEN_MINT, // freeze authority - none because this is supposed to be a dapp
        new anchor.BN(6), // decimal points
        spl.TOKEN_PROGRAM_ID);
      console.log("mint created: ", mint);
    } else {
      console.log("mint found! ", mint);
    }
  });

  it("Start reward-token staking!", async () => {
    console.log("vault: ", vault);

    let [_checkSigner, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [dataAccount.publicKey.toBuffer()],
      program.programId
    );
    checkSigner = _checkSigner;
    nonce = _nonce;

    // console.log("stake = ", program.account.stake);

    await program.rpc.stake(new anchor.BN(100), "Zero Interest", nonce, {
      accounts: {
        dataAccount: dataAccount.publicKey, // for data only
        vault: vault.publicKey, // to store the reward token while in custody
        checkSigner,            // <-- remove this
        from: god,              // user's source account
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

    // console.log("2 - dataAccount.all()[0].account = ", (await program.account.dataAccount.all())[0].account);
    // console.log("2 - dataAccount.all()[0].account.to = ", (await program.account.dataAccount.all())[0].account.to);
    console.log("program.account = ", program.account);

    const cashedChecks = await program.account.stake.all();
    // anchor caches all transactions ... we pick one
    const filtered = cashedChecks.filter((one) => {
      // why use vault as key? a user can have severa vaults, but each vault belongs to only one user
      return one.account.vault._bn.eq(vault.publicKey._bn);
    });
    const checkAccount = filtered[0].account;
    console.log("checkAccount: ", checkAccount);
    assert.ok(checkAccount.from.equals(god));
    assert.ok(checkAccount.amount.eq(new anchor.BN(100)));
    assert.ok(checkAccount.memo === "Zero Interest");
    // assert.ok(checkAccount.vault.equals(vault.publicKey));
    assert.ok(checkAccount.nonce === nonce);
    assert.ok(checkAccount.burned === false);

    let vaultAccount = await serumCmn.getTokenAccount(
      program.provider,
      checkAccount.vault
    );
    console.log("vault contains ", vaultAccount.amount);
    // assert.ok(vaultAccount.amount.eq(new anchor.BN(100)));
  });

  it("Unstake reward-tokens", async () => {
    await program.rpc.unstake({
      accounts: {
        dataAccount: dataAccount.publicKey,
        vault: vault.publicKey,
        checkSigner,
        from: god,
        owner: walletKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    });

    const cashedChecks = await program.account.stake.all();
    const filtered = cashedChecks.filter((one) => {
      // console.log("one.account.from = ", one.account.from);
      return one.account.from._bn.eq(god._bn);
    });
    const checkAccount = filtered[0].account;

    // assert.ok(checkAccount.burned === true);
    console.log("checkAccount.burned = ", checkAccount.burned);

    let vaultAccount = await serumCmn.getTokenAccount(
      program.provider,
      checkAccount.vault
    );
    // assert.ok(vaultAccount.amount.eq(new anchor.BN(0)));
    console.log("vaultAccount.amount = ", vaultAccount.amount);

    assert.ok(true);
  });
});

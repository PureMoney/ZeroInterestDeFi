import React from "react";
import { useWallet } from "../../contexts/wallet";
import { formatNumber, shortenAddress } from "../../utils/utils";
import { Identicon } from "../Identicon";
import { useNativeAccount } from "../../contexts/accounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletOutlined } from "@ant-design/icons";
import { useMint, useAccountByMint } from "../../contexts/accounts";
import {
  useVttMintAddress,
  useUpdateVttBalance,
} from "../../contexts/roksAccount";

export const CurrentUserBadge = (props: {}) => {
  const { wallet } = useWallet();
  const { account } = useNativeAccount();
  const mintAddress = useVttMintAddress();
  const tokenMint = useMint(mintAddress);
  const tokenAccount = useAccountByMint(mintAddress);
  const updateVttBalance = useUpdateVttBalance();

  let vttBalance: number = 0;
  if (tokenAccount && tokenMint) {
    vttBalance =
      tokenAccount.info.amount.toNumber() / Math.pow(10, tokenMint.decimals);
  }
  updateVttBalance(vttBalance);

  if (!wallet?.publicKey) {
    return null;
  }

  return (
    <div className="wallet-wrapper">
      <span className="header-balance">
        <WalletOutlined />
      </span>
      <span className="header-balance">
        {formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} SOL
      </span>
      <span className="header-balance">420.99 ROKS</span>
      <span className="header-balance">{formatNumber.format(vttBalance)} VTT</span>
      <div className="wallet-key">
        {shortenAddress(`${wallet.publicKey}`)}
        <Identicon
          address={wallet.publicKey.toBase58()}
          style={{ marginLeft: "0.5rem", display: "flex" }}
        />
      </div>
    </div>
  );
};

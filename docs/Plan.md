# Plan

## Milestone 1 : Set up coins

1. ROKS Minting account (to create a coin) SPL
2. VTT Minting account (initial supply) SPL

Deliverable:
    - Code / Instructions to set this up locally
    - Private keyspairs to the SPL token accounts

## Milestone 2 : Borrow

1. Deposit SOL
2. SC: Mint ROKS & Transfer to (Receive) wallet 90.9%
3. 200 ROKS is set aside for Liquiditation Reserve

## Milestone 3 : Set up Stability Pool

1. Stake Stability Pool : ROKS (I am the same person that borrowed)
2. Unstake
3. Interface to Pyth oracle for retrieving SOL exchange rate

## Milestone 4 : Liquidation

1. Can Liquidate a borrower
2. SOL is sent to Stability Pool depositors
3. ROKS is burned
4. 200 ROKS + 0.5% fee is sent to Liquidator

## Mileston 5: Redemption
1. Redeemer redeems 500 ROKS
2. Redeemer receives SOL
4. Redeemer loses redemption fee
3. Trove loses SOL, decreases debt in ROKS

## Milestone 6: Rewards
1. Stake VTT, unstake VTT
2. Show list of stakers of VTT
3. Calculate the TVL
4. Send rewards to early stakers (TBC)

## How to get started
1. Repo: Create a testnet locally
2. Repo: Launches the Liquity UI
3. Liquity Frontent UI : Connect to Phantom/Sollet wallet
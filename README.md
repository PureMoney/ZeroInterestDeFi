# ZeroInterestDeFi
A port of Liquity to Solana, in Rust

Assume that the network is devnet.
# How to build
## Install Tools
1. Install the latest Rust stable from https://rustup.rs/;
2. Install Solana SDK;
3. Install Solana CLI (v1.6.8):
```
sh -c "$(curl -sSfL https://release.solana.com/v1.6.9/install)"
```

4. Install node js (latest version);
5. Install yarn.

## Install node js components (root folder)
```
yarn
```

# Build smart contracts
## First, check configuration
```
solana config get
```
`Should output:`

`Config File: /home/<yourname>/.config/solana/cli/config.yml`

`RPC URL: https://api.devnet.solana.com`

`WebSocket URL: wss://api.devnet.solana.com/ (computed)`

`Keypair Path: /home/<yourname>/.config/solana/id.json`

`Commitment: confirmed`

# Solana program build and deployment
(See also README.md in the program folder.)
```
cd program
cargo build-bpf
```

## Get your address and passphrase, taking note of seed / passphrase
```
solana-keygen new --no-passphrase --no-outfile
solana address
```

## Get devnet SOL using Solana CLI
```
solana airdrop 1 <your Solana personal address as output by solana address>
solana balance
```

## Deploy
```
solana program deploy <path to elf as output by cargo build-bpf>
```

## Run tests
```
cargo test-bpf
```

# UI build
```
cd ..
yarn build
```

## Start UI
```
yarn start
```


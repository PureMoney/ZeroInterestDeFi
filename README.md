# ZeroInterestDeFi
A port of Liquity to Solana, in Rust

# Assume that that network is devnet.
# How to build
1. Install Rust compiler;
2. Install Solana SDK;
3. Install Solana CLI (v1.6.8);
cargo install spl-token-cli

4. Install node js (latest version);
5. Install yarn.

# Install node js components (root folder)
yarn

# Build smart contracts
# First, check configuration
solana config get
# Should output:
# Config File: /home/<yourname>/.config/solana/cli/config.yml
# RPC URL: https://api.devnet.solana.com
# WebSocket URL: wss://api.devnet.solana.com/ (computed)
# Keypair Path: /home/<yourname>/.config/solana/id.json
# Commitment: confirmed

cd program
cargo build-bpf

# Get devnet SOL using Solana CLI
solana airdrop 1 <your Solana personal address>

# Run tests
cargo test-bpf

# Complete UI build
yarn build

# Start UI
yarn start



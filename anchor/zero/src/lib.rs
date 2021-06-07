use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::sol_to_lamports;
pub use spl_token::ID;
use std::ops::DerefMut;

mod error;
mod handler_borrow_stablecoin;
mod handler_deposit_collateral;
mod handler_initialize_market;
mod handler_initialize_trove;
mod math;
mod pda;

#[program]
pub mod zero {
    use anchor_spl::token::{self, MintTo};

    use super::*;
    pub fn initialize_market(ctx: Context<InitializeMarket>) -> ProgramResult {
        handler_initialize_market::process(ctx)
    }

    pub fn initialize_trove(ctx: Context<InitializeTrove>) -> ProgramResult {
        handler_initialize_trove::process(ctx)
    }

    pub fn deposit_collateral(ctx: Context<DepositCollateral>, amount: u64) -> ProgramResult {
        handler_deposit_collateral::process(ctx, amount)
    }

    pub fn borrow_stablecoin(ctx: Context<BorrowStable>, amount: u64) -> ProgramResult {
        handler_borrow_stablecoin::process(ctx, amount)
    }

    pub fn debug(ctx: Context<DebugAcc>) -> ProgramResult {
        Ok(())
    }
}

/// todo: initialize Stability Pool
#[derive(Accounts)]
pub struct DebugAcc<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,

    // Global state
    #[account(init)]
    pub global_state: ProgramAccount<'info, GlobalStateData>,

    // Where all the borrowing fees are directed
    #[account(init)]
    pub borrowing_fees_pot: AccountInfo<'info>,

    // Where all the borrowing fees are directed
    #[account(init)]
    pub stability_pool: AccountInfo<'info>,

    // Stablecoin account from which we mint/burn stablecoin
    #[account(mut)]
    pub stablecoin_mint: AccountInfo<'info>,

    // Source of stablecoin mint
    pub token_program: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Debug)]
pub struct GlobalStateData {
    pub version: u8,

    // Global admin (not sure what to do about this yet)
    pub initial_market_owner: Pubkey,

    // Should be SPL Token Program really
    pub token_program_id: Pubkey,

    // SOL Account where fees are sent, (owned by program seed)
    pub borrowing_fees_receiver: Pubkey,

    // Stablecount Account where deposits are sent, (owned by program seed)
    pub stability_pool: Pubkey,

    // Account from which stablecoin is minted (owned by program PDA)
    pub stablecoin_mint: Pubkey,

    // Authority which can MINT tokens out of stablecoin_mint
    pub stablecoin_mint_authority: Pubkey,

    // State
    pub stablecoin_borrowed: u64,
    pub deposited_sol: u64,
    pub base_rate: u64,

    // Constants
    pub required_mcr: u64,
}

#[derive(Accounts)]
pub struct InitializeTrove<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,

    // Global state
    #[account(init)]
    pub trove: ProgramAccount<'info, TroveData>,

    // Where SOL will be locked
    pub deposit_sol_collateral_account: AccountInfo<'info>,
    // Where stablecoin will be minted (borrowed)
    pub stablecoin_borrowing_associated_account: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Debug)]
pub struct TroveData {
    pub version: u8,

    // user
    pub owner: Pubkey,

    // SOL Account where fees are sent, (owned by program PDA)
    pub deposit_sol_collateral_account: Pubkey,

    // Account from which stablecoin is minted (owned by program PDA)
    pub stablecoin_borrowing_associated_account: Pubkey,

    // State
    pub stablecoin_borrowed: u64,
    pub deposited_sol: u64,
    pub at_base_rate: u64,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut, signer)]
    pub owner: AccountInfo<'info>,

    // Global state
    #[account(mut)]
    pub global_state: ProgramAccount<'info, GlobalStateData>,

    // Trove state
    #[account(mut)]
    pub trove: ProgramAccount<'info, TroveData>,

    // Where SOL will be locked
    #[account(mut)]
    pub deposit_sol_collateral_account: AccountInfo<'info>,

    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BorrowStable<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,

    // Global state
    #[account(mut)]
    pub global_state: ProgramAccount<'info, GlobalStateData>,

    // Global state
    #[account(mut)]
    pub trove: ProgramAccount<'info, TroveData>,
    // Stablecoin account from which we mint/burn stablecoin
    #[account(mut)]
    pub stablecoin_mint: AccountInfo<'info>,

    // Where stablecoin will be minted (borrowed)
    #[account(mut)]
    pub stablecoin_borrowing_associated_account: AccountInfo<'info>,

    // Source of stablecoin mint
    pub token_program: AccountInfo<'info>,

    // Source of stablecoin mint PDA authority (authority to which minting rights have been transferred)
    pub stablecoin_mint_authority_pda: AccountInfo<'info>,
}

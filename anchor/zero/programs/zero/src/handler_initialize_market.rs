use crate::pda;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, SetAuthority, TokenAccount, Transfer};
use std::ops::DerefMut;

pub fn process(ctx: Context<crate::InitializeMarket>) -> ProgramResult {
    msg!("Initializing market!");

    // 1. Borrowing fees account is handed over to PDA -- not, owned by program
    // Todo: maybe also need to add "burn"
    // 2. Stablecoin Mint Authority is handed over to PDA
    // 3. TODO: Stability Pool account Onwership is handed over to PDA
    // 4. Initialize Global State

    let owner = &ctx.accounts.owner;

    let stablecoin_mint = &ctx.accounts.stablecoin_mint;
    let borrowing_fees_account = &ctx.accounts.borrowing_fees_pot;
    let token_program = &ctx.accounts.token_program;

    // 1. Borrowing fees account is handed over to PDA
    // Correction: borrowing fees account is already owned by the program, derived with
    // "borrowing_fee" seed
    // utils_initialize_market::transfer_borrowing_fees_account_ownership_to_pda(&ctx);

    // 2. Stablecoin Mint Authority is handed over to PDA
    let pda_mint_stable_auth = utils::transfer_stablecoin_mint_account_mint_authority_to_pda(&ctx);

    // 4. Initialize Global State
    let global_state = &mut ctx.accounts.global_state;
    global_state.version = 0;
    global_state.token_program_id = *token_program.to_account_info().key;
    global_state.stablecoin_mint = *stablecoin_mint.to_account_info().key;
    global_state.initial_market_owner = *owner.to_account_info().key;
    global_state.borrowing_fees_receiver = *borrowing_fees_account.to_account_info().key;
    global_state.stablecoin_mint_authority = pda_mint_stable_auth;
    global_state.stablecoin_borrowed = 0;
    global_state.deposited_sol = 0;
    global_state.base_rate = crate::math::decimal_to_u8(0.005);
    global_state.required_mcr = crate::math::decimal_to_u8(1.10);

    msg!("Global Account {:?}", (global_state.deref_mut()));

    Ok(())
}

impl<'a, 'b, 'c, 'info> crate::InitializeMarket<'info> {
    pub fn to_borrowing_cpi_context(&self) -> CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.borrowing_fees_pot.clone(),
            current_authority: self.owner.clone(),
        };
        let cpi_program = self.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> crate::InitializeMarket<'info> {
    pub fn to_stablecoinmint_cpi_context(
        &self,
    ) -> CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.stablecoin_mint.to_account_info().clone(),
            current_authority: self.owner.clone(),
        };
        let cpi_program = self.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

mod utils {
    use super::*;
    pub fn transfer_borrowing_fees_account_ownership_to_pda(
        ctx: &Context<crate::InitializeMarket>,
    ) {
        let borrowing_fees_authority_pda_pubkey = pda::make_pda_pubkey(
            pda::PDA::BorrowingFeesAccount {
                initial_market_owner: ctx.accounts.owner.to_account_info().key.clone(),
            },
            ctx.program_id,
        );

        let borrow_set_authority_res = token::set_authority(
            ctx.accounts.to_borrowing_cpi_context(),
            spl_token::instruction::AuthorityType::AccountOwner,
            Some(borrowing_fees_authority_pda_pubkey),
        );
        msg!(
            "Setting Borrow Authority To {} result: {:?}",
            borrowing_fees_authority_pda_pubkey,
            borrow_set_authority_res
        );
    }

    pub fn transfer_stablecoin_mint_account_mint_authority_to_pda(
        ctx: &Context<crate::InitializeMarket>,
    ) -> Pubkey {
        let stablecoin_mint_authority_pda_pubkey = pda::make_pda_pubkey(
            pda::PDA::StablecoinMint {
                initial_market_owner: ctx.accounts.owner.to_account_info().key.clone(),
            },
            ctx.program_id,
        );

        let borrow_set_authority_res = token::set_authority(
            ctx.accounts.to_stablecoinmint_cpi_context(),
            spl_token::instruction::AuthorityType::MintTokens,
            Some(stablecoin_mint_authority_pda_pubkey),
        );
        msg!(
            "Setting Stablecoin Mint Authority To {} result: {:?}",
            stablecoin_mint_authority_pda_pubkey,
            borrow_set_authority_res
        );

        stablecoin_mint_authority_pda_pubkey
    }
}

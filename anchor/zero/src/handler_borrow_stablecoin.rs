use crate::pda;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, SetAuthority, TokenAccount, Transfer};
use std::ops::DerefMut;

pub fn process(ctx: Context<crate::BorrowStable>, amount: u64) -> ProgramResult {
    // TODO: send fee to fees pot
    // TODO: get oracle price

    let trove = &ctx.accounts.trove;

    let sol_to_stablecoin_price = 40.0;
    let min_collateral_ratio = 1.1; // 110%
    let borrowing_fee = 0.005; // 0.5%

    let deposited_sol = trove.deposited_sol;
    let borrowed_stablecoin = trove.stablecoin_borrowed as f64;

    let deposited_sol_in_stablecoin = (deposited_sol as f64) * sol_to_stablecoin_price;
    let total_allowed_stablecoin_to_withdraw = deposited_sol_in_stablecoin / min_collateral_ratio;

    let available_stablecoin_to_withdraw =
        total_allowed_stablecoin_to_withdraw - borrowed_stablecoin;

    let current_collateral_ratio = if borrowed_stablecoin == 0.0 {
        None
    } else {
        Some(deposited_sol_in_stablecoin / borrowed_stablecoin)
    };

    msg!("SOL to STABLE px {}", sol_to_stablecoin_price);
    msg!(
        "SOL to STABLE px {}
         Deposited SOL {}
         Deposited SOL in Stable {}
         Borrowed STABLE {}
         Current CR {:?}
         Requested STABLE {}
         Available STABLE to withdraw {}",
        sol_to_stablecoin_price,
        deposited_sol,
        deposited_sol_in_stablecoin,
        borrowed_stablecoin,
        current_collateral_ratio,
        amount,
        available_stablecoin_to_withdraw
    );

    if (amount as f64) > available_stablecoin_to_withdraw {
        return Err(crate::error::MyError::NotEnoughCollateral.into());
    }

    // Mint Stablecoin to user
    // Take 0.05% fee from vault and send it to general fee pot

    let mode = pda::PDA::StablecoinMint {
        initial_market_owner: ctx.accounts.owner.to_account_info().key.clone(),
    };
    let stablecoin_mint_authority_pda_seeds = pda::make_pda_seeds(&mode, ctx.program_id);
    let seeds = [
        stablecoin_mint_authority_pda_seeds[0].as_ref(),
        stablecoin_mint_authority_pda_seeds[1].as_ref(),
        stablecoin_mint_authority_pda_seeds[2].as_ref(),
    ];
    let signer = &[&seeds[..]];

    let cpi_mint_accounts = MintTo {
        mint: ctx.accounts.stablecoin_mint.clone(),
        to: ctx.accounts.stablecoin_borrowing_associated_account.clone(),
        authority: ctx.accounts.stablecoin_mint_authority_pda.clone(),
    };
    let cpi_mint_program = ctx.accounts.token_program.clone();
    let cpi_ctx = CpiContext::new(cpi_mint_program, cpi_mint_accounts).with_signer(signer);

    let result = token::mint_to(cpi_ctx, amount);
    msg!("Minted {:?}", result);

    let trove = &mut ctx.accounts.trove;
    trove.stablecoin_borrowed += amount;

    let global_state = &mut ctx.accounts.global_state;
    global_state.stablecoin_borrowed += amount;

    msg!("Trove Data {:?}", (trove.deref_mut()));
    msg!("Global Data {:?}", (global_state.deref_mut()));

    Ok(())
}

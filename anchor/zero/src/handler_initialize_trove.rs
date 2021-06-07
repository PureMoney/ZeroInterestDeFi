use anchor_lang::prelude::*;
use std::ops::DerefMut;

pub fn process(ctx: Context<crate::InitializeTrove>) -> ProgramResult {
    let owner = &ctx.accounts.owner;
    let stablecoin_associated_receiving_account =
        &ctx.accounts.stablecoin_borrowing_associated_account;
    let deposit_sol_collateral_account = &ctx.accounts.deposit_sol_collateral_account;

    let trove = &mut ctx.accounts.trove;
    trove.version = 0;
    trove.owner = *owner.to_account_info().key;
    trove.stablecoin_borrowing_associated_account = *stablecoin_associated_receiving_account
        .to_account_info()
        .key;
    trove.deposit_sol_collateral_account = *deposit_sol_collateral_account.to_account_info().key;
    trove.stablecoin_borrowed = 0;
    trove.deposited_sol = 0;
    trove.at_base_rate = crate::math::decimal_to_u8(0.0);

    msg!("Trove Data {:?}", (trove.deref_mut()));

    Ok(())
}

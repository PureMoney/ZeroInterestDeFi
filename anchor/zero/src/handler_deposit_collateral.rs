use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::sol_to_lamports;
use std::ops::DerefMut;

pub fn process(ctx: Context<crate::DepositCollateral>, amount: u64) -> ProgramResult {
    // TODO: ensure deposit account address == trove_data.deposit_sol address

    let from = &mut ctx.accounts.owner;
    let to = &mut ctx.accounts.deposit_sol_collateral_account;

    let lamports = sol_to_lamports(amount as f64);

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &from.to_account_info().key,
        &to.to_account_info().key,
        lamports,
    );

    let res = anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            from.to_account_info().clone(),
            to.to_account_info().clone(),
            ctx.accounts.system_program.clone(),
        ],
    )?;

    msg!("Result {:?}", res);

    let trove = &mut ctx.accounts.trove;
    trove.deposited_sol += amount;

    let global_state = &mut ctx.accounts.global_state;
    global_state.deposited_sol += amount;

    msg!("Trove Data {:?}", (trove.deref_mut()));
    msg!("Global Data {:?}", (global_state.deref_mut()));

    Ok(())
}

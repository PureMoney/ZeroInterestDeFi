//! The reward-tokens are immediately withdrawn from the user's
//! account and sent to a program controlled `Stake` account, where the funds
//! reside until they are "cashed" by the intended recipient. The creator of
//! the stake can cancel the stake at any time to get back the funds.

use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Transfer};
use std::convert::Into;

#[program]
pub mod reward_token_staking {
    use super::*;

    #[access_control(StakeRewardToken::accounts(&ctx, nonce))]
    pub fn stake(
        ctx: Context<StakeRewardToken>,
        amount: u64,
        memo: Option<String>,
        nonce: u8,
    ) -> Result<()> {
        msg!("stake start: {:?}", memo);
        // Transfer reward tokens to the vault (one vault for each staker).
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info().clone(),
            to: ctx.accounts.vault.to_account_info().clone(),
            authority: ctx.accounts.owner.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Show vault contents.
        let vault = &ctx.accounts.vault;
        msg!("amount deposited in vault: {:?}", vault.amount);

        // record the deposit in the data account
        let data_account = &mut ctx.accounts.data_account;
        data_account.amount = amount;
        data_account.from = *ctx.accounts.from.to_account_info().key;
        data_account.vault = *ctx.accounts.vault.to_account_info().key;
        data_account.nonce = nonce;
        data_account.memo = memo;
        data_account.burned = false;
        msg!("memo => {:?}", data_account.memo);

        Ok(())
    }

    #[access_control(not_burned(&ctx.accounts.data_account))]
    pub fn unstake(ctx: Context<CancelCheck>) -> Result<()> {
        let seeds = &[
            ctx.accounts.data_account.to_account_info().key.as_ref(),
            &[ctx.accounts.data_account.nonce],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info().clone(),
            to: ctx.accounts.from.to_account_info().clone(),
            authority: ctx.accounts.check_signer.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, ctx.accounts.data_account.amount)?;
        ctx.accounts.data_account.burned = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StakeRewardToken<'info> {
    // Stake being created.
    #[account(init)]
    data_account: ProgramAccount<'info, Stake>,
    // Stake's token vault.
    #[account(mut, "&vault.owner == check_signer.key")]
    vault: CpiAccount<'info, TokenAccount>,
    // Program derived address for the data_account.
    check_signer: AccountInfo<'info>,
    // Token account the data_account is made from.
    #[account(mut, has_one = owner)]
    from: CpiAccount<'info, TokenAccount>,
    // Owner of the `from` token account.
    owner: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
}

impl<'info> StakeRewardToken<'info> {
    pub fn accounts(ctx: &Context<StakeRewardToken>, nonce: u8) -> Result<()> {
        let signer = Pubkey::create_program_address(
            &[ctx.accounts.data_account.to_account_info().key.as_ref(), &[nonce]],
            ctx.program_id,
        )
        .map_err(|_| ErrorCode::InvalidCheckNonce)?;
        if &signer != ctx.accounts.check_signer.to_account_info().key {
            return Err(ErrorCode::InvalidCheckSigner.into());
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CancelCheck<'info> {
    #[account(mut, has_one = vault, has_one = from)]
    data_account: ProgramAccount<'info, Stake>,
    #[account(mut)]
    vault: AccountInfo<'info>,
    #[account(seeds = [
        data_account.to_account_info().key.as_ref(),
        &[data_account.nonce],
    ])]
    check_signer: AccountInfo<'info>,
    #[account(mut, has_one = owner)]
    from: CpiAccount<'info, TokenAccount>,
    #[account(signer)]
    owner: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
}

#[account]
pub struct Stake {
    from: Pubkey,
    amount: u64,
    memo: Option<String>,
    vault: Pubkey,
    nonce: u8,
    burned: bool,
}

#[error]
pub enum ErrorCode {
    #[msg("The given nonce does not create a valid program derived address.")]
    InvalidCheckNonce,
    #[msg("The derived stake signer does not match that which was given.")]
    InvalidCheckSigner,
    #[msg("The given stake has already been burned. (Apparently being burned on the stake is not ok.)")]
    AlreadyBurned,
}

fn not_burned(stake: &Stake) -> Result<()> {
    if stake.burned {
        return Err(ErrorCode::AlreadyBurned.into());
    }
    Ok(())
}

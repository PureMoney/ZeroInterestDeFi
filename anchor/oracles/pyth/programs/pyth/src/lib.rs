use anchor_lang::prelude::*;
use pyth_client::*;

#[program]
pub mod pyth {
    use super::*;

    // initialize allows this program to "internally own" the input account
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        msg!("initialization done");
        Ok(())
    }

    pub fn get_price(ctx: Context<GetPrice>) -> ProgramResult {
        let pyth_product_info = &mut ctx.accounts.pyth_product_info;
        let pyth_price_info = &mut ctx.accounts.pyth_price_info;
    
        let pyth_product_data = &pyth_product_info.try_borrow_data()?;
        let pyth_product = cast::<Product>(pyth_product_data);
    
        if pyth_product.magic != MAGIC {
            msg!("Pyth product account provided is not a valid Pyth account");
            return Err(ProgramError::InvalidArgument.into());
        }
        if pyth_product.atype != AccountType::Product as u32 {
            msg!("Pyth product account provided is not a valid Pyth product account");
            return Err(ProgramError::InvalidArgument.into());
        }
        if pyth_product.ver != VERSION_1 {
            msg!("Pyth product account provided has a different version than the Pyth client");
            return Err(ProgramError::InvalidArgument.into());
        }
        if !pyth_product.px_acc.is_valid() {
            msg!("Pyth product price account is invalid");
            return Err(ProgramError::InvalidArgument.into());
        }
    
        let pyth_price_pubkey = Pubkey::new(&pyth_product.px_acc.val);
        if &pyth_price_pubkey != pyth_price_info.key {
            msg!("Pyth product price account does not match the Pyth price provided");
            return Err(ProgramError::InvalidArgument.into());
        }

        // put data in caller's account data
        let pyth_price_data = pyth_price_info.data.borrow();
        msg!(" pyth_price_data.len = {}", pyth_price_data.len());

        let mut account_data = ctx.accounts.my_account.data.borrow_mut();
        msg!(" account_data.len = {}", account_data.len());

        let mut u: usize = 0;

        // *account_data = *pyth_price_data; // copy semantics for RefCell, not contents
        // (*account_data)[0..300] = (*pyth_price_data)[0..300]; // slices have dynamic size, so can't copy

        // just use good old loop to copy (works!)
        while u < 512 {
            (*account_data)[u] = (*pyth_price_data)[u];
            u = u + 1;
        }
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init)]
    pub my_account: AccountInfo<'info>, // ProgramAccount<'info, PythData>, // acct owned by program
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(mut)]
    pub my_account: AccountInfo<'info>, // acct owned by program
    pub pyth_product_info: AccountInfo<'info>,
    pub pyth_price_info: AccountInfo<'info>,
}

// #[account]
// pub struct PythData {
//     pub data: u64,
// }


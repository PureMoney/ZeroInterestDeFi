use anchor_lang::prelude::*;

#[program]
pub mod pyth {
    use super::*;

    // initialize allows this program to "internally own" the input account
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn get_price(ctx: Context<GetPrice>) -> ProgramResult {
        let pyth_product_info = &mut ctx.accounts.pyth_product_info;
        let pyth_price_info = &mut ctx.accounts.pyth_price_info;
    
        let pyth_product_data = &pyth_product_info.try_borrow_data()?;
        let pyth_product = pyth_client::cast::<pyth_client::Product>(pyth_product_data);
    
        if pyth_product.magic != pyth_client::MAGIC {
            msg!("Pyth product account provided is not a valid Pyth account");
            return Err(ProgramError::InvalidArgument.into());
        }
        if pyth_product.atype != pyth_client::AccountType::Product as u32 {
            msg!("Pyth product account provided is not a valid Pyth product account");
            return Err(ProgramError::InvalidArgument.into());
        }
        if pyth_product.ver != pyth_client::VERSION_1 {
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
        let pyth_price_data = &pyth_price_info.try_borrow_data()?;
        msg!(" pyth_price_data.len = {}", pyth_price_data.len());
        let price_data = pyth_client::cast::<pyth_client::Price>(pyth_price_data);

        let account_data = &ctx.accounts.my_account.try_borrow_mut_data()?;
        msg!(" account_data.len = {}", account_data.len());
        let account_price_data = &mut pyth_client::cast::<pyth_client::Price>(account_data);

        *account_price_data = price_data; // copy semantics

        msg!("  my_account .. {:?}", ctx.accounts.my_account.key);
        msg!("    exponent ..... {}", account_price_data.expo);
        msg!("    price ........ {}", account_price_data.agg.price);
        msg!("    conf ......... {}", account_price_data.agg.conf);
        msg!("    valid_slot ... {}", account_price_data.valid_slot);
        msg!("    publish_slot . {}", account_price_data.agg.pub_slot);
        msg!("    valid slot:    {}", account_price_data.valid_slot);
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init)]
    pub my_account: ProgramAccount<'info, PythData>, // acct owned by program
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(mut)]
    pub my_account: AccountInfo<'info>, // acct owned by program
    pub pyth_product_info: AccountInfo<'info>,
    pub pyth_price_info: AccountInfo<'info>,
}

#[account]
pub struct PythData {
    pub data: u64,
}


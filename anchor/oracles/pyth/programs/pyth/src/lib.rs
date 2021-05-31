use anchor_lang::prelude::*;
use pyth_client::{
    CorpAction, 
    PriceStatus, 
    PriceType,
};
mod pc;
use pc::*;

#[program]
pub mod pyth {
    use super::*;

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
    
        let pyth_price_data = &pyth_price_info.try_borrow_data()?;
        let pyth_price = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
    
        msg!("  price_account .. {:?}", pyth_price_info.key);
        msg!("    price_type ... {}", get_price_type(&pyth_price.ptype));
        msg!("    exponent ..... {}", pyth_price.expo);
        msg!("    status ....... {}", get_status(&pyth_price.agg.status));
        msg!(
            "    corp_act ..... {}",
            get_corp_act(&pyth_price.agg.corp_act)
        );
        msg!("    price ........ {}", pyth_price.agg.price);
        msg!("    conf ......... {}", pyth_price.agg.conf);
        msg!("    valid_slot ... {}", pyth_price.valid_slot);
        msg!("    publish_slot . {}", pyth_price.agg.pub_slot);
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init)]
    pub my_account: ProgramAccount<'info, PythData>, // acct owned by program, PythData unused
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(mut)]
    pub my_account: ProgramAccount<'info, PythData>, // acct owned by program, PythData unused
    pub pyth_product_info: AccountInfo<'info>,
    pub pyth_price_info: AccountInfo<'info>,
}

#[account]
pub struct PythData {
    pub data: u64,
}


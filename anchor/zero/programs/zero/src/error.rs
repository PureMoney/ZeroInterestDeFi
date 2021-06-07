use anchor_lang::prelude::*;

#[error]
pub enum MyError {
    #[msg("You are trying to borrow more than your collateral allows")]
    NotEnoughCollateral,
}

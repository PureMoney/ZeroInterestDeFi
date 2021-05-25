//! Instruction types

use std::convert::TryInto;


use crate::error::RewardTokenError::*;
use solana_program::{
    // instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    // program_option::COption,
    // pubkey::Pubkey,
    // sysvar,
};

/// Instructions supported by the Reward-token program.
pub enum StakeInstruction {
    /// Stake some Reward tokens
    Stake {
        /// The amount of tokens to stake.
        reward_token_amount: u64,
    },
    /// Unstake some Reward tokens
    Unstake {
        /// The amount of tokens to unstake.
        reward_token_amount: u64,
    }
}

impl StakeInstruction {

    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {

        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
        Ok(match tag {
            0 => Self::Stake {
                reward_token_amount: Self::unpack_amount(rest)?,
            },
            1 => Self::Unstake {
                reward_token_amount: Self::unpack_amount(rest)?,
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
}

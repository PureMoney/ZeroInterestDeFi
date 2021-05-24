// use crate::error::SecondaryTokenError;
use crate::instruction::StakeInstruction;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    // program::{invoke, invoke_signed},
    program_error::ProgramError,
    // program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    // system_instruction,
    // sysvar::{rent::Rent, Sysvar},
};

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {

        msg!(
            "process staking: {}: {} accounts, data={:?}",
            program_id,
            accounts.len(),
            instruction_data
        );

        let instruction = StakeInstruction::unpack(instruction_data)?;

        match instruction {
            StakeInstruction::Stake {
                reward_token_amount,
            } => {
                msg!("Instruction: Stake");
                Self::process_stake(program_id, accounts, reward_token_amount )
            },
            StakeInstruction::Unstake {
                reward_token_amount,
            } => {
                msg!("Instruction: Unstake");
                Self::process_unstake(program_id, accounts, reward_token_amount)
            }
        }
    }

    fn process_stake(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        reward_token_amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let sec_token_account = next_account_info(account_info_iter)?;

        if !sec_token_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        msg!(
            " with {:?} reward-tokens, program_id = {:?}",
            reward_token_amount,
            program_id
        );

        Ok(())
    }

    fn process_unstake(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        reward_token_amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        msg!("process_unstake: program_id = {:?}, first account = {:?}, reward_token_amount = {:?}", 
            program_id, next_account_info(account_info_iter)?, reward_token_amount);

        Ok(())
    }
}

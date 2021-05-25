//! Error types (copy-pasted from ../../spl)

use num_derive::FromPrimitive;
use solana_program::{msg, decode_error::DecodeError, program_error::{ProgramError, PrintProgramError}};
use thiserror::Error;

/// Errors that may be returned by the Token program.
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum RewardTokenError {
    /// Lamport balance below rent-exempt threshold.
    #[error("Lamport balance below rent-exempt threshold")]
    NotRentExempt,
    /// Insufficient funds for the operation requested.
    #[error("Insufficient funds")]
    InsufficientFunds,
    /// Owner does not match.
    #[error("Owner does not match")]
    OwnerMismatch,
    /// The account cannot be initialized because it is already being used.
    #[error("Already in use")]
    AlreadyInUse,
    /// Invalid number of provided signers.
    #[error("Invalid number of provided signers")]
    InvalidNumberOfProvidedSigners,
    /// Invalid number of required signers.
    #[error("Invalid number of required signers")]
    InvalidNumberOfRequiredSigners,
    /// State is uninitialized.
    #[error("State is unititialized")]
    UninitializedState,
    /// Instruction does not support native tokens
    #[error("Instruction does not support native tokens")]
    NativeNotSupported,
    /// Non-native account can only be closed if its balance is zero
    #[error("Non-native account can only be closed if its balance is zero")]
    NonNativeHasBalance,
    /// Invalid instruction
    #[error("Invalid instruction")]
    InvalidInstruction,
    /// State is invalid for requested operation.
    #[error("State is invalid for requested operation")]
    InvalidState,
    /// Operation overflowed
    #[error("Operation overflowed")]
    Overflow,
    /// Account does not support specified authority type.
    #[error("Account does not support specified authority type")]
    AuthorityTypeNotSupported,    /// Account is frozen; all account operations will fail
    #[error("Account is frozen")]
    AccountFrozen,
}
impl From<RewardTokenError> for ProgramError {
    fn from(e: RewardTokenError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for RewardTokenError {
    fn type_of() -> &'static str {
        "RewardTokenError"
    }
}

use num_traits::FromPrimitive;
impl PrintProgramError for RewardTokenError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            RewardTokenError::NotRentExempt => msg!("Error: Lamport balance below rent-exempt threshold"),
            RewardTokenError::InsufficientFunds => msg!("Error: insufficient funds"),
            RewardTokenError::OwnerMismatch => msg!("Error: owner does not match"),
            RewardTokenError::AlreadyInUse => msg!("Error: account or token already in use"),
            RewardTokenError::InvalidNumberOfProvidedSigners => {
                msg!("Error: Invalid number of provided signers")
            }
            RewardTokenError::InvalidNumberOfRequiredSigners => {
                msg!("Error: Invalid number of required signers")
            }
            RewardTokenError::UninitializedState => msg!("Error: State is uninitialized"),
            RewardTokenError::NativeNotSupported => {
                msg!("Error: Instruction does not support native tokens")
            }
            RewardTokenError::NonNativeHasBalance => {
                msg!("Error: Non-native account can only be closed if its balance is zero")
            }
            RewardTokenError::InvalidInstruction => msg!("Error: Invalid instruction"),
            RewardTokenError::InvalidState => msg!("Error: Invalid account state for operation"),
            RewardTokenError::Overflow => msg!("Error: Operation overflowed"),
            RewardTokenError::AuthorityTypeNotSupported => {
                msg!("Error: Account does not support specified authority type")
            }
            RewardTokenError::AccountFrozen => msg!("Error: Account is frozen")
            }
        }
    }

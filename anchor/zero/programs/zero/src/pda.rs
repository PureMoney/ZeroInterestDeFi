use anchor_lang::prelude::Pubkey;

pub enum PDA {
    TroveDataAccount { user: Pubkey },
    BorrowingFeesAccount { initial_market_owner: Pubkey },
    GlobalState { initial_market_owner: Pubkey },
    StablecoinMint { initial_market_owner: Pubkey },
}

const SEED: u8 = 2;
pub fn make_pda_pubkey(mode: PDA, program: &Pubkey) -> Pubkey {
    match &mode {
        PDA::TroveDataAccount { user } => make_pda(&user, "tda", SEED, program),
        PDA::BorrowingFeesAccount {
            initial_market_owner,
        } => make_pda(initial_market_owner, "bfa", SEED, program),
        PDA::GlobalState {
            initial_market_owner,
        } => make_pda(initial_market_owner, "gsa", SEED, program),
        PDA::StablecoinMint {
            initial_market_owner,
        } => make_pda(initial_market_owner, "sma", SEED, program),
    }
}

pub fn make_pda_seeds<'a>(mode: &'a PDA, program: &'a Pubkey) -> [Vec<u8>; 3] {
    match &mode {
        PDA::TroveDataAccount { user } => make_seeds(user, "tda", SEED),
        PDA::BorrowingFeesAccount {
            initial_market_owner,
        } => make_seeds(initial_market_owner, "bfa", SEED),
        PDA::GlobalState {
            initial_market_owner,
        } => make_seeds(initial_market_owner, "gsa", SEED),
        PDA::StablecoinMint {
            initial_market_owner,
        } => make_seeds(initial_market_owner, "sma", SEED),
    }
}

fn make_seeds<'a>(owner: &'a Pubkey, tag: &'static str, seed: u8) -> [Vec<u8>; 3] {
    let signer_seeds = [
        owner.as_ref()[..10].to_owned(),
        tag.as_bytes().to_owned(),
        vec![seed],
    ];
    signer_seeds
}

fn make_pda(owner: &Pubkey, tag: &str, seed: u8, program: &Pubkey) -> Pubkey {
    let signer_seeds = &[owner.as_ref()[..10].as_ref(), tag.as_ref(), &[seed]];
    Pubkey::create_program_address(signer_seeds, program).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test_generate_borrowing_seed() {
        let owner = Pubkey::from_str("BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y").unwrap();
        let program_id = Pubkey::from_str("9sPSzYv5cJqDdepzzbRL4oUVE7fF4e5ypSff8bFHG2CN").unwrap();
        let pdapubkey = make_pda_pubkey(
            PDA::BorrowingFeesAccount {
                initial_market_owner: owner.clone(),
            },
            &program_id,
        );
        println!("pubkey {:?}", &pdapubkey);
    }
    #[test]
    fn test_generate_global_seed() {
        let owner = Pubkey::from_str("BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y").unwrap();
        let program_id = Pubkey::from_str("9sPSzYv5cJqDdepzzbRL4oUVE7fF4e5ypSff8bFHG2CN").unwrap();
        let pdapubkey = make_pda_pubkey(
            PDA::GlobalState {
                initial_market_owner: owner.clone(),
            },
            &program_id,
        );
        println!("pubkey {:?}", &pdapubkey);
    }
    #[test]
    fn test_generate_stable_seed() {
        //8gPfCN6L2JJqML4CJYyQjnuiKJ8ALXSK5jpvYN6XekMQ
        let owner = Pubkey::from_str("BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y").unwrap();
        let program_id = Pubkey::from_str("7SeC6f66GuxEEE1PHmAabu1SYbLnayJkWNE6127BNUYc").unwrap();
        let pdapubkey = make_pda_pubkey(
            PDA::StablecoinMint {
                initial_market_owner: owner.clone(),
            },
            &program_id,
        );
        println!("pubkey {:?}", &pdapubkey);
    }
}

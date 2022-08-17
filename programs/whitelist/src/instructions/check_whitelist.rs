use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn check_whitelist(
    _ctx: Context<CheckWhitelist>, 
    _owner: Pubkey,
    _name: String,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(owner: Pubkey, name: String)]
pub struct CheckWhitelist<'info> {
    #[account(
        seeds=[
            owner.as_ref(),
            name.as_bytes()
        ],
        bump,
        constraint=(whitelist.authority == owner)
    )]
    whitelist: Account<'info, account::Whitelist>
}
use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn check_whitelisted(
    _ctx: Context<CheckWhitelisted>, 
    _account_to_check: Pubkey,
    _bump: u8,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(account_to_check: Pubkey, bump: u8)]
pub struct CheckWhitelisted<'info> {
    #[account(
        seeds=[
            account_to_check.as_ref(),
            whitelist.key().as_ref()
        ],
        bump=bump
    )]
    entry: Account<'info,  account::WhitelistEntry>,
    whitelist: Account<'info, account::Whitelist>
}
use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn check_whitelisted(
    _ctx: Context<CheckWhitelisted>, 
    _account_to_check: Pubkey,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(account_to_check: Pubkey)]
pub struct CheckWhitelisted<'info> {
    #[account(
        seeds=[
            account_to_check.as_ref(),
            whitelist.key().as_ref()
        ],
        bump,
        constraint=entry.parent == whitelist.key()
    )]
    entry: Account<'info,  account::WhitelistEntry>,
    whitelist: Account<'info, account::Whitelist>
}
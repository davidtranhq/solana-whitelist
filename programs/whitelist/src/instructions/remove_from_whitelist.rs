use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn remove_from_whitelist(
    _ctx: Context<RemoveFromWhitelist>,
    _account_to_delete: Pubkey,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(account_to_delete: Pubkey)]
pub struct RemoveFromWhitelist<'info> {
    #[account(
        mut,
        close=authority,
        seeds=[
            account_to_delete.as_ref(),
            whitelist.key().as_ref()
        ],
        bump
    )]
    entry: Account<'info, account::WhitelistEntry>,
    #[account(has_one=authority)]
    whitelist: Account<'info, account::Whitelist>,

    #[account(mut)]
    authority: Signer<'info>,
}
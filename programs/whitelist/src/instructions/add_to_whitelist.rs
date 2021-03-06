use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn add_to_whitelist(
    _ctx: Context<AddToWhitelist>,
    _account_to_add: Pubkey
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(account_to_add: Pubkey)]
pub struct AddToWhitelist<'info> {
    #[account(
        init,
        space=account::WhitelistEntry::SIZE,
        payer=authority,
        seeds=[
            account_to_add.as_ref(),
            whitelist.key().as_ref()
        ],
        bump
    )]
    entry: Account<'info, account::WhitelistEntry>,
    #[account(has_one=authority)]
    whitelist: Account<'info, account::Whitelist>,

    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}
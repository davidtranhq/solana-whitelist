use anchor_lang::prelude::*;
use crate::instructions::account;

pub fn delete_whitelist(
    _ctx: Context<DeleteWhitelist>,
    _name: String,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DeleteWhitelist<'info> {
    #[account(
        mut,
        close=authority,
        seeds=[authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    whitelist: Account<'info, account::Whitelist>,

    #[account(
        mut,
        constraint=whitelist.authority == authority.key(),
    )]
    authority: Signer<'info>,
}
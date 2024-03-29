use anchor_lang::prelude::*;
use instructions::*;

mod instructions;

declare_id!("42G39bs9zQ9UQoaDPGC9VjcxPokXgkzWQPzR7PQorSHa");

#[program]
pub mod whitelist {
    use super::*;

    /**
     * Initialize a whitelist with the given name, associated with the authority of this transaction.
     */
    pub fn init_whitelist(
        ctx: Context<InitWhitelist>,
        name: String
    ) -> Result<()> {
        instructions::init_whitelist(ctx, name)
    }

    /**
     * Delete a whitelist create with `init_whitelist` with the given name and bump,
     * associated with the authority of this transaction. The remaining lamports are sent to the
     * authority of this transaction.
     */
    pub fn delete_whitelist(
        ctx: Context<DeleteWhitelist>,
        name: String,
    ) -> Result<()> {
        instructions::delete_whitelist(ctx, name)
    }

    /**
     * Check if the given whitelist exists (has been initalized).
     */
    pub fn check_whitelist(
        ctx: Context<CheckWhitelist>,
        owner: Pubkey,
        name: String,
    ) -> Result<()> {
        instructions::check_whitelist(ctx, owner, name)
    }
    
    /**
     * Add the account `account_to_add` with the specified bump to the `whitelist` account.
     */
    pub fn add_to_whitelist(
        ctx: Context<AddToWhitelist>,
        account_to_add: Pubkey
    ) -> Result<()> {
        instructions::add_to_whitelist(ctx, account_to_add)
    }

    /**
     * Remove the account `account_to_delete` with the specified bump from the `whitelist` account.
     * Remaining lamports are sent to the authority of this transaction.
     */
    pub fn remove_from_whitelist(
        ctx: Context<RemoveFromWhitelist>,
        account_to_delete: Pubkey,
    ) -> Result<()> {
        instructions::remove_from_whitelist(ctx, account_to_delete)
    }

    /**
     * Check if the account `account_to_check` is whitelisted in the given `whitelist` account.
     */
    pub fn check_whitelisted(
        ctx: Context<CheckWhitelisted>,
        account_to_check: Pubkey,
    ) -> Result<()> {
        instructions::check_whitelisted(ctx, account_to_check)
    }
}
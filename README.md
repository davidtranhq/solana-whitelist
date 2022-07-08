# Solana Whitelisting

This Solana program (smart contract) provides basic whitelisting functionality using PDAs.

The program is deployed on Solana's Devnet at `7Q5v4ftKm5Xk88NMf5kNCkvLmmBPcBfkynJA9x244i5Q`. It is not yet deployed on Mainnet.

IDL files and TypeScript type files can be found in `target/`.

## Endpoints
```rust
init_whitelist(name: String) -> Result<()>
```
Arguments:
- `name: String` The identifying name of this whitelist. Since whitelists are tied to the signer's wallet, the name need be unique to other whitelists initialized by the signer.

Accounts:
- `whitelist` The whitelist to be initialized. The address should be a PDA derived from this whitelisting program address and seeded with the signer's public key and the whitelist name (as bytes). Use the canonical bump.
- `authority` The signer of this transaction. This account will pay for the whitelist and new whitelist entries. Only this account is able to add to the whitelist.

```rust
delete_whitelist(name: String, bump: u8) -> Result<()>
```
Note that deleting a whitelist does not delete the whitelist entries associated with it. Use `remove_from_whitelist` to delete whitelist entries.

Arguments:
- `name: String` The name of the whitelist to delete.
- `bump: u8` The bump associated with the PDA of the whitelist to delete.

Accounts:
- `whitelist` The whitelist to delete. This account will be closed and remaining lamports will be sent to `authority`.
- `authority` The signer of this transaction. This account must be the one that created the whitelist.


```rust
add_to_whitelist(account_to_whitelist: Pubkey) -> Result<()>
```

Arguments:
- `account_to_whitelist: Pubkey` The address of the account to add to the whitelist.

Accounts:
- `entry` The account to store the new whitelist entry. The address should be a PDA derived from this whitelisting program address and seeded with `account_to_add` and the public key of `whitelist`. Use the canonical bump.
- `whitelist` The whitelist to add to, initialized with `init_whitelist`. `authority` must be the one who initialized this whitelist.
- `authority` The signer of this transaction. This must correspond to the account that initialized the whitelist.

```rust
remove_from_whitelist(account_to_delete: Pubkey, bump: u8) -> Result<()>
```

Arguments:
- `account_to_delete: Pubkey` The address of the account to remove from the whitelist.
- `bump: u8` The bump associated with the PDA of the whitelist entry to delete.

Accounts:
- `entry` The whitelist entry (initialized with `add_to_whitelist`) corresponding with `account_to_delete`.
- `whitelist` The whitelist to remove from (initialized with `init_whitelist`). `authority` must be the one who initialized this whitelist.
- `authority` The signer of this transaction. This must correspond to the account that initialized the whitelist.

```rust
check_whitelisted(account_to_check: Pubkey, bump: u8) -> Result<()>
```
Throws an `AnchorError` if the user is not whitelisted. Unlike other endpoints, this endpoint can be called even by those who did not create the whitelist.

Arguments:
- `account_to_check` The public key of the account whose whitelisting status will be checked.
- `bump` The bump corresponding to `entry`.

Accounts:
- `entry` The whitelisting entry of `account_to_check` (initialized with `add_to_whitelist`).
- `whitelist` The whitelist that will be checked.

## Usage

### Creating a whitelist

First, create a PDA for an account that will hold a named whitelist. The PDA should be derived from the address of this whitelisting program and seeded with your wallet public key and the whitelist name (in bytes), in that order.

The whitelist name is used as an identifier to differentiate between the whitelists already associated with your wallet. As such, the name should be different from any of your existing whitelists created with this program.

```typescript
import * as anchor from "@project-serum/anchor";

const whitelistName = "Whitelist Name";

const [whitelist, whitelistBump] = await anchor.web3.PublicKey.findProgramAddress(
    [
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.utf8.encode(whitelistName)
    ],
    whitelistProgram.programId // the address of this whitelisting program
);
```

Then, initialize the whitelist with a call to `init_whitelist`:

```typescript
const systemProgram = anchor.web3.SystemProgram;

await whitelistProgram.methods
    .initWhitelist(whitelistName)
    .accounts({
        whitelist,
        authority: wallet.publicKey,
        systemProgram: systemProgram.programId,
    })
    .rpc();
```

The funds used to create the account are taken from `authority`.

### Adding accounts to the whitelist

First, create a PDA for the account that will hold the whitelist entry for one address. The PDA should be derived from the address of this whitelisting program and seeded with the address of the whitelist (see [Creating a whitelist](#Creating-a-whitelist)) and the account to whitelist.

Note that the authority of the transaction sending the instruction `add_to_whitelist` must be the same as the one who created the whitelist.

```typescript
const accountToWhitelist: Pubkey = "SomePublicKey";

const [whitelistEntry, entryBump] = await anchor.web3.PublicKey.findProgramAddress(
    [
        accountToWhitelist.toBytes(),
        whitelist.toBytes(),
    ],
    program.programId // ID of this whitelisting program
);
```

Then, add the account to the whitelist with a call to `add_to_whitelist`:

```typescript
await program.methods
    .addToWhitelist(accountToWhitelist.publicKey)
    .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
        systemProgram: systemProgram.programId,
    })
    .rpc();
```

### Checking if an account is whitelisted

Use the `check_whitelisted` endpoint: `check_whitelisted` throws if the user is not whitelisted.

```typescript
try {
    await program.methods
        .checkWhitelisted(accountToWhitelist.publicKey, entryBump)
        .accounts({
            entry: whitelistEntry,
            whitelist: whitelist,
        })
        .rpc();
    // user is whitelisted
} catch (err: unknown) {
    // user is not whitelisted
}
```

### Deleting an account from the whitelist

Use the `remove_from_whitelist` endpoint. Only the creator of the whitelist can remove from the whitelist. The remaining lamports stored in the whitelist entry account are returned to the authority (creator of the whitelist).

```typescript
await program.methods
    .removeFromWhitelist(accountToWhitelist.publicKey, entryBump)
    .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
    })
    .rpc()
```

### Deleting a whitelist

Use the `delete_whitelist` endpoint. Only the creator of the whitelist can delete the whitelist. The remaining lamports stored in the whitelist entry account are returned to the authority (creator of the whitelist).

This endpoint does NOT remove corresponding whitelist entries; they have to be removed separately with `remove_from_whitelist`.

```typescript
await program.methods
    .deleteWhitelist(whitelistName, whitelistBump)
    .accounts({
    whitelist,
    authority: wallet.publicKey,
    })
    .rpc();
```


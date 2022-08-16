import * as anchor from '@project-serum/anchor';
import { Program, Wallet } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Whitelist } from './whitelist';

/**
 * Generate the PDA for a whitelist entry.
 */
async function generateWhitelistEntry(
  program: Program<Whitelist>,
  whitelist: PublicKey,
  address: PublicKey,
) {
  return await PublicKey
    .findProgramAddress(
      [
        address.toBytes(),
        whitelist.toBytes(),
      ],
      program.programId
    );
}

async function createWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  name: string
) {
  // generate a PDA from the users wallet and the whitelist name
  const [whitelist, whitelistBump] = await anchor.web3.PublicKey
    .findProgramAddress(
      [
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.utf8.encode(name)
      ],
      program.programId
    );

  try {
    await program.methods
      .initWhitelist(name)
      .accounts({
        whitelist,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
  } catch {
    console.log(`Error creating whitelist`);
  }
}

async function addToWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  whitelist: PublicKey,
  addressToWhitelist: PublicKey
) {
  // generate a PDA for the whitelist entry
  const [whitelistEntry, entryBump] = await generateWhitelistEntry(
    program,
    whitelist,
    addressToWhitelist
  );

  await program.methods
    .addToWhitelist(addressToWhitelist)
    .accounts({
      entry: whitelistEntry,
      whitelist: whitelist,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

async function deleteFromWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  whitelist: PublicKey,
  addressToRemove: PublicKey
) {
  const [whitelistEntry, entryBump] = await generateWhitelistEntry(
    program,
    whitelist,
    addressToRemove,
  );
  // remove the account
  await program.methods
    .removeFromWhitelist(addressToRemove, entryBump)
    .accounts({
      entry: whitelistEntry,
      whitelist: whitelist,
      authority: wallet.publicKey,
    })
    .rpc()
}

/**
 * Returns true if the address is whitelisted, otherwise returns false.
 * @param program 
 * @param whitelist 
 * @param addressToCheck 
 * @returns 
 */
async function checkWhitelisted(
  program: Program<Whitelist>,
  whitelist: PublicKey,
  addressToCheck: PublicKey
) {
  const [whitelistEntry, entryBump] = await generateWhitelistEntry(
    program,
    whitelist,
    addressToCheck,
  );

  try {
    program.methods
      .checkWhitelisted(addressToCheck, entryBump)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
      })
      .rpc()
    return true;
  } catch {
    return false;
  }
}

export {
  createWhitelist,
  addToWhitelist,
  deleteFromWhitelist,
  checkWhitelisted,
};
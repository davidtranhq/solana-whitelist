import * as anchor from '@project-serum/anchor';
import { Program, Wallet } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Whitelist } from './idl';
import { deserializeWhitelist } from './deserialize';

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

async function generateWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  name: string,
) {
  const [whitelist, whitelistBump] = await anchor.web3.PublicKey
    .findProgramAddress(
      [
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.utf8.encode(name)
      ],
      program.programId
    );
  
    return whitelist;
}

async function createWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  name: string
) {
  // generate a PDA from the users wallet and the whitelist name
  const whitelist = await generateWhitelist(program, wallet, name);

  try {
    await program.methods
      .initWhitelist(name)
      .accounts({
        whitelist,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

async function deleteWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  name: string,
) {
  const whitelist = await generateWhitelist(program, wallet, name);
  
  try {
    await program.methods
      .deleteWhitelist(name)
      .accounts({
        whitelist,
        authority: wallet.publicKey,
      }).rpc();
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;

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

  try {
    await program.methods
      .addToWhitelist(addressToWhitelist)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
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

  try {
    // remove the account
    await program.methods
      .removeFromWhitelist(addressToRemove)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
      })
      .rpc()
  } catch (err) {
    return false;
  }
  return true;
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
    await program.methods
      .checkWhitelisted(addressToCheck)
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

/**
 * Returns true if the whitelist with the given name exists, else returns false.
 * @param program 
 * @param whitelist 
 * @param nam
 * @returns 
 */
async function checkWhitelist(
  program: Program<Whitelist>,
  wallet: Wallet,
  name: string,
) {
  const whitelist = await generateWhitelist(program, wallet, name);

  try {
    await program.methods
      .checkWhitelist(wallet.publicKey, name)
      .accounts({
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
  deleteWhitelist,
  addToWhitelist,
  deleteFromWhitelist,
  checkWhitelisted,
  checkWhitelist,
  generateWhitelist,
};
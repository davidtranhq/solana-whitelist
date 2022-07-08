import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Whitelist } from "../target/types/whitelist";

chai.use(chaiAsPromised);

describe("whitelist", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const { connection } = provider;
  anchor.setProvider(provider);
  const wallet = provider.wallet;
  const systemProgram = anchor.web3.SystemProgram;
  const program = anchor.workspace.WhitelistExample as Program<Whitelist>;
  const whitelistName = "Whitelist Test";
  const accountToWhitelist = anchor.web3.Keypair.generate();
  const [whitelist, whitelistBump] = await anchor.web3.PublicKey
    .findProgramAddress(
      [
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.utf8.encode(whitelistName),
      ],
      program.programId
    );


  console.log("Your whitelist address", whitelist.toString());
  console.log("Whitelist bump", whitelistBump.toString());
  it("creates whitelist", async () => {
    await program.methods
      .initWhitelist(whitelistName)
      .accounts({
        whitelist,
        authority: wallet.publicKey,
        systemProgram: systemProgram.programId,
      })
      .rpc();
    
    expect(
      await connection.getAccountInfo(whitelist),
      "whitelist account was not created!"
    );
  });

  it("adds an address to the whitelist", async () => {
    const [whitelistEntry, entryBump] = await anchor.web3.PublicKey
      .findProgramAddress(
        [
          accountToWhitelist.publicKey.toBytes(),
          whitelist.toBytes(),
        ],
        program.programId
      );

    await program.methods
      .addToWhitelist(accountToWhitelist.publicKey)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
        systemProgram: systemProgram.programId,
      })
      .rpc();

    // check if the address is whitelisted
    await program.methods
      .checkWhitelisted(accountToWhitelist.publicKey, entryBump)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
      })
      .rpc();
  });

  it("removes an address from the whitelist", async () => {
    const [whitelistEntry, entryBump] = await anchor.web3.PublicKey
      .findProgramAddress(
        [
          accountToWhitelist.publicKey.toBytes(),
          whitelist.toBytes(),
        ],
        program.programId
      );
    // remove the account
    await program.methods
      .removeFromWhitelist(accountToWhitelist.publicKey, entryBump)
      .accounts({
        entry: whitelistEntry,
        whitelist: whitelist,
        authority: wallet.publicKey,
      })
      .rpc()

    // check that the account is no longer whitelisted
    await expect(
      program.methods
        .checkWhitelisted(accountToWhitelist.publicKey, entryBump)
        .accounts({
          entry: whitelistEntry,
          whitelist: whitelist,
        })
        .rpc()
    ).to.be.rejectedWith(Error, "AnchorError caused by account: entry. Error Code: AccountNotInitialized. Error Number: 3012. Error Message: The program expected this account to be already initialized.");
  });

  it("deletes whitelist", async () => {
    await program.methods
      .deleteWhitelist(whitelistName, whitelistBump)
      .accounts({
        whitelist,
        authority: wallet.publicKey,
      })
      .rpc();
    
    expect(
      !(await connection.getAccountInfo(whitelist)),
      "whitelist account was not closed!"
    );
  });
});

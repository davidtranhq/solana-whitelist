import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import WalletAdapter from '../components/WalletAdapter';
import {
  createWhitelist,
  deleteWhitelist,
  addToWhitelist,
  deleteFromWhitelist,
  checkWhitelisted,
  getWhitelists,
} from '../lib/whitelist';

import idl from '../lib/idl.json';
import { IDL, Whitelist } from '../lib/idl';

declare global {
  interface Window {
    whitelistName: string,
    whitelistBump: number
    whitelistAddress: string,
  }
}
// address of the whitelisting program
const programID = new PublicKey(idl.metadata.address);

export default function Home() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<Whitelist>(IDL, programID, provider);

  const onCreate = async () => console.log(await createWhitelist(program, wallet, window.whitelistName));
  const onDelete = async () => deleteWhitelist(program, wallet, window.whitelistName, window.whitelistBump);
  const getAccounts = async () => console.log(await getWhitelists(programID));

  return <>
    <WalletMultiButton />
    <WalletDisconnectButton />
    <button onClick={onCreate}>Create Whitelist</button>
    <button onClick={onDelete}>Delete Whitelist</button>
    <button onClick={getAccounts}>Get Accounts</button>
  </>
}
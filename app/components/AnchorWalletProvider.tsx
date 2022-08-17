import React, { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function AnchorWalletProvider({ children }: { children: ReactNode }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network =  WalletAdapterNetwork.Devnet;

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = 'http://127.0.0.1:8899';

  console.log(`Using ${endpoint} RPC endpoint`);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter(),
      new SolflareWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
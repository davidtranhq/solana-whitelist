import React from 'react';
import {
  Program,
  AnchorProvider,
  web3,
} from '@project-serum/anchor'
import {
  Connection,
  PublicKey
} from '@solana/web3.js'

import { Whitelist } from './lib/whitelist';
import idl from './lib/idl';

declare global {
  interface Window { solana: any; }
}

// the address of the on-chain program
const programID = new PublicKey("FRs2XJmvEULEm4X1Y17nZ8rmKMU7R1EqJVLMZxCTez6Q")

function Home() {
  const [program, setProgram] = React.useState<Program<Whitelist>>();

  React.useEffect(() => {
    // initialize the connection to the program on load
    if (window.solana === undefined) {
      console.log("Install a wallet manager extension such as 'Phantom'!");
      return;
    }
    window.solana.on("connect", () => {
      const wallet = window.solana
      const network = "http://127.0.0.1:8899"
      const connection = new Connection(network);

      const providerOpts = {};
      const provider = new AnchorProvider(
        connection,
        wallet,
        providerOpts,
      ); 

      setProgram(new Program<Whitelist>(idl as Whitelist, programID, provider));
    })
    return () => {
      window.solana.disconnect();
    }
  }, [])

  async function getWallet() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
    } catch (err) {
      console.log('err: ', err)
    }
  }
  return (
    <div className="App">
      Hello, world!
    </div>
  );
}

export default Home;

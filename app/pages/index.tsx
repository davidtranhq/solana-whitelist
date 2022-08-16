import WalletAdapter from './components/WalletAdapter'; 
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return <>
    <WalletAdapter>
      <WalletMultiButton />
      <WalletDisconnectButton />
      <div>Hello, world!</div>
    </WalletAdapter>
  </>
}
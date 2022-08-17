import WalletAdapter from '../components/WalletAdapter';
import Home from './Home';

export default function App() {
  return <>
    <WalletAdapter>
      <Home />
    </WalletAdapter>
  </>
}
import AnchorWalletProvider from '../components/AnchorWalletProvider';
import CustomThemeProvider from '../components/CustomThemeProvider';
import Home from './Home';

export default function App() {
  return <>
    <AnchorWalletProvider>
      <CustomThemeProvider>
        <Home />
      </CustomThemeProvider>
    </AnchorWalletProvider>
  </>
}
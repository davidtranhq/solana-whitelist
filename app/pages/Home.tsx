import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import {
  createWhitelist,
  deleteWhitelist,
  checkWhitelist,
  addToWhitelist,
  deleteFromWhitelist,
  checkWhitelisted,
  generateWhitelist
} from '../lib/whitelist';

import idl from '../lib/idl.json';
import { IDL, Whitelist } from '../lib/idl';

// address of the whitelisting program
const programID = new PublicKey(idl.metadata.address);

// data used to build a MUI alert popup for the user
interface AlertInfo {
  variant: 'filled' | 'outlined' | 'standard',
  severity: 'error' | 'warning' | 'info' | 'success'
  msg: string,
};

export default function Home() {
  // config constants required to connect to a Solana RPC
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<Whitelist>(IDL, programID, provider);

  const [whitelistName, setWhitelistName] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [alertInfo, setAlertInfo] = useState<AlertInfo>();

  // get an event handler that handles a state variable using the passed in callback
  const onTextFieldChange = (updateCallback: typeof setWhitelistName) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateCallback(event.target.value);
    }
  }

  // handle the different cases of input for deletion (empty name, empty address, etc.)
  const onDelete = async () => {
    if (whitelistName.length === 0) {
      // empty name
      setAlertInfo({
        variant: 'standard',
        severity: 'error',
        msg: 'Please enter a whitelist name!',
      });
    } else if (whitelistAddress.length === 0) {
      // empty entry
      const whitelistExists = await checkWhitelist(program, wallet, whitelistName);
      if (!whitelistExists) {
        // whitelist does not exist: error
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `There is no whitelist with the name '${whitelistName}' associated with this wallet!`
        });
      } else {
        // whitelist exists and the entry is empty: delete the whitelist
        const res = await deleteWhitelist(program, wallet, whitelistName);
        if (res) {
          setAlertInfo({
            variant: 'filled',
            severity: 'success',
            msg: `Successfully deleted the '${whitelistName}' whitelist!`
          });
        }
      }
    } else {
      // neither the name nor the entry are empty: try to delete the entry from the whitelist
      const whitelist = await generateWhitelist(program, wallet, whitelistName);
      let addressKey;
      try {
        addressKey = new PublicKey(whitelistAddress);
      } catch {
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `'${whitelistAddress} is not a valid public key.`
        })
        return;
      }
      const entryExists = await checkWhitelisted(program, whitelist, addressKey);
      if (!entryExists) {
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `There is no address '${whitelistAddress}' whitelisted in ${whitelistName}!`
        });
      } else {
        const res = await deleteFromWhitelist(program, wallet, whitelist, addressKey);
        if (res) {
          setAlertInfo({
            variant: 'filled',
            severity: 'success',
            msg: `Successfully deleted '${whitelistAddress}' from the '${whitelistName}' whitelist!`
          });
        }
      }
    }
  }

  const onCheck = async () => {
    if (whitelistName.length === 0) {
      setAlertInfo({
        variant: 'standard',
        severity: 'error',
        msg: 'Please enter a whitelist name!',
      });
    } else if (whitelistAddress.length === 0) {
      const whitelistExists = await checkWhitelist(program, wallet, whitelistName);
      if (!whitelistExists) {
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `There is no whitelist with the name '${whitelistName}' associated with this wallet!`
        });
      } else {
        setAlertInfo({
          variant: 'filled',
          severity: 'success',
          msg: `'${whitelistName}' is an existing whitelist associated with this wallet.`
        });
      }
    } else {
      const whitelist = await generateWhitelist(program, wallet, whitelistName);
      let addressKey;
      try {
        addressKey = new PublicKey(whitelistAddress);
      } catch {
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `'${whitelistAddress} is not a valid public key.`
        })
        return;
      }
      const entryExists = await checkWhitelisted(program, whitelist, addressKey);
      if (!entryExists) {
        setAlertInfo({
          variant: 'filled',
          severity: 'error',
          msg: `There is no address '${whitelistAddress}' whitelisted in ${whitelistName}!`
        });
      } else {
        setAlertInfo({
          variant: 'filled',
          severity: 'success',
          msg: `'${whitelistAddress}' is whitelisted in the '${whitelistName}' whitelist!`
        });
      }
    }
  }

  const onCreate = async () => {
    if (whitelistName.length === 0) {
      setAlertInfo({
        variant: 'standard',
        severity: 'error',
        msg: 'Please enter a whitelist name!',
      });
    } else if (whitelistAddress.length === 0) {
      const whitelistExists = await checkWhitelist(program, wallet, whitelistName);
      if (!whitelistExists) {
        const res = await createWhitelist(program, wallet, whitelistName);
        if (res) {
          setAlertInfo({
            variant: 'standard',
            severity: 'success',
            msg: `Successfully created '${whitelistName}'!`
          });
        }
      } else {
        setAlertInfo({
          variant: 'filled',
          severity: 'error',
          msg: `'${whitelistName}' already exists with this wallet!`
        });
      }
    } else {
      const whitelist = await generateWhitelist(program, wallet, whitelistName);
      let addressKey;
      try {
        addressKey = new PublicKey(whitelistAddress);
      } catch {
        setAlertInfo({
          variant: 'standard',
          severity: 'error',
          msg: `'${whitelistAddress} is not a valid public key.`
        })
        return;
      }
      const entryExists = await checkWhitelisted(program, whitelist, addressKey);
      if (!entryExists) {
        const res = await addToWhitelist(program, wallet, whitelist, addressKey);
        if (res) {
          setAlertInfo({
            variant: 'filled',
            severity: 'success',
            msg: `Successfully whitelisted '${whitelistAddress}' in ${whitelistName}!`
          });
        }
      } else {
        setAlertInfo({
          variant: 'filled',
          severity: 'error',
          msg: `'${whitelistAddress}' is already whitelisted in the '${whitelistName}' whitelist!`
        });
      }
    }
  }

  return <>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={2}>
        <Typography variant="h3">Solana Whitelisting</Typography>

        <Stack direction="row" spacing={2}>
          <WalletMultiButton />
          {wallet && <WalletDisconnectButton />}
        </Stack>

        {wallet && <>
          <TextField 
            id="name"
            label="Whitelist Name"
            onChange={onTextFieldChange(setWhitelistName)}
          />
          <TextField
            id="address"
            label="Entry Address"
            onChange={onTextFieldChange(setWhitelistAddress)}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={async () => onDelete()}
              color="error"
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={async () => onCheck()}
            >
              Check
            </Button>
            <Button 
              variant="contained"
              color="success"
              onClick={async () => onCreate()}
            >
              Create
            </Button>
          </Stack>

          {alertInfo &&
            <Alert
              variant={alertInfo.variant}
              severity={alertInfo.severity}
              onClose={() => setAlertInfo(undefined)}
            >
              {alertInfo.msg}
            </Alert>
          }
        </>}
      </Stack>
    </Box>
  </>
}
import { serialize, deserialize } from 'borsh';
import { Struct } from '@solana/web3.js';

const whitelist = new Map([
  [
    Struct,
    {
      kind: 'struct',
      fields: [
        ['authority', 'string'],
        ['name', 'string'],
      ]
    }
  ]
]);

export async function deserializeWhitelist(buffer: Buffer) {
  return deserialize(whitelist, Struct, buffer);
}
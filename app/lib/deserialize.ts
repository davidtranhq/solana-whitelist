import { serialize, deserialize } from 'borsh';
import { Struct } from '@solana/web3.js';

const whitelist = new Map([
  [
    Struct,
    {
      kind: 'struct',
      fields: [
        ['discriminator', [8]],
        ['authority', [32]],
        ['name', [32]],
      ]
    }
  ]
]);

export async function deserializeWhitelist(buffer: Buffer) {
  const struct = deserialize(whitelist, Struct, buffer) as any;
  return {
    authority: new TextDecoder().decode(struct.authority),
    name: new TextDecoder().decode(struct.name),
  };
}


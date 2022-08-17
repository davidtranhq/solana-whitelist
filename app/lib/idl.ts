export type Whitelist = {
  "version": "0.1.0",
  "name": "whitelist",
  "instructions": [
    {
      "name": "initWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "checkWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "addToWhitelist",
      "accounts": [
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountToAdd",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeFromWhitelist",
      "accounts": [
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "accountToDelete",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "checkWhitelisted",
      "accounts": [
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountToCheck",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "whitelist",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "whitelistEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parent",
            "type": "publicKey"
          },
          {
            "name": "whitelisted",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

export const IDL: Whitelist = {
  "version": "0.1.0",
  "name": "whitelist",
  "instructions": [
    {
      "name": "initWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "checkWhitelist",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "addToWhitelist",
      "accounts": [
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountToAdd",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeFromWhitelist",
      "accounts": [
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "accountToDelete",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "checkWhitelisted",
      "accounts": [
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountToCheck",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "whitelist",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "whitelistEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parent",
            "type": "publicKey"
          },
          {
            "name": "whitelisted",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

// USD-SC Smart Contract Configuration

const contractAddress = process.env.NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS

if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
  console.warn(
    "[v0] USD-SC contract address not configured. Please set NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS environment variable.",
  )
}

export const USD_SC_ADDRESS = (contractAddress || "0x0000000000000000000000000000000000000000") as `0x${string}`

export const USD_SC_ABI = [
  // View Functions
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBurned",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Sharia Compliance View Functions
  {
    inputs: [],
    name: "getShariaComplianceBoard",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getShariaCertificateHash",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastShariaAuditTimestamp",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isShariaCertificationActive",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProhibitedSectors",
    outputs: [{ type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "sector", type: "string" }],
    name: "isSectorProhibited",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Role Check Functions
  {
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Write Functions - Transfer
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Minting
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "adminBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Minter Management
  {
    inputs: [
      { name: "minter", type: "address" },
      { name: "minterAllowedAmount", type: "uint256" },
    ],
    name: "configureMinter",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "minter", type: "address" }],
    name: "removeMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Blacklist
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "reason", type: "string" },
    ],
    name: "blacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "unBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Pause
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Sharia Compliance
  {
    inputs: [{ name: "certificateHash", type: "string" }],
    name: "updateShariaCertification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auditHash", type: "string" }],
    name: "recordShariaAudit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "sector", type: "string" }],
    name: "addProhibitedSector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "newComplianceBoard", type: "address" }],
    name: "updateComplianceBoard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Write Functions - Admin
  {
    inputs: [{ name: "newAdmin", type: "address" }],
    name: "transferAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "rescueTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "minter", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "burner", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "account", type: "address" },
      { indexed: false, name: "reason", type: "string" },
    ],
    name: "Blacklist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "account", type: "address" }],
    name: "UnBlacklist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "certificateHash", type: "string" },
      { indexed: false, name: "updatedBy", type: "address" },
    ],
    name: "ShariaCertificationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "timestamp", type: "uint256" },
      { indexed: false, name: "auditHash", type: "string" },
    ],
    name: "ShariaAuditCompleted",
    type: "event",
  },
] as const

// Role constants (keccak256 hashes)
export const ROLES = {
  ADMIN_ROLE: "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  MASTER_MINTER_ROLE: "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
  MINTER_ROLE: "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  PAUSER_ROLE: "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
  BLACKLISTER_ROLE: "0x7a8dc26796a1e50e6e190b70259f58f6a4edd5b22280ceecc82b687b8e982869",
  SHARIA_SUPERVISOR_ROLE: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
} as const

export type RoleType = keyof typeof ROLES

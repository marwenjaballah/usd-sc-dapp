# USD-SC DApp — Sharia‑Compliant Stablecoin Management

A role‑based management dashboard for the USD‑SC stablecoin. Administrators, Master Minters, Minters, Pausers, Blacklisters, and Sharia Supervisors can perform on‑chain actions through a modern Next.js interface using Wagmi and RainbowKit.

- Framework: Next.js 15 (App Router), React 19
- Web3: wagmi + viem, RainbowKit
- UI: Tailwind v4, shadcn‑style components, Radix primitives
- Data: React Query
- Chains: Ethereum mainnet, Sepolia, Arbitrum, Base, Optimism, Polygon, BSC

Key files:
- Contract/roles/ABI: `lib/contract.ts`
- Wagmi config: `lib/wagmi-config.ts`
- Provider composition: `providers/web3-provider.tsx`
- Hooks: `hooks/use-contract-roles.ts`, `hooks/use-token-data.ts`, `hooks/use-toast.ts`
- Pages: `app/*/page.tsx`

---

## Table of Contents
- Features
- Architecture
- Directory Structure
- Prerequisites
- Setup
- Running and Building
- Environment Variables
- Supported Chains and Wallets
- Contract Overview and Roles
- Frontend Pages and Flows
- Development Notes
- Testing Guidance
- Deployment
- Troubleshooting
- Security Considerations
- License

---

## Features
- Role‑based access control UI (Admin, Master Minter, Minter, Pauser, Blacklister, Sharia Supervisor)
- Token operations: Transfer, Mint, Burn, Admin Burn
- Compliance controls: Sharia certification hash, audits, prohibited sectors, compliance board address
- Contract state management: Pause/Unpause
- Wallet connectivity: Injected wallets and WalletConnect (optional)

---

## Architecture

```mermaid
flowchart TD
  A[Wallet (Injected/WalletConnect)] --> B[RainbowKit]
  B --> C[Wagmi Provider]
  C --> D[React Query]
  C --> E[App Pages (Next.js)]
  E -->|useReadContract/useWriteContract| F[USD-SC Contract (lib/contract.ts)]
  E --> G[Role/Token Hooks (hooks/*)]
  E --> H[UI Components (components/*)]
```

- Providers are composed in `providers/web3-provider.tsx` and mounted in `app/layout.tsx`.
- Contract address/ABI and role IDs are centralized in `lib/contract.ts`.
- Chains/connectors/transports are configured in `lib/wagmi-config.ts`.

---

## Directory Structure

```
app/
  layout.tsx                # Root layout, providers, analytics
  page.tsx                  # Landing + role-based redirect
  dashboard/page.tsx        # User dashboard
  admin/page.tsx            # Admin role tools
  master-minter/page.tsx    # Configure/remove minters
  minter/page.tsx           # Mint/burn
  pauser/page.tsx           # Pause/unpause
  blacklister/page.tsx      # Blacklist/unblacklist
  sharia-supervisor/page.tsx# Sharia actions
components/
  dashboard-layout.tsx      # App shell with role-aware nav
  ui/*                      # Buttons, cards, inputs, tabs, toasts, etc.
hooks/
  use-contract-roles.ts     # Wallet role detection
  use-token-data.ts         # Token & compliance reads
  use-toast.ts              # Toast system
lib/
  contract.ts               # USD_SC_ADDRESS, ABI, ROLES
  wagmi-config.ts           # Chains, connectors, transports, SSR
providers/
  web3-provider.tsx         # Wagmi + React Query + RainbowKit
package.json, tsconfig.json, next.config.mjs
```

---

## Prerequisites
- Node.js 18+
- pnpm
- Deployed USD‑SC contract address
- Optional WalletConnect Project ID

---

## Setup

1) Install dependencies
```bash
pnpm install
```

2) Create `.env.local`
```
NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS=0xYourContractAddress
# Optional for WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

3) Start dev server
```bash
pnpm dev
```
Open http://localhost:3000

---

## Running and Building
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start (prod): `pnpm start`
- Lint: `pnpm lint`

Note: `next.config.mjs` ignores TypeScript and ESLint errors during builds. Re‑enable for stricter CI.

---

## Environment Variables
- Required: `NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS`
- Optional: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

Usage:
- Address in `lib/contract.ts`
- WalletConnect in `lib/wagmi-config.ts`

---

## Supported Chains and Wallets
- Chains: mainnet, sepolia, arbitrum, base, optimism, polygon, bsc
- Wallets: Injected (MetaMask, etc.), WalletConnect (if project ID set)

---

## Contract Overview and Roles

Defined in `lib/contract.ts` (ABI excerpt):
- ERC20‑like: `name`, `symbol`, `decimals`, `totalSupply`, `balanceOf`, `transfer`, `mint`, `burn`, `adminBurn`, `totalMinted`, `totalBurned`
- Role checks: `hasRole(role, account)` with role IDs `ROLES.ADMIN_ROLE`, `ROLES.MASTER_MINTER_ROLE`, `ROLES.MINTER_ROLE`, `ROLES.PAUSER_ROLE`, `ROLES.BLACKLISTER_ROLE`, `ROLES.SHARIA_SUPERVISOR_ROLE`
- Minter: `configureMinter`, `removeMinter`
- Blacklist: `isBlacklisted`, `blacklist(account, reason)`, `unBlacklist`
- Pause: `paused`, `pause`, `unpause`
- Sharia compliance:
  - Views: `getShariaComplianceBoard`, `isShariaCertificationActive`, `getShariaCertificateHash`, `getLastShariaAuditTimestamp`, `getProhibitedSectors`, `isSectorProhibited`
  - Writes: `updateShariaCertification`, `recordShariaAudit`, `addProhibitedSector`, `updateComplianceBoard`

Role detection is implemented with `useReadContract` in `hooks/use-contract-roles.ts`.

---

## Frontend Pages and Flows

- `app/page.tsx` — Landing with RainbowKit `ConnectButton`. Redirects to highest privilege page: Admin → Master Minter → Minter → Sharia Supervisor → Blacklister → Pauser → Dashboard.
- `app/dashboard/page.tsx` — Overview of `totalSupply`, `totalMinted`, `totalBurned`, user `balance`. Alerts on `paused`, blacklisted, or certification inactive. Tabs for `transfer` and `burn`.
- `app/admin/page.tsx` — Grant/Revoke roles, `adminBurn(from, amount)`, `transferAdmin`, and `rescueTokens` if supported in the contract. Uses toasts and tx receipts.
- `app/master-minter/page.tsx` — `configureMinter(minter, allowance)`, `removeMinter(minter)`.
- `app/minter/page.tsx` — `mint(to, amount)`, `burn(amount)` (caller).
- `app/pauser/page.tsx` — `pause()`, `unpause()`.
- `app/blacklister/page.tsx` — `blacklist(account, reason)`, `unBlacklist(account)`, status checks.
- `app/sharia-supervisor/page.tsx` — Update certification hash (e.g., IPFS CID), record audits, add prohibited sectors, update compliance board.

All pages use `components/dashboard-layout.tsx` for navigation and status, and `hooks/use-toast.ts` for notifications.

---

## Development Notes
- Providers: `providers/web3-provider.tsx` composes Wagmi, React Query, and RainbowKit, mounted in `app/layout.tsx` with a dark theme and Vercel Analytics.
- Data hooks: `use-token-data.ts` aggregates reads, formats with `viem.formatUnits`.
- Styling: Tailwind v4 + shadcn‑style components under `components/ui/`. Dark mode via `<html class="dark" />`.

---

## Testing Guidance
- Unit tests for hooks (`use-contract-roles`, `use-token-data`) with mocked Wagmi/viem.
- Component tests for role‑gated pages and redirects.
- E2E tests (Playwright) covering connect → navigate → action flows.
- Optional contract integration with a local chain/fork.

---

## Deployment

### Vercel (recommended)
1) Set env vars in Vercel Project Settings
   - `NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional)
2) Deploy from main branch. App Router supported out‑of‑the‑box.
3) Analytics enabled via `@vercel/analytics` in `app/layout.tsx`.

### Self‑hosted
```bash
pnpm build
pnpm start
```
Ensure environment variables are present in the hosting environment.

---

## Troubleshooting
- No data or roles are false:
  - Verify `NEXT_PUBLIC_USD_SC_CONTRACT_ADDRESS` matches deployed network.
  - Ensure wallet is on a supported chain (`lib/wagmi-config.ts`).
- Reverted tx:
  - Check role permissions, pause/blacklist status, and amount formatting.
- WalletConnect not shown:
  - Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
- Build warnings:
  - TypeScript/ESLint errors are ignored by default; re‑enable to harden CI.

---

## Security Considerations
- UI role checks are convenience; on‑chain validation enforces permissions.
- Validate the target network before privileged actions.
- Do not expose secrets or hardcode keys.
- Consider stricter input validation (addresses, amounts) and network guards.

---

## License
MIT


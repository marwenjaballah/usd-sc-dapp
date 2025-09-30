import { http, createConfig } from "wagmi"
import {
  mainnet,
  sepolia,
  arbitrum,
  base,
  optimism,
  polygon,
  bsc,
} from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
import type { CreateConnectorFn } from "wagmi"

// Configure chains & providers
const connectors: readonly CreateConnectorFn[] =
  typeof window !== "undefined"
    ? [
        injected(),
        ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
          ? [
              walletConnect({
                projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
              }),
            ]
          : []),
      ]
    : [injected()]

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    arbitrum,
    base,
    optimism,
    polygon,
    bsc,
  ],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true,
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}

"use client"

import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield, Coins, Lock } from "lucide-react"

export default function HomePage() {
  const { isConnected, address } = useAccount()
  const { hasAnyRole, isAdmin, isMasterMinter, isMinter, isShariaSupervisor, isBlacklister, isPauser } =
    useContractRoles()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && address) {
      // Route based on highest privilege role
      if (isAdmin) {
        router.push("/admin")
      } else if (isMasterMinter) {
        router.push("/master-minter")
      } else if (isMinter) {
        router.push("/minter")
      } else if (isShariaSupervisor) {
        router.push("/sharia-supervisor")
      } else if (isBlacklister) {
        router.push("/blacklister")
      } else if (isPauser) {
        router.push("/pauser")
      } else {
        router.push("/dashboard")
      }
    }
  }, [
    isConnected,
    address,
    hasAnyRole,
    isAdmin,
    isMasterMinter,
    isMinter,
    isShariaSupervisor,
    isBlacklister,
    isPauser,
    router,
  ])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">USD-SC</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharia Compliant USD Stablecoin Management Platform
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            A transparent, ethical, and compliant stablecoin built on blockchain technology with full Sharia oversight
          </p>
        </div>

        {/* Connect Wallet Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-lg p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to access the USD-SC management platform
                </p>
              </div>

              <div className="flex justify-center">
                <ConnectButton />
              </div>

              {isConnected && !hasAnyRole && (
                <div className="bg-muted/50 border border-border rounded-md p-4 text-center">
                  <p className="text-sm text-muted-foreground">Wallet connected. Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Sharia Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Fully certified and audited by Sharia compliance board with transparent oversight
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold">Transparent Operations</h3>
            <p className="text-sm text-muted-foreground">
              All minting, burning, and compliance activities are recorded on-chain
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Role-Based Access</h3>
            <p className="text-sm text-muted-foreground">
              Secure role-based permissions for admins, minters, and compliance supervisors
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useTokenData } from "@/hooks/use-token-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Coins, Ban, Pause, FileCheck, LayoutDashboard, Menu, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { address } = useAccount()
  const { isAdmin, isMasterMinter, isMinter, isShariaSupervisor, isBlacklister, isPauser } = useContractRoles()
  const { balance, isPaused, shariaCertActive } = useTokenData()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Admin", href: "/admin", icon: Shield, show: isAdmin },
    { name: "Master Minter", href: "/master-minter", icon: Coins, show: isMasterMinter },
    { name: "Minter", href: "/minter", icon: Coins, show: isMinter },
    { name: "Sharia Supervisor", href: "/sharia-supervisor", icon: FileCheck, show: isShariaSupervisor },
    { name: "Blacklister", href: "/blacklister", icon: Ban, show: isBlacklister },
    { name: "Pauser", href: "/pauser", icon: Pause, show: isPauser },
    { name: "Docs", href: "/docs", icon: FileText, show: true },
  ].filter((item) => item.show)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg">USD-SC</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Status indicators */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Contract Status</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-medium",
                  isPaused ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
                )}
              >
                {isPaused ? "Paused" : "Active"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Sharia Cert</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-medium",
                  shariaCertActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
                )}
              >
                {shariaCertActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Your Balance</div>
            <div className="text-lg font-bold mb-3">{Number(balance).toLocaleString()} USD-SC</div>
            <div className="text-xs text-muted-foreground mb-2 truncate">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            <ConnectButton />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

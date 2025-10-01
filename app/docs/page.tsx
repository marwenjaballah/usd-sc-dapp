"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Coins, Pause, Ban, FileCheck, LayoutDashboard, ExternalLink } from "lucide-react"

export default function DocsPage() {
  return (
    <DashboardLayout
      title="How to Use USD‑SC"
      description="A simple guide for finance professionals to use the USD‑SC management app without coding."
    >
      <div className="grid gap-6">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get set up in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ol className="list-decimal pl-6 space-y-2">
              <li>Install a crypto wallet browser extension (e.g., MetaMask) or use a mobile wallet via WalletConnect.</li>
              <li>Click the "Connect" button in the top bar and choose your wallet.</li>
              <li>Ensure your wallet network matches a supported network (Ethereum, Sepolia, Arbitrum, Base, Optimism, Polygon, BSC).</li>
              <li>Once connected, you will be redirected to the page that matches your role (Admin, Master Minter, Minter, Sharia Supervisor, Blacklister, Pauser). If you don’t have a role, you’ll see the Dashboard.</li>
            </ol>
            <Alert>
              <AlertDescription>
                Your access is controlled on‑chain. If you believe you should have extra permissions, contact your Admin to grant the appropriate role.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* What You Can Do */}
        <Card>
          <CardHeader>
            <CardTitle>What You Can Do</CardTitle>
            <CardDescription>Each page matches a business responsibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RoleCard
                icon={<LayoutDashboard className="w-4 h-4" />}
                title="Dashboard"
                desc="View balances, total supply, mint/burn totals. Send tokens or burn your own tokens if enabled."
                href="/dashboard"
              />
              <RoleCard
                icon={<Shield className="w-4 h-4" />}
                title="Admin"
                desc="Grant or revoke roles, perform admin burns, transfer admin, rescue tokens sent by mistake to the contract."
                href="/admin"
              />
              <RoleCard
                icon={<Coins className="w-4 h-4" />}
                title="Master Minter"
                desc="Authorize minters and set their allowances, or remove minters."
                href="/master-minter"
              />
              <RoleCard
                icon={<Coins className="w-4 h-4" />}
                title="Minter"
                desc="Mint new USD‑SC to recipients and burn from your own balance as required by policy."
                href="/minter"
              />
              <RoleCard
                icon={<Pause className="w-4 h-4" />}
                title="Pauser"
                desc="Temporarily pause or unpause token operations in emergencies or during maintenance."
                href="/pauser"
              />
              <RoleCard
                icon={<Ban className="w-4 h-4" />}
                title="Blacklister"
                desc="Blacklist or unblacklist accounts to comply with policy and regulation."
                href="/blacklister"
              />
              <RoleCard
                icon={<FileCheck className="w-4 h-4" />}
                title="Sharia Supervisor"
                desc="Update certification hash (e.g., IPFS link), record audits, add prohibited sectors, update compliance board."
                href="/sharia-supervisor"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Step‑by‑Step</CardTitle>
            <CardDescription>Typical workflows by responsibility</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mint">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="mint">Minting (Minter)</TabsTrigger>
                <TabsTrigger value="mm">Configure Minters (Master Minter)</TabsTrigger>
                <TabsTrigger value="admin">Roles & Admin (Admin)</TabsTrigger>
                <TabsTrigger value="pause">Pause Control (Pauser)</TabsTrigger>
                <TabsTrigger value="black">Blacklisting (Blacklister)</TabsTrigger>
                <TabsTrigger value="sharia">Sharia Oversight</TabsTrigger>
              </TabsList>

              <TabsContent value="mint" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open the <Link href="/minter" className="underline">Minter</Link> page.</li>
                  <li>Enter the recipient address and amount. Amounts are in whole tokens (decimals handled automatically).</li>
                  <li>Press Mint and confirm the transaction in your wallet.</li>
                  <li>Wait for confirmation. You’ll see a toast and updated balances.</li>
                </ol>
              </TabsContent>

              <TabsContent value="mm" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open <Link href="/master-minter" className="underline">Master Minter</Link>.</li>
                  <li>To authorize a minter, enter their address and set an allowance.</li>
                  <li>Click Configure and confirm in your wallet. To revoke, use Remove Minter.</li>
                  <li>Communicate the allowance and policy to the minter.
                  </li>
                </ol>
              </TabsContent>

              <TabsContent value="admin" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open <Link href="/admin" className="underline">Admin</Link>.</li>
                  <li>Use Roles tab to grant or revoke permissions using the target wallet address.</li>
                  <li>Use Admin Burn to remove tokens from an account when policy requires.</li>
                  <li>Use Transfer Admin to designate a new overall admin. Rescue Tokens can recover non‑USD‑SC tokens sent to the contract.</li>
                </ol>
              </TabsContent>

              <TabsContent value="pause" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open <Link href="/pauser" className="underline">Pauser</Link>.</li>
                  <li>Click Pause in an emergency or during maintenance windows. Use Unpause to restore operations.</li>
                  <li>Coordinate with compliance and operations before pausing on production networks.</li>
                </ol>
              </TabsContent>

              <TabsContent value="black" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open <Link href="/blacklister" className="underline">Blacklister</Link>.</li>
                  <li>Enter the account and reason to blacklist as per policy; confirm the transaction.</li>
                  <li>Use Unblacklist to restore access when appropriate.</li>
                </ol>
              </TabsContent>

              <TabsContent value="sharia" className="space-y-2 text-sm text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Open <Link href="/sharia-supervisor" className="underline">Sharia Supervisor</Link>.</li>
                  <li>Update the certification hash (e.g., IPFS CID link to a PDF), record audit hashes, and maintain the list of prohibited sectors.</li>
                  <li>Update the compliance board address if governance changes.</li>
                </ol>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Safety & Best Practices</CardTitle>
            <CardDescription>Reduce operational risk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-6 space-y-1">
              <li>Always verify the network and contract address you are interacting with.</li>
              <li>Use a hardware wallet for high‑value operations and maintain multi‑signature policies when possible.</li>
              <li>Double‑check recipient addresses and amounts before approving transactions.</li>
              <li>Pause the contract only with an agreed incident process; communicate clearly to stakeholders.</li>
              <li>Maintain an audit trail: store certification/audit documents on IPFS or trusted repositories.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Glossary */}
        <Card>
          <CardHeader>
            <CardTitle>Glossary</CardTitle>
            <CardDescription>Plain‑English definitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <dl className="grid md:grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-foreground">Wallet</dt>
                <dd>A secure application used to approve transactions from your account (e.g., MetaMask).</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Network</dt>
                <dd>A blockchain like Ethereum or Polygon. Your wallet must be on the same network as the contract.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Mint</dt>
                <dd>Create new tokens and assign them to an account, following internal policy and limits.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Burn</dt>
                <dd>Permanently remove tokens from circulation.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Pause</dt>
                <dd>Temporarily disable token transfers/mints/burns in emergencies or maintenance.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Blacklist</dt>
                <dd>Block an account from using the token to meet compliance or regulatory requirements.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Sharia Certification</dt>
                <dd>Evidence (e.g., a document hash) that the token and operations comply with Sharia principles.</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact your Admin or Operations team</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              If you encounter issues (e.g., missing permissions, transaction rejections), contact your Admin. Provide the
              transaction hash and a short description of the problem.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard"><Button variant="secondary" size="sm">Open Dashboard</Button></Link>
              <Link href="/admin"><Button variant="outline" size="sm"><Shield className="w-3 h-3 mr-1"/>Admin</Button></Link>
              <Link href="/minter"><Button variant="outline" size="sm"><Coins className="w-3 h-3 mr-1"/>Minter</Button></Link>
              <Link href="/sharia-supervisor"><Button variant="outline" size="sm"><FileCheck className="w-3 h-3 mr-1"/>Sharia</Button></Link>
              <a href="https://support.rainbowkit.com" target="_blank" rel="noreferrer" className="inline-flex"><Button variant="ghost" size="sm"><ExternalLink className="w-3 h-3 mr-1"/>Wallet Help</Button></a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function RoleCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  href: string
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card flex flex-col gap-2">
      <div className="flex items-center gap-2 text-foreground">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">{icon}</div>
        <div className="font-medium">{title}</div>
      </div>
      <div className="text-sm text-muted-foreground">{desc}</div>
      <div>
        <Link href={href} className="inline-flex items-center text-sm underline">
          Open <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  )
}

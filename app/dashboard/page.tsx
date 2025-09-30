"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useTokenData } from "@/hooks/use-token-data"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, TrendingUp, TrendingDown, Shield, AlertCircle, Ban, Send, Flame, BarChart3 } from "lucide-react"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { parseUnits } from "viem"

export default function DashboardPage() {
  const { address } = useAccount()
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const {
    balance,
    totalSupply,
    totalMinted,
    totalBurned,
    isPaused,
    isBlacklisted,
    shariaCertActive,
    shariaCertHash,
    lastAuditTimestamp,
    prohibitedSectors,
    refetchBalance,
  } = useTokenData()

  // Transfer State
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("")

  // Burn State
  const [burnAmount, setBurnAmount] = useState("")

  const { data: complianceBoard } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "getShariaComplianceBoard",
  })

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Never"
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "transfer",
        args: [transferTo as `0x${string}`, parseUnits(transferAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Transferring tokens..." })
      setTransferTo("")
      setTransferAmount("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleBurn = async () => {
    if (!burnAmount) {
      toast({ title: "Error", description: "Please enter burn amount", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "burn",
        args: [parseUnits(burnAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Burning tokens..." })
      setBurnAmount("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  return (
    <DashboardLayout title="Dashboard" description="Overview of your USD-SC account and token metrics">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Alerts */}
          {isPaused && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The contract is currently paused. All transfers and minting operations are disabled.
              </AlertDescription>
            </Alert>
          )}

          {isBlacklisted && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Your address is blacklisted. You cannot perform any token operations.</AlertDescription>
            </Alert>
          )}

          {!shariaCertActive && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Sharia certification is not active. Token operations may be restricted.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(balance).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">USD-SC tokens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(totalSupply).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Circulating tokens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(totalMinted).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time minted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Burned</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(totalBurned).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time burned</p>
              </CardContent>
            </Card>
          </div>

          {/* Sharia Compliance Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Sharia Compliance Status
                </CardTitle>
                <CardDescription>Current certification and audit information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Certification Status</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      shariaCertActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {shariaCertActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Audit</span>
                  <span className="text-sm font-medium">{formatDate(lastAuditTimestamp)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Certificate Hash</span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded truncate">
                    {shariaCertHash || "Not set"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Compliance Board</span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded truncate">
                    {complianceBoard as string}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prohibited Sectors</CardTitle>
                <CardDescription>Sectors excluded from USD-SC operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {prohibitedSectors.map((sector, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded">
                      <Ban className="h-3 w-3 text-destructive" />
                      <span className="capitalize">{sector.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Transfer Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Transfer Tokens
                </CardTitle>
                <CardDescription>Send USD-SC tokens to another address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-to">Recipient Address</Label>
                  <Input
                    id="transfer-to"
                    placeholder="0x..."
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    disabled={isPaused || isBlacklisted}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transfer-amount">Amount (USD-SC)</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    disabled={isPaused || isBlacklisted}
                  />
                  <p className="text-xs text-muted-foreground">Available: {Number(balance).toLocaleString()} USD-SC</p>
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={isPending || isConfirming || isPaused || isBlacklisted}
                  className="w-full"
                >
                  {isPending || isConfirming ? "Processing..." : "Transfer Tokens"}
                </Button>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Transfer Requirements</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Sufficient balance required</li>
                    <li>• Recipient cannot be blacklisted</li>
                    <li>• Contract must not be paused</li>
                    <li>• Sharia certification must be active</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Burn Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-destructive" />
                  Burn Tokens
                </CardTitle>
                <CardDescription>Permanently destroy your USD-SC tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Burning tokens permanently removes them from circulation. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="burn-amount">Amount (USD-SC)</Label>
                  <Input
                    id="burn-amount"
                    type="number"
                    placeholder="0.00"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    disabled={isPaused || isBlacklisted}
                  />
                  <p className="text-xs text-muted-foreground">Available: {Number(balance).toLocaleString()} USD-SC</p>
                </div>

                <Button
                  onClick={handleBurn}
                  disabled={isPending || isConfirming || isPaused || isBlacklisted}
                  variant="destructive"
                  className="w-full"
                >
                  {isPending || isConfirming ? "Processing..." : "Burn Tokens"}
                </Button>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Burn Information</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Reduces total supply</li>
                    <li>• Cannot be reversed</li>
                    <li>• You must have sufficient balance</li>
                    <li>• Your address cannot be blacklisted</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Token Analytics
              </CardTitle>
              <CardDescription>Comprehensive metrics and statistics for USD-SC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Supply Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Supply</span>
                      <span className="text-sm font-bold">{Number(totalSupply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Minted</span>
                      <span className="text-sm font-bold text-primary">{Number(totalMinted).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Burned</span>
                      <span className="text-sm font-bold text-destructive">{Number(totalBurned).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Net Supply</span>
                      <span className="text-sm font-bold">
                        {(Number(totalMinted) - Number(totalBurned)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Your Holdings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Balance</span>
                      <span className="text-sm font-bold">{Number(balance).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">% of Supply</span>
                      <span className="text-sm font-bold">
                        {totalSupply !== "0" ? ((Number(balance) / Number(totalSupply)) * 100).toFixed(4) : "0.00"}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          isBlacklisted ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
                        )}
                      >
                        {isBlacklisted ? "Blacklisted" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Contract Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Contract State</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          isPaused ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
                        )}
                      >
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharia Cert</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          shariaCertActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {shariaCertActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Audit</span>
                      <span className="text-xs font-medium">{formatDate(lastAuditTimestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Analytics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalMinted !== "0" ? ((Number(totalBurned) / Number(totalMinted)) * 100).toFixed(2) : "0.00"}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Of total minted supply</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prohibited Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prohibitedSectors.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Excluded industries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Contract Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono break-all bg-muted px-2 py-1 rounded">{USD_SC_ADDRESS}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

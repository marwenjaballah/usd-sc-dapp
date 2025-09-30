"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Coins, TrendingUp, AlertCircle, Flame } from "lucide-react"
import { parseUnits } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTokenData } from "@/hooks/use-token-data"

export default function MinterPage() {
  const { isMinter } = useContractRoles()
  const { address } = useAccount()
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })
  const { refetchBalance } = useTokenData()

  // Mint State
  const [mintToAddress, setMintToAddress] = useState("")
  const [mintAmount, setMintAmount] = useState("")

  // Burn State
  const [burnAmount, setBurnAmount] = useState("")

  // Get minter allowance (this would need to be added to the contract or tracked off-chain)
  // For now, we'll show a placeholder
  const [minterAllowance, setMinterAllowance] = useState("0")

  useEffect(() => {
    if (hash) {
      refetchBalance()
    }
  }, [hash, refetchBalance])

  if (!isMinter) {
    return (
      <DashboardLayout title="Minter Dashboard" description="Mint and burn USD-SC tokens">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have Minter privileges. This page is restricted to authorized Minters only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const handleMint = async () => {
    if (!mintToAddress || !mintAmount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "mint",
        args: [mintToAddress as `0x${string}`, parseUnits(mintAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Minting tokens..." })
      setMintToAddress("")
      setMintAmount("")
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
    <DashboardLayout title="Minter Dashboard" description="Mint new tokens and burn existing ones">
      <div className="space-y-6">
        {/* Allowance Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              Your Minting Allowance
            </CardTitle>
            <CardDescription>Remaining tokens you can mint before needing a new allowance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{Number(minterAllowance).toLocaleString()}</span>
              <span className="text-muted-foreground">USD-SC</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Contact a Master Minter to increase your allowance</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mint Tokens Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Mint Tokens
              </CardTitle>
              <CardDescription>Create new USD-SC tokens within your allowance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mint-to">Recipient Address</Label>
                <Input
                  id="mint-to"
                  placeholder="0x..."
                  value={mintToAddress}
                  onChange={(e) => setMintToAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mint-amount">Amount (USD-SC)</Label>
                <Input
                  id="mint-amount"
                  type="number"
                  placeholder="0.00"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Must be within your remaining allowance</p>
              </div>

              <Button onClick={handleMint} disabled={isPending || isConfirming} className="w-full">
                {isPending || isConfirming ? "Processing..." : "Mint Tokens"}
              </Button>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Minting Requirements</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Amount must not exceed your allowance</li>
                  <li>• Recipient cannot be blacklisted</li>
                  <li>• Contract must not be paused</li>
                  <li>• Sharia certification must be active</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Burn Tokens Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
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
                />
                <p className="text-xs text-muted-foreground">Tokens will be burned from your balance</p>
              </div>

              <Button
                onClick={handleBurn}
                disabled={isPending || isConfirming}
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

        {/* Minter Info */}
        <Card>
          <CardHeader>
            <CardTitle>Minter Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Responsibilities</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mint tokens as authorized</li>
                  <li>• Stay within allowance limits</li>
                  <li>• Verify recipient addresses</li>
                  <li>• Follow compliance guidelines</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Restrictions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cannot exceed allowance</li>
                  <li>• Cannot mint when paused</li>
                  <li>• Cannot mint to blacklisted addresses</li>
                  <li>• Requires active Sharia certification</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Double-check recipient addresses</li>
                  <li>• Monitor your allowance</li>
                  <li>• Keep records of minting activity</li>
                  <li>• Report any issues immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

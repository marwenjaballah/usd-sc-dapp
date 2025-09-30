"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Coins, UserPlus, UserMinus, AlertCircle } from "lucide-react"
import { parseUnits } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MasterMinterPage() {
  const { isMasterMinter } = useContractRoles()
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Configure Minter State
  const [minterAddress, setMinterAddress] = useState("")
  const [allowanceAmount, setAllowanceAmount] = useState("")

  // Remove Minter State
  const [removeMinterAddress, setRemoveMinterAddress] = useState("")

  if (!isMasterMinter) {
    return (
      <DashboardLayout title="Master Minter Dashboard" description="Configure minters and manage allowances">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have Master Minter privileges. This page is restricted to Master Minters only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const handleConfigureMinter = async () => {
    if (!minterAddress || !allowanceAmount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "configureMinter",
        args: [minterAddress as `0x${string}`, parseUnits(allowanceAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Configuring minter..." })
      setMinterAddress("")
      setAllowanceAmount("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleRemoveMinter = async () => {
    if (!removeMinterAddress) {
      toast({ title: "Error", description: "Please enter minter address", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "removeMinter",
        args: [removeMinterAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Removing minter..." })
      setRemoveMinterAddress("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  return (
    <DashboardLayout
      title="Master Minter Dashboard"
      description="Configure minters and manage their minting allowances"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Configure Minter Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Configure Minter
            </CardTitle>
            <CardDescription>Add a new minter or update their allowance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minter-address">Minter Address</Label>
              <Input
                id="minter-address"
                placeholder="0x..."
                value={minterAddress}
                onChange={(e) => setMinterAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowance-amount">Minting Allowance (USD-SC)</Label>
              <Input
                id="allowance-amount"
                type="number"
                placeholder="0.00"
                value={allowanceAmount}
                onChange={(e) => setAllowanceAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum amount this minter can mint before needing a new allowance
              </p>
            </div>

            <Button onClick={handleConfigureMinter} disabled={isPending || isConfirming} className="w-full">
              {isPending || isConfirming ? "Processing..." : "Configure Minter"}
            </Button>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">How it works</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Grants MINTER_ROLE to the address</li>
                <li>• Sets their minting allowance</li>
                <li>• Allowance decreases with each mint</li>
                <li>• Can be updated anytime by Master Minter</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Remove Minter Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="w-5 h-5 text-destructive" />
              Remove Minter
            </CardTitle>
            <CardDescription>Revoke minting privileges from an address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will revoke the MINTER_ROLE and set their allowance to zero. They will no longer be able to mint
                tokens.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="remove-minter-address">Minter Address</Label>
              <Input
                id="remove-minter-address"
                placeholder="0x..."
                value={removeMinterAddress}
                onChange={(e) => setRemoveMinterAddress(e.target.value)}
              />
            </div>

            <Button
              onClick={handleRemoveMinter}
              disabled={isPending || isConfirming}
              variant="destructive"
              className="w-full"
            >
              {isPending || isConfirming ? "Processing..." : "Remove Minter"}
            </Button>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">What happens</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• MINTER_ROLE is revoked</li>
                <li>• Minting allowance set to 0</li>
                <li>• Cannot mint any more tokens</li>
                <li>• Can be re-added later if needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Master Minter Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Key Functions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Configure new minters with allowances</li>
                <li>• Update existing minter allowances</li>
                <li>• Remove minters when needed</li>
                <li>• Monitor minting activity</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set appropriate allowances based on need</li>
                <li>• Regularly review active minters</li>
                <li>• Remove unused minter accounts</li>
                <li>• Coordinate with Sharia Supervisor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

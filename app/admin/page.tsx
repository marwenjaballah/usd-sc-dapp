"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI, ROLES } from "@/lib/contract"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Shield, Users, Trash2, ArrowRightLeft, LifeBuoy, Coins } from "lucide-react"
import { parseUnits } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { isAdmin } = useContractRoles()
  const { address } = useAccount()
  const { toast } = useToast()
  const router = useRouter()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Track current action for user feedback
  const [currentAction, setCurrentAction] = useState<string | null>(null)

  // Role Management State
  const [roleAddress, setRoleAddress] = useState("")
  const [selectedRole, setSelectedRole] = useState<keyof typeof ROLES>("MINTER_ROLE")

  // Admin Burn State
  const [burnAddress, setBurnAddress] = useState("")
  const [burnAmount, setBurnAmount] = useState("")

  // Transfer Admin State
  const [newAdminAddress, setNewAdminAddress] = useState("")

  // Token Rescue State
  const [tokenAddress, setTokenAddress] = useState("")
  const [rescueAddress, setRescueAddress] = useState("")
  const [rescueAmount, setRescueAmount] = useState("")
  
    // Notify on confirmation and refresh page data
    useEffect(() => {
      if (!isSuccess || !receipt) return
      const txStatus = receipt.status
      if (txStatus === "success") {
        toast({
          title: currentAction ? `${currentAction} Confirmed` : "Transaction Confirmed",
          description: `Tx ${receipt.transactionHash.slice(0, 10)}... confirmed`,
        })
        // Clear inputs after successful actions
        setRoleAddress("")
        setBurnAddress("")
        setBurnAmount("")
        setNewAdminAddress("")
        setTokenAddress("")
        setRescueAddress("")
        setRescueAmount("")
        router.refresh()
      } else if (txStatus === "reverted") {
        toast({
          title: currentAction ? `${currentAction} Reverted` : "Transaction Reverted",
          description: `Tx ${receipt.transactionHash.slice(0, 10)}... reverted`,
          variant: "destructive",
        })
      }
      setCurrentAction(null)
    }, [isSuccess, receipt, toast, router, currentAction])

  if (!isAdmin) {
    return (
      <DashboardLayout title="Admin Dashboard" description="Manage roles and administrative functions">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have admin privileges. This page is restricted to administrators only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const handleGrantRole = async () => {
    if (!roleAddress) {
      toast({ title: "Error", description: "Please enter an address", variant: "destructive" })
      return
    }

    try {
      setCurrentAction("Grant Role")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "grantRole",
        args: [ROLES[selectedRole] as `0x${string}`, roleAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Granting role..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleRevokeRole = async () => {
    if (!roleAddress) {
      toast({ title: "Error", description: "Please enter an address", variant: "destructive" })
      return
    }

    try {
      setCurrentAction("Revoke Role")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "revokeRole",
        args: [ROLES[selectedRole] as `0x${string}`, roleAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Revoking role..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleAdminBurn = async () => {
    if (!burnAddress || !burnAmount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      setCurrentAction("Admin Burn")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "adminBurn",
        args: [burnAddress as `0x${string}`, parseUnits(burnAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Burning tokens..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleTransferAdmin = async () => {
    if (!newAdminAddress) {
      toast({ title: "Error", description: "Please enter new admin address", variant: "destructive" })
      return
    }

    try {
      setCurrentAction("Transfer Admin")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "transferAdmin",
        args: [newAdminAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Transferring admin role..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleRescueTokens = async () => {
    if (!tokenAddress || !rescueAddress || !rescueAmount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      setCurrentAction("Rescue Tokens")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "rescueTokens",
        args: [tokenAddress as `0x${string}`, rescueAddress as `0x${string}`, parseUnits(rescueAmount, 18)],
      })
      toast({ title: "Transaction Submitted", description: "Rescuing tokens..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard" description="Manage roles, permissions, and administrative functions">
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="roles">
            <Users className="w-4 h-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="burn">
            <Trash2 className="w-4 h-4 mr-2" />
            Burn
          </TabsTrigger>
          <TabsTrigger value="transfer">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Transfer
          </TabsTrigger>
          <TabsTrigger value="rescue">
            <LifeBuoy className="w-4 h-4 mr-2" />
            Rescue
          </TabsTrigger>
        </TabsList>

        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role Management
              </CardTitle>
              <CardDescription>Grant or revoke roles for addresses in the USD-SC contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-address">Address</Label>
                  <Input
                    id="role-address"
                    placeholder="0x..."
                    value={roleAddress}
                    onChange={(e) => setRoleAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role-select">Role</Label>
                  <select
                    id="role-select"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as keyof typeof ROLES)}
                  >
                    <option value="ADMIN_ROLE">Admin</option>
                    <option value="MASTER_MINTER_ROLE">Master Minter</option>
                    <option value="MINTER_ROLE">Minter</option>
                    <option value="PAUSER_ROLE">Pauser</option>
                    <option value="BLACKLISTER_ROLE">Blacklister</option>
                    <option value="SHARIA_SUPERVISOR_ROLE">Sharia Supervisor</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleGrantRole} disabled={isPending || isConfirming} className="flex-1">
                    {isPending || isConfirming ? "Processing..." : "Grant Role"}
                  </Button>
                  <Button
                    onClick={handleRevokeRole}
                    disabled={isPending || isConfirming}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isPending || isConfirming ? "Processing..." : "Revoke Role"}
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Available Roles</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>Admin:</strong> Full control over contract
                  </li>
                  <li>
                    • <strong>Master Minter:</strong> Configure minters and allowances
                  </li>
                  <li>
                    • <strong>Minter:</strong> Mint tokens within allowance
                  </li>
                  <li>
                    • <strong>Pauser:</strong> Pause/unpause contract
                  </li>
                  <li>
                    • <strong>Blacklister:</strong> Manage blacklist
                  </li>
                  <li>
                    • <strong>Sharia Supervisor:</strong> Manage compliance
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admin Burn Tab */}
        <TabsContent value="burn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Admin Burn
              </CardTitle>
              <CardDescription>Burn tokens from any address (admin privilege)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will permanently destroy tokens from the specified address. Use with caution.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="burn-address">Address to Burn From</Label>
                <Input
                  id="burn-address"
                  placeholder="0x..."
                  value={burnAddress}
                  onChange={(e) => setBurnAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="burn-amount">Amount (USD-SC)</Label>
                <Input
                  id="burn-amount"
                  type="number"
                  placeholder="0.00"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                />
              </div>

              <Button
                onClick={handleAdminBurn}
                disabled={isPending || isConfirming}
                variant="destructive"
                className="w-full"
              >
                {isPending || isConfirming ? "Processing..." : "Burn Tokens"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer Admin Tab */}
        <TabsContent value="transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Transfer Admin Role
              </CardTitle>
              <CardDescription>Transfer all admin privileges to a new address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will transfer all admin roles to the new address and revoke your admin privileges. This action
                  cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="new-admin">New Admin Address</Label>
                <Input
                  id="new-admin"
                  placeholder="0x..."
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Current Admin</h4>
                <p className="text-xs font-mono">{address}</p>
              </div>

              <Button
                onClick={handleTransferAdmin}
                disabled={isPending || isConfirming}
                variant="destructive"
                className="w-full"
              >
                {isPending || isConfirming ? "Processing..." : "Transfer Admin Role"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Rescue Tab */}
        <TabsContent value="rescue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5" />
                Token Rescue
              </CardTitle>
              <CardDescription>Rescue accidentally sent ERC20 tokens from the contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This function allows you to recover ERC20 tokens that were accidentally sent to the USD-SC contract.
                  You cannot rescue USD-SC tokens.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="token-address">Token Contract Address</Label>
                <Input
                  id="token-address"
                  placeholder="0x..."
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rescue-to">Rescue To Address</Label>
                <Input
                  id="rescue-to"
                  placeholder="0x..."
                  value={rescueAddress}
                  onChange={(e) => setRescueAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rescue-amount">Amount</Label>
                <Input
                  id="rescue-amount"
                  type="number"
                  placeholder="0.00"
                  value={rescueAmount}
                  onChange={(e) => setRescueAmount(e.target.value)}
                />
              </div>

              <Button onClick={handleRescueTokens} disabled={isPending || isConfirming} className="w-full">
                {isPending || isConfirming ? "Processing..." : "Rescue Tokens"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

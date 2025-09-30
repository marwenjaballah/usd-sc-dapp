"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Ban, ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BlacklisterPage() {
  const { isBlacklister } = useContractRoles()
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Blacklist State
  const [blacklistAddress, setBlacklistAddress] = useState("")
  const [blacklistReason, setBlacklistReason] = useState("")

  // Unblacklist State
  const [unblacklistAddress, setUnblacklistAddress] = useState("")

  // Check Address State
  const [checkAddress, setCheckAddress] = useState("")
  const { data: isAddressBlacklisted, refetch: refetchBlacklistStatus } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "isBlacklisted",
    args: checkAddress ? [checkAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!checkAddress && checkAddress.length === 42,
    },
  })

  if (!isBlacklister) {
    return (
      <DashboardLayout title="Blacklister Dashboard" description="Manage address blacklist for compliance">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have Blacklister privileges. This page is restricted to authorized Blacklisters only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const handleBlacklist = async () => {
    if (!blacklistAddress || !blacklistReason) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "blacklist",
        args: [blacklistAddress as `0x${string}`, blacklistReason],
      })
      toast({ title: "Transaction Submitted", description: "Blacklisting address..." })
      setBlacklistAddress("")
      setBlacklistReason("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleUnblacklist = async () => {
    if (!unblacklistAddress) {
      toast({ title: "Error", description: "Please enter address", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "unBlacklist",
        args: [unblacklistAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Removing from blacklist..." })
      setUnblacklistAddress("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleCheckAddress = () => {
    if (checkAddress && checkAddress.length === 42) {
      refetchBlacklistStatus()
    } else {
      toast({ title: "Error", description: "Please enter a valid address", variant: "destructive" })
    }
  }

  return (
    <DashboardLayout title="Blacklister Dashboard" description="Manage address blacklist for compliance and security">
      <div className="space-y-6">
        {/* Check Address Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Check Address Status
            </CardTitle>
            <CardDescription>Verify if an address is currently blacklisted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="check-address">Address to Check</Label>
                <Input
                  id="check-address"
                  placeholder="0x..."
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleCheckAddress} variant="outline">
                  Check Status
                </Button>
              </div>
            </div>

            {checkAddress && checkAddress.length === 42 && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  {isAddressBlacklisted ? (
                    <>
                      <Ban className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Address is Blacklisted</p>
                        <p className="text-xs text-muted-foreground">
                          This address cannot perform any token operations
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-primary">Address is Not Blacklisted</p>
                        <p className="text-xs text-muted-foreground">
                          This address can perform normal token operations
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Blacklist Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-destructive" />
                Blacklist Address
              </CardTitle>
              <CardDescription>Add an address to the blacklist with a reason</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Blacklisted addresses cannot transfer, receive, mint, or burn tokens. Use this function carefully and
                  only for compliance purposes.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="blacklist-address">Address to Blacklist</Label>
                <Input
                  id="blacklist-address"
                  placeholder="0x..."
                  value={blacklistAddress}
                  onChange={(e) => setBlacklistAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blacklist-reason">Reason for Blacklisting</Label>
                <Textarea
                  id="blacklist-reason"
                  placeholder="Enter detailed reason for compliance records..."
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This reason will be recorded on-chain for transparency and audit purposes
                </p>
              </div>

              <Button
                onClick={handleBlacklist}
                disabled={isPending || isConfirming}
                variant="destructive"
                className="w-full"
              >
                {isPending || isConfirming ? "Processing..." : "Blacklist Address"}
              </Button>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Common Reasons</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Suspected fraudulent activity</li>
                  <li>• Regulatory compliance requirement</li>
                  <li>• Court order or legal mandate</li>
                  <li>• Violation of terms of service</li>
                  <li>• Security threat or compromise</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Unblacklist Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Remove from Blacklist
              </CardTitle>
              <CardDescription>Restore an address's ability to use tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Removing an address from the blacklist will immediately restore their ability to transfer, receive,
                  mint, and burn tokens.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="unblacklist-address">Address to Unblacklist</Label>
                <Input
                  id="unblacklist-address"
                  placeholder="0x..."
                  value={unblacklistAddress}
                  onChange={(e) => setUnblacklistAddress(e.target.value)}
                />
              </div>

              <Button onClick={handleUnblacklist} disabled={isPending || isConfirming} className="w-full">
                {isPending || isConfirming ? "Processing..." : "Remove from Blacklist"}
              </Button>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Before Unblacklisting</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Verify the issue has been resolved</li>
                  <li>• Confirm compliance requirements are met</li>
                  <li>• Document the reason for removal</li>
                  <li>• Coordinate with relevant stakeholders</li>
                  <li>• Ensure proper authorization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blacklister Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Blacklister Responsibilities & Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Core Duties</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor for suspicious activity</li>
                  <li>• Enforce compliance requirements</li>
                  <li>• Respond to legal mandates</li>
                  <li>• Maintain blacklist records</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Always provide detailed reasons</li>
                  <li>• Document all decisions</li>
                  <li>• Regular review of blacklist</li>
                  <li>• Coordinate with legal team</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Actions are recorded on-chain</li>
                  <li>• Reasons are publicly visible</li>
                  <li>• Cannot be reversed by others</li>
                  <li>• Use only when necessary</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

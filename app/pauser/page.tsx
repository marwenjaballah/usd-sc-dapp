"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"
import { Pause, Play, AlertCircle, ShieldAlert, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTokenData } from "@/hooks/use-token-data"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PauserPage() {
  const { isPauser } = useContractRoles()
  const { toast } = useToast()
  const router = useRouter()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const { isPaused } = useTokenData()
  const [currentAction, setCurrentAction] = useState<string | null>(null)



  const handlePause = async () => {
    try {
      setCurrentAction("Pause Contract")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "pause",
      })
      toast({ title: "Transaction Submitted", description: "Pausing contract..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleUnpause = async () => {
    try {
      setCurrentAction("Unpause Contract")
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "unpause",
      })
      toast({ title: "Transaction Submitted", description: "Unpausing contract..." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  useEffect(() => {
    if (!isSuccess || !receipt) return
    const status = receipt.status
    if (status === "success") {
      toast({
        title: currentAction ? `${currentAction} Confirmed` : "Transaction Confirmed",
        description: `Tx ${receipt.transactionHash.slice(0, 10)}... confirmed`,
      })
      router.refresh()
    } else if (status === "reverted") {
      toast({
        title: currentAction ? `${currentAction} Reverted` : "Transaction Reverted",
        description: `Tx ${receipt.transactionHash.slice(0, 10)}... reverted`,
        variant: "destructive",
      })
    }
    setCurrentAction(null)
  }, [isSuccess, receipt, toast, router, currentAction])

  if (!isPauser) {
    return (
      <DashboardLayout title="Pauser Dashboard" description="Emergency pause and unpause controls">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have Pauser privileges. This page is restricted to authorized Pausers only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Pauser Dashboard"
      description="Emergency pause and unpause controls for the USD-SC contract"
    >
      <div className="space-y-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Contract Status
            </CardTitle>
            <CardDescription>Current operational state of the USD-SC contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isPaused ? "bg-destructive/10" : "bg-primary/10"
                }`}
              >
                {isPaused ? <Pause className="w-8 h-8 text-destructive" /> : <Play className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${isPaused ? "text-destructive" : "text-primary"}`}>
                  {isPaused ? "Contract Paused" : "Contract Active"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPaused
                    ? "All token operations are currently disabled"
                    : "All token operations are functioning normally"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pause/Unpause Controls */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pause Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pause className="w-5 h-5 text-destructive" />
                Pause Contract
              </CardTitle>
              <CardDescription>Emergency stop for all token operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Pausing the contract will immediately stop all transfers, minting, and burning operations. Use only in
                  emergency situations.
                </AlertDescription>
              </Alert>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">What Gets Paused</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• All token transfers</li>
                  <li>• Minting new tokens</li>
                  <li>• Burning tokens</li>
                  <li>• Any token movement</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">When to Pause</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Security vulnerability detected</li>
                  <li>• Suspicious activity observed</li>
                  <li>• Smart contract bug discovered</li>
                  <li>• Emergency maintenance required</li>
                  <li>• Regulatory compliance issue</li>
                </ul>
              </div>

              <Button
                onClick={handlePause}
                disabled={isPending || isConfirming || isPaused}
                variant="destructive"
                className="w-full"
              >
                {isPending || isConfirming ? "Processing..." : isPaused ? "Already Paused" : "Pause Contract"}
              </Button>
            </CardContent>
          </Card>

          {/* Unpause Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Unpause Contract
              </CardTitle>
              <CardDescription>Resume normal token operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Unpausing the contract will restore all token operations. Ensure the issue that caused the pause has
                  been resolved.
                </AlertDescription>
              </Alert>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">What Gets Restored</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Token transfers resume</li>
                  <li>• Minting operations enabled</li>
                  <li>• Burning operations enabled</li>
                  <li>• Normal functionality restored</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Before Unpausing</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Verify issue is resolved</li>
                  <li>• Confirm security measures</li>
                  <li>• Coordinate with team</li>
                  <li>• Notify stakeholders</li>
                  <li>• Document the resolution</li>
                </ul>
              </div>

              <Button onClick={handleUnpause} disabled={isPending || isConfirming || !isPaused} className="w-full">
                {isPending || isConfirming ? "Processing..." : !isPaused ? "Already Active" : "Unpause Contract"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pauser Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Pauser Responsibilities & Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Core Duties</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor contract security</li>
                  <li>• Respond to emergencies quickly</li>
                  <li>• Coordinate with security team</li>
                  <li>• Document all pause events</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Act swiftly in emergencies</li>
                  <li>• Communicate with stakeholders</li>
                  <li>• Verify issues before unpausing</li>
                  <li>• Keep detailed incident logs</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pause is immediate and global</li>
                  <li>• Only Pausers can unpause</li>
                  <li>• Events are recorded on-chain</li>
                  <li>• Use responsibly and sparingly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Emergency Procedures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">In Case of Emergency</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Assess the severity and scope of the issue</li>
                  <li>If critical, pause the contract immediately</li>
                  <li>Notify the admin and security team</li>
                  <li>Document the incident and actions taken</li>
                  <li>Coordinate investigation and resolution</li>
                  <li>Only unpause after thorough verification</li>
                  <li>Communicate status to all stakeholders</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Critical Scenarios</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Smart contract exploit detected</li>
                    <li>• Unauthorized minting activity</li>
                    <li>• Oracle manipulation attempt</li>
                    <li>• Governance attack in progress</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Non-Critical Scenarios</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Scheduled maintenance</li>
                    <li>• Planned upgrades</li>
                    <li>• Routine security audits</li>
                    <li>• Coordinated testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

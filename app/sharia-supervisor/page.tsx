"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContractRoles } from "@/hooks/use-contract-roles"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Shield, FileCheck, Ban, Building2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTokenData } from "@/hooks/use-token-data"

export default function ShariaSupervisorPage() {
  const { isShariaSupervisor } = useContractRoles()
  const { toast } = useToast()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })
  const { shariaCertHash, lastAuditTimestamp, prohibitedSectors, shariaCertActive } = useTokenData()

  // Certification State
  const [certHash, setCertHash] = useState("")

  // Audit State
  const [auditHash, setAuditHash] = useState("")

  // Prohibited Sector State
  const [newSector, setNewSector] = useState("")

  // Compliance Board State
  const [newBoardAddress, setNewBoardAddress] = useState("")

  const { data: complianceBoard } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "getShariaComplianceBoard",
  })

  if (!isShariaSupervisor) {
    return (
      <DashboardLayout title="Sharia Supervisor Dashboard" description="Manage Sharia compliance and certification">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have Sharia Supervisor privileges. This page is restricted to Sharia Supervisors only.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const handleUpdateCertification = async () => {
    if (!certHash) {
      toast({ title: "Error", description: "Please enter certificate hash", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "updateShariaCertification",
        args: [certHash],
      })
      toast({ title: "Transaction Submitted", description: "Updating Sharia certification..." })
      setCertHash("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleRecordAudit = async () => {
    if (!auditHash) {
      toast({ title: "Error", description: "Please enter audit hash", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "recordShariaAudit",
        args: [auditHash],
      })
      toast({ title: "Transaction Submitted", description: "Recording audit..." })
      setAuditHash("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleAddProhibitedSector = async () => {
    if (!newSector) {
      toast({ title: "Error", description: "Please enter sector name", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "addProhibitedSector",
        args: [newSector.toLowerCase().replace(/\s+/g, "_")],
      })
      toast({ title: "Transaction Submitted", description: "Adding prohibited sector..." })
      setNewSector("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleUpdateComplianceBoard = async () => {
    if (!newBoardAddress) {
      toast({ title: "Error", description: "Please enter board address", variant: "destructive" })
      return
    }

    try {
      writeContract({
        address: USD_SC_ADDRESS,
        abi: USD_SC_ABI,
        functionName: "updateComplianceBoard",
        args: [newBoardAddress as `0x${string}`],
      })
      toast({ title: "Transaction Submitted", description: "Updating compliance board..." })
      setNewBoardAddress("")
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Never"
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <DashboardLayout
      title="Sharia Supervisor Dashboard"
      description="Manage Sharia compliance, certifications, and audits"
    >
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certification Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {shariaCertActive ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold text-primary">Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <span className="text-lg font-bold text-destructive">Inactive</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{formatDate(lastAuditTimestamp)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prohibited Sectors</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prohibitedSectors.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="certification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="certification">
              <Shield className="w-4 h-4 mr-2" />
              Certification
            </TabsTrigger>
            <TabsTrigger value="audit">
              <FileCheck className="w-4 h-4 mr-2" />
              Audit
            </TabsTrigger>
            <TabsTrigger value="sectors">
              <Ban className="w-4 h-4 mr-2" />
              Sectors
            </TabsTrigger>
            <TabsTrigger value="board">
              <Building2 className="w-4 h-4 mr-2" />
              Board
            </TabsTrigger>
          </TabsList>

          {/* Certification Tab */}
          <TabsContent value="certification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Update Sharia Certification
                </CardTitle>
                <CardDescription>Update the IPFS hash of the Sharia compliance certificate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Current Certificate</h4>
                  <p className="text-xs font-mono break-all">{shariaCertHash || "Not set"}</p>
                  <p className="text-xs text-muted-foreground">Last updated: {formatDate(lastAuditTimestamp)}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cert-hash">New Certificate Hash (IPFS)</Label>
                  <Input
                    id="cert-hash"
                    placeholder="QmXxxx... or ipfs://..."
                    value={certHash}
                    onChange={(e) => setCertHash(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the IPFS hash or URL of the new Sharia compliance certificate
                  </p>
                </div>

                <Button onClick={handleUpdateCertification} disabled={isPending || isConfirming} className="w-full">
                  {isPending || isConfirming ? "Processing..." : "Update Certification"}
                </Button>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">What this does</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Updates the certificate hash stored on-chain</li>
                    <li>• Records the timestamp of the update</li>
                    <li>• Emits ShariaCertificationUpdated event</li>
                    <li>• Maintains transparency and auditability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Record Sharia Audit
                </CardTitle>
                <CardDescription>Record completion of a Sharia compliance audit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Recording an audit updates the last audit timestamp and stores the audit report hash on-chain for
                    transparency.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="audit-hash">Audit Report Hash (IPFS)</Label>
                  <Input
                    id="audit-hash"
                    placeholder="QmXxxx... or ipfs://..."
                    value={auditHash}
                    onChange={(e) => setAuditHash(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the IPFS hash or URL of the completed audit report
                  </p>
                </div>

                <Button onClick={handleRecordAudit} disabled={isPending || isConfirming} className="w-full">
                  {isPending || isConfirming ? "Processing..." : "Record Audit"}
                </Button>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Audit Information</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Audit:</span>
                      <span className="font-medium">{formatDate(lastAuditTimestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={shariaCertActive ? "text-primary" : "text-destructive"}>
                        {shariaCertActive ? "Compliant" : "Non-Compliant"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prohibited Sectors Tab */}
          <TabsContent value="sectors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="w-5 h-5 text-destructive" />
                    Add Prohibited Sector
                  </CardTitle>
                  <CardDescription>Add a new sector to the prohibited list</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-sector">Sector Name</Label>
                    <Input
                      id="new-sector"
                      placeholder="e.g., gambling, alcohol, tobacco"
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the name of the sector to prohibit (will be converted to lowercase with underscores)
                    </p>
                  </div>

                  <Button onClick={handleAddProhibitedSector} disabled={isPending || isConfirming} className="w-full">
                    {isPending || isConfirming ? "Processing..." : "Add Prohibited Sector"}
                  </Button>

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h4 className="font-medium text-sm">Common Prohibited Sectors</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Alcohol production and distribution</li>
                      <li>• Gambling and betting services</li>
                      <li>• Tobacco and related products</li>
                      <li>• Conventional interest-based finance</li>
                      <li>• Weapons and defense</li>
                      <li>• Adult entertainment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Prohibited Sectors</CardTitle>
                  <CardDescription>Sectors currently excluded from USD-SC operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {prohibitedSectors.length > 0 ? (
                      prohibitedSectors.map((sector, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded">
                          <Ban className="h-3 w-3 text-destructive flex-shrink-0" />
                          <span className="capitalize">{sector.replace(/_/g, " ")}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No prohibited sectors defined</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Board Tab */}
          <TabsContent value="board" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Update Compliance Board
                </CardTitle>
                <CardDescription>Change the Sharia compliance board address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Current Compliance Board</h4>
                  <p className="text-xs font-mono break-all">{complianceBoard as string}</p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Updating the compliance board address changes the official Sharia oversight authority for this
                    stablecoin.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="new-board">New Compliance Board Address</Label>
                  <Input
                    id="new-board"
                    placeholder="0x..."
                    value={newBoardAddress}
                    onChange={(e) => setNewBoardAddress(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleUpdateComplianceBoard}
                  disabled={isPending || isConfirming}
                  variant="destructive"
                  className="w-full"
                >
                  {isPending || isConfirming ? "Processing..." : "Update Compliance Board"}
                </Button>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Important Notes</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• This is a critical governance function</li>
                    <li>• Verify the new address carefully</li>
                    <li>• Coordinate with stakeholders before updating</li>
                    <li>• Emits ComplianceBoardUpdated event</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Responsibilities Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sharia Supervisor Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Core Duties</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Maintain Sharia certification</li>
                  <li>• Conduct regular audits</li>
                  <li>• Update prohibited sectors</li>
                  <li>• Oversee compliance board</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Compliance Standards</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Follow Islamic finance principles</li>
                  <li>• Ensure transparency</li>
                  <li>• Maintain audit trails</li>
                  <li>• Regular reporting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Document all decisions</li>
                  <li>• Coordinate with stakeholders</li>
                  <li>• Keep certifications current</li>
                  <li>• Monitor sector developments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useAccount, useReadContract } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI } from "@/lib/contract"
import { formatUnits } from "viem"

export function useTokenData() {
  const { address } = useAccount()

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: totalSupply } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "totalSupply",
  })

  const { data: totalMinted } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "totalMinted",
  })

  const { data: totalBurned } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "totalBurned",
  })

  const { data: isPaused } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "paused",
  })

  const { data: isBlacklisted } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "isBlacklisted",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: shariaCertActive } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "isShariaCertificationActive",
  })

  const { data: shariaCertHash } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "getShariaCertificateHash",
  })

  const { data: lastAuditTimestamp } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "getLastShariaAuditTimestamp",
  })

  const { data: prohibitedSectors } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "getProhibitedSectors",
  })

  return {
    balance: balance ? formatUnits(balance, 18) : "0",
    balanceRaw: balance,
    totalSupply: totalSupply ? formatUnits(totalSupply, 18) : "0",
    totalMinted: totalMinted ? formatUnits(totalMinted, 18) : "0",
    totalBurned: totalBurned ? formatUnits(totalBurned, 18) : "0",
    isPaused: !!isPaused,
    isBlacklisted: !!isBlacklisted,
    shariaCertActive: !!shariaCertActive,
    shariaCertHash: shariaCertHash as string,
    lastAuditTimestamp: lastAuditTimestamp ? Number(lastAuditTimestamp) : 0,
    prohibitedSectors: (prohibitedSectors as string[]) || [],
    refetchBalance,
  }
}

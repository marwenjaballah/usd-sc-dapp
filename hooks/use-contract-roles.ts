"use client"

import { useAccount, useReadContract } from "wagmi"
import { USD_SC_ADDRESS, USD_SC_ABI, ROLES } from "@/lib/contract"

export function useContractRoles() {
  const { address } = useAccount()

  const { data: isAdmin } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.ADMIN_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: isMasterMinter } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.MASTER_MINTER_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: isMinter } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.MINTER_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: isPauser } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.PAUSER_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: isBlacklister } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.BLACKLISTER_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: isShariaSupervisor } = useReadContract({
    address: USD_SC_ADDRESS,
    abi: USD_SC_ABI,
    functionName: "hasRole",
    args: [ROLES.SHARIA_SUPERVISOR_ROLE as `0x${string}`, address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  return {
    isAdmin: !!isAdmin,
    isMasterMinter: !!isMasterMinter,
    isMinter: !!isMinter,
    isPauser: !!isPauser,
    isBlacklister: !!isBlacklister,
    isShariaSupervisor: !!isShariaSupervisor,
    hasAnyRole: !!(isAdmin || isMasterMinter || isMinter || isPauser || isBlacklister || isShariaSupervisor),
  }
}

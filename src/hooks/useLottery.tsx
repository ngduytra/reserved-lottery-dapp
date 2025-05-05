"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import type { ethers } from "ethers";

import { contractABI, contractAddress } from "@/lib/contract";
import { BigNumberish } from "ethers";
import { Address, erc20Abi } from "viem";

export function useCreateTicket() {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  //   address: contractAddress as `0x${string}`,
  //   abi: contractABI,
  //   functionName: "createTicket",
  const createTicket = async ({
    price,
    betRate,
    roundId,
    predictedNumber,
  }: {
    price: ethers.BigNumberish;
    betRate: number;
    roundId: number;
    predictedNumber: number;
  }) => {
    setIsLoading(true);
    try {
      await writeContractAsync({
        abi: contractABI,
        address: contractAddress,
        functionName: "createTicket",
        args: [price, betRate, roundId, predictedNumber],
      });

      //   toast({
      //     title: "Ticket purchased successfully!",
      //     description: `You've purchased a ticket for Round #${roundId}`,
      //   });

      //   await refreshData();
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      //   toast({
      //     title: "Failed to purchase ticket",
      //     description: error?.message || "An unknown error occurred",
      //     variant: "destructive",
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  return { createTicket, isLoading };
}

// export function useClaimReward() {
//   const [isClaimLoading, setIsClaimLoading] = useState(false);
//   const { refreshData } = useContext(LotteryContext);
//   const { toast } = useToast();

//   const { writeAsync } = useContractWrite({
//     address: contractAddress as `0x${string}`,
//     abi: contractABI,
//     functionName: "claimReward",
//   });

//   const claimReward = async (ticketId: number, roundId: number) => {
//     setIsClaimLoading(true);
//     try {
//       const tx = await writeAsync({
//         args: [ticketId, roundId],
//       });

//       await tx.wait();

//       toast({
//         title: "Reward claimed successfully!",
//         description: `You've claimed the reward for Ticket #${ticketId}`,
//       });

//       await refreshData();
//     } catch (error: any) {
//       console.error("Error claiming reward:", error);
//       toast({
//         title: "Failed to claim reward",
//         description: error?.message || "An unknown error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsClaimLoading(false);
//     }
//   };

//   return { claimReward, isClaimLoading };
// }

export function useIsOperator() {
  const { address } = useAccount();

  const { data: hasRole } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "hasRole",
    args: [
      "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c", // OPERATOR_ROLE
      address,
    ],
  });

  return !!hasRole;
}

export function useGetTokenAddress() {
  const { data: tokenAddress } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "tokenInstance",
  });
  return tokenAddress;
}

export const useGetCurrentRoundId = () => {
  const { data: currentRoundId } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "currentRound",
  });
  return currentRoundId as number;
};

export const useCurrentTicket = () => {
  const { data: currentTicketId } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "currentRound",
  });
  return currentTicketId as number;
};

export const useTokenPaymentInfo = () => {
  const tokenAddress = useGetTokenAddress();
  console.log("tokenAddress", tokenAddress);
  const { data: tokenName } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "name",
  });
  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  });

  return { tokenName, decimals, tokenAddress };
};

export const useApproveErc20 = () => {
  const tokenAddress = useGetTokenAddress();
  const { writeContractAsync } = useWriteContract();

  const approveErc20 = async (spender: string, amount: BigNumberish) => {
    console.log("approveErc20", tokenAddress, spender, amount);
    await writeContractAsync({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender as Address, amount as bigint],
    });
  };

  return approveErc20;
};

export const useGetAllowance = () => {
  const tokenAddress = useGetTokenAddress();
  const { address } = useAccount();
  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [contractAddress, address!],
  });
  return allowance as bigint;
};

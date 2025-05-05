"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Label,
  Input,
  Button,
} from "@/components/Stuff";
import {
  useApproveErc20,
  useCurrentTicket,
  useGetAllowance,
  useGetCurrentRoundId,
  useTokenPaymentInfo,
} from "@/hooks/useLottery";
import { contractAddress } from "@/lib/contract";
import { parseUnits } from "ethers";
import { useMemo, useState } from "react";
import { useWalletClient } from "wagmi";

const UserPage = () => {
  const { tokenName, decimals, tokenAddress } = useTokenPaymentInfo();
  const result = useWalletClient();
  console.log("result:wallet client: ", result);
  const currentRound = useGetCurrentRoundId();
  const currentTicket = useCurrentTicket();
  const [ticketPrice, setTicketPrice] = useState<string>("");
  const [ticketBetRate, setTicketBetRate] = useState<string>("");
  const [ticketRoundId, setTicketRoundId] = useState<string>("1");
  const [ticketPredictedNumber, setTicketPredictedNumber] =
    useState<string>("");
  const [claimTicketId, setClaimTicketId] = useState<string>("");
  const [claimRoundId, setClaimRoundId] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Shared submitting state for user actions
  const approveErc20Transfer = useApproveErc20();
  const allowance = useGetAllowance();

  console.log("allowance: ", allowance);

  const needsApproval = useMemo(() => {
    if (!ticketPrice) return false;
    return allowance < parseUnits(ticketPrice, decimals as number);
  }, [ticketPrice, allowance, decimals]);

  const handleApprove = async () => {
    if (!ticketPrice) {
      alert("Please enter a ticket price to approve."); // Use alert for simplicity in dummy
      return;
    }
    setIsApproving(true);
    setIsSubmitting(true);
    try {
      const neededAmount = parseUnits(ticketPrice, decimals as number);
      // Also set general submitting state
      await approveErc20Transfer(contractAddress, neededAmount);

      console.log("approved:done");

      setIsApproving(false);
      setIsSubmitting(false);
    } catch (e) {
      console.log("error:", e);
      alert(e);
    }
  };

  const handleCreateTicket = () => {
    if (
      !ticketPrice ||
      !ticketBetRate ||
      !ticketRoundId ||
      !ticketPredictedNumber
    ) {
      alert("Please fill in all ticket details.");
      return;
    }
    if (needsApproval) {
      alert("You must approve the token transfer first.");
      return;
    }
    setIsSubmitting(true);
    onSimulateAction("Create Ticket", {
      price: ticketPrice,
      betRate: ticketBetRate,
      roundId: ticketRoundId,
      predictedNumber: ticketPredictedNumber,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketPrice("");
      setTicketBetRate("");
      setTicketPredictedNumber("");
    }, 1500);
  };

  const handleClaimReward = () => {
    if (!claimTicketId || !claimRoundId) {
      alert("Please provide Ticket ID and Round ID to claim.");
      return;
    }
    setIsSubmitting(true);
    onSimulateAction("Claim Reward", {
      ticketId: claimTicketId,
      roundId: claimRoundId,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setClaimTicketId("");
      setClaimRoundId("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lottery Information</CardTitle>
          <CardDescription>
            Current status of the lottery contract.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Contract Address:{" "}
            <span className="font-mono text-muted-foreground">
              {contractAddress}
            </span>
          </p>
          <p>
            Current Round:{" "}
            <span className="font-semibold text-primary">{currentRound}</span>
          </p>
          <p>
            Total Tickets:{" "}
            <span className="font-semibold">{currentTicket}</span>
          </p>
          <p>
            Token Info:{""}
            <span className="font-mono text-muted-foreground">
              {tokenName as string}
            </span>{" "}
            ({decimals as string} decimals)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buy Lottery Ticket</CardTitle>
          <CardDescription>
            Purchase a ticket for the current active round.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-price">Price (Units)</Label>
              <Input
                id="ticket-price"
                type="number"
                // placeholder={`e.g., 10 (${contractInfo.tokenDecimals} decimals)`}
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-bet-rate">Bet Rate (Integer)</Label>
              <Input
                id="ticket-bet-rate"
                type="number"
                placeholder="e.g., 500000"
                value={ticketBetRate}
                onChange={(e) => setTicketBetRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-round-id">Round ID</Label>
              <Input
                id="ticket-round-id"
                type="number"
                placeholder="e.g., 1"
                value={ticketRoundId}
                onChange={(e) => setTicketRoundId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-predicted-number">Predicted Number</Label>
              <Input
                id="ticket-predicted-number"
                type="number"
                placeholder="Your lucky number"
                value={ticketPredictedNumber}
                onChange={(e) => setTicketPredictedNumber(e.target.value)}
              />
            </div>
          </div>
          {ticketPrice && (
            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Required: {ticketPrice || "0"} Tokens.
                {needsApproval ? (
                  <span className="text-orange-600 ml-1">
                    Approval needed (Simulated).
                  </span>
                ) : (
                  <span className="text-green-600 ml-1">
                    Allowance sufficient (Simulated).
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleApprove}
                  disabled={!needsApproval || isApproving || isSubmitting}
                  variant="outline"
                  className={
                    needsApproval
                      ? "border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      : ""
                  }
                >
                  {isApproving
                    ? "Simulating Approval..."
                    : "1. Approve Transfer"}
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  disabled={needsApproval || isSubmitting}
                >
                  {isSubmitting && !isApproving
                    ? "Simulating..."
                    : "2. Create Ticket"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claim Reward</CardTitle>
          <CardDescription>
            Claim your prize if your ticket is a winner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="claim-ticket-id">Ticket ID</Label>
              <Input
                id="claim-ticket-id"
                type="number"
                placeholder="Your winning ticket ID"
                value={claimTicketId}
                onChange={(e) => setClaimTicketId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="claim-round-id">Round ID</Label>
              <Input
                id="claim-round-id"
                type="number"
                placeholder="The round ID for the ticket"
                value={claimRoundId}
                onChange={(e) => setClaimRoundId(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleClaimReward} disabled={isSubmitting}>
            {isSubmitting ? "Simulating..." : "Claim Reward"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;

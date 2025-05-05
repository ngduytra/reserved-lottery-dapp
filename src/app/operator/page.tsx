"use client";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@/components/Stuff";
import AppHeader from "@/components/AppHeader";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const dummyContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
const dummyUserAddress = "0xabcdef1234567890abcdef1234567890abcdef12";

const contractInfo = {
  contractAddress: dummyContractAddress,
  currentRound: 1,
  currentTicket: 5,
  tokenInstanceAddress: dummyUserAddress,
  tokenDecimals: 18,
  taxMan: dummyUserAddress,
  tax: BigInt(10000),
};

const OperatorPage = () => {
  const { isConnected } = useAccount();
  const [roundName, setRoundName] = useState<string>("");
  const [roundStart, setRoundStart] = useState<string>("");
  const [roundEnd, setRoundEnd] = useState<string>("");
  const [luckyNumberRoundId, setLuckyNumberRoundId] = useState<string>("");
  const [luckyNumber, setLuckyNumber] = useState<string>("");
  const [taxManAddress, setTaxManAddress] = useState<string>(
    contractInfo.taxMan || ""
  );
  const [taxAmount, setTaxAmount] = useState<string>(
    contractInfo.tax?.toString() || "0"
  );

  const [newTokenAddress, setNewTokenAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Shared submitting state for operator actions

  const handleCreateRound = () => {
    if (!roundName || !roundStart || !roundEnd) {
      alert("Please fill in all round details.");
      return;
    }
    setIsSubmitting(true);
    // onSimulateAction("Create Round", {
    //   name: roundName,
    //   start: roundStart,
    //   end: roundEnd,
    // });
    setTimeout(() => {
      setIsSubmitting(false);
      setRoundName("");
      setRoundStart("");
      setRoundEnd("");
    }, 1500);
  };

  const handleAddLuckyNumber = () => {
    if (!luckyNumberRoundId || !luckyNumber) {
      alert("Please provide Round ID and Lucky Number.");
      return;
    }
    setIsSubmitting(true);
    // onSimulateAction("Add Lucky Number", {
    //   roundId: luckyNumberRoundId,
    //   number: luckyNumber,
    // });
    setTimeout(() => {
      setIsSubmitting(false);
      setLuckyNumberRoundId("");
      setLuckyNumber("");
    }, 1500);
  };

  const handleSetTax = () => {
    if (!taxManAddress || !taxAmount) {
      alert("Please provide Tax Man address and Tax amount.");
      return;
    }
    setIsSubmitting(true);
    // onSimulateAction("Set Tax", { taxMan: taxManAddress, tax: taxAmount });
    setTimeout(() => setIsSubmitting(false), 1500); // Keep values
  };

  const handleSetTokenAddress = () => {
    if (!newTokenAddress) {
      alert("Please provide the new Token address.");
      return;
    }
    setIsSubmitting(true);
    // onSimulateAction("Set Token Address", { address: newTokenAddress });
    setTimeout(() => {
      setIsSubmitting(false);
      setNewTokenAddress("");
    }, 1500);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <AppHeader />

      <main className="container mx-auto p-4 md:p-6">
        {!isConnected ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Wallet Disconnected</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please connect your wallet to interact with the lottery.</p>
              <ConnectButton />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operator Dashboard</CardTitle>
                <CardDescription>
                  Manage lottery rounds and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  Contract Address:{" "}
                  <span className="font-mono text-muted-foreground">
                    {contractInfo.contractAddress}
                  </span>
                </p>
                <p>
                  Current Round:{" "}
                  <span className="font-semibold text-primary">
                    {contractInfo.currentRound}
                  </span>
                </p>
                <p>
                  Total Tickets:{" "}
                  <span className="font-semibold">
                    {contractInfo.currentTicket}
                  </span>
                </p>
                <Separator className="my-4" />
                <p>
                  Token Address:{" "}
                  <span className="font-mono text-muted-foreground">
                    {contractInfo.tokenInstanceAddress}
                  </span>
                </p>
                <p>
                  Tax Man:{" "}
                  <span className="font-mono text-muted-foreground">
                    {taxManAddress || "Not Set"}
                  </span>
                </p>
                <p>
                  Tax (PPM): <span className="font-semibold">{taxAmount}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Round</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="op-round-name">Round Name</Label>
                  <Input
                    id="op-round-name"
                    placeholder="e.g., Weekly Draw #10"
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="op-round-start">Start Time</Label>
                    <Input
                      id="op-round-start"
                      type="datetime-local"
                      value={roundStart}
                      onChange={(e) => setRoundStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="op-round-end">End Time</Label>
                    <Input
                      id="op-round-end"
                      type="datetime-local"
                      value={roundEnd}
                      onChange={(e) => setRoundEnd(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateRound} disabled={isSubmitting}>
                  {isSubmitting ? "Simulating..." : "Create Round"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Lucky Number</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="op-lucky-round-id">Round ID</Label>
                    <Input
                      id="op-lucky-round-id"
                      type="number"
                      placeholder="Round to add number for"
                      value={luckyNumberRoundId}
                      onChange={(e) => setLuckyNumberRoundId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="op-lucky-number">Lucky Number</Label>
                    <Input
                      id="op-lucky-number"
                      type="number"
                      placeholder="The winning number"
                      value={luckyNumber}
                      onChange={(e) => setLuckyNumber(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAddLuckyNumber} disabled={isSubmitting}>
                  {isSubmitting ? "Simulating..." : "Add Lucky Number"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Set Tax */}
                <div className="space-y-4 border p-4 rounded-md">
                  <Label className="text-base font-semibold">
                    Tax Configuration
                  </Label>
                  <div className="space-y-2">
                    <Label htmlFor="op-tax-man">Tax Man Address</Label>
                    <Input
                      id="op-tax-man"
                      placeholder="Address to receive tax"
                      value={taxManAddress}
                      onChange={(e) => setTaxManAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="op-tax-amount">Tax Amount (PPM)</Label>
                    <Input
                      id="op-tax-amount"
                      type="number"
                      placeholder="e.g., 10000 for 1%"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSetTax}
                    disabled={isSubmitting}
                    variant="secondary"
                  >
                    {isSubmitting ? "Simulating..." : "Set Tax"}
                  </Button>
                </div>
                {/* Set Token Address */}
                <div className="space-y-4 border p-4 rounded-md">
                  <Label className="text-base font-semibold">
                    Token Address
                  </Label>
                  <div className="space-y-2">
                    <Label htmlFor="op-token-address">New Token Address</Label>
                    <Input
                      id="op-token-address"
                      placeholder="ERC20 token contract address"
                      value={newTokenAddress}
                      onChange={(e) => setNewTokenAddress(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSetTokenAddress}
                    disabled={isSubmitting}
                    variant="secondary"
                  >
                    {isSubmitting ? "Simulating..." : "Set Token Address"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default OperatorPage;

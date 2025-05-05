"use client";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Stuff";
import UserPage from "./UserPage";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { isConnected } = useAccount();

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
          <UserPage />
        )}
      </main>
    </div>
  );
}

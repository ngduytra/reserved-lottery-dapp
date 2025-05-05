import { ConnectButton } from "@rainbow-me/rainbowkit";

const AppHeader = () => {
  return (
    <header className="p-4 border-b bg-card w-full">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Reserved Lottery</h1>
        <div className="flex flex-end items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

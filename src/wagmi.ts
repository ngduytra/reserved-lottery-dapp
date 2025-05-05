import { mainnet, optimism, polygon, sepolia } from "wagmi/chains";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "2c6406174410a7ddd96218ba9a0f4476",
  chains: [mainnet, polygon, optimism, sepolia],
});

import { http, createConfig } from "wagmi";
import { base, optimism } from "wagmi/chains";
import { frameConnector } from "./frameConnector";

export const config = createConfig({
  chains: [base, optimism],
  ssr: true,
  connectors: [
    frameConnector(),
  ],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
})
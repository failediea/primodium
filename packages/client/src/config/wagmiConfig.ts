import { createClient } from "viem";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { getCoreConfig } from "@/config/getCoreConfig";

const env = import.meta.env;
const projectId = env.PRI_WALLETCONNECT_PROJECT_ID;

const { chain } = getCoreConfig();

export { chain as targetChain };

export const wagmiConfig = createConfig({
  chains: [chain],

  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
  connectors: [injected(), walletConnect({ projectId }), coinbaseWallet({ appName: "wagmi" })],
});

import { memo, useMemo, useRef } from "react";

import "react-toastify/dist/ReactToastify.min.css";

import { Hex } from "viem";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";

import { Core as CoreType, createCore } from "@primodiumxyz/core";
import { AccountClientProvider, CoreProvider } from "@primodiumxyz/core/react";
import { usePersistentStore } from "@primodiumxyz/game/src/stores/PersistentStore";
import AppLoadingState from "@/AppLoadingState";
import { Initializing } from "@/components/shared/Initializing";
import { getCoreConfig } from "@/config/getCoreConfig";
import { targetChain } from "@/config/wagmiConfig";
import { Maintenance } from "@/screens/Maintenance";

const MAINTENANCE = import.meta.env.PRI_MAINTENANCE === "true";

function Core() {
  const coreRef = useRef<CoreType | null>(null);
  const externalAccount = useAccount();
  const { noExternalAccount } = usePersistentStore(
    useShallow((state) => ({ noExternalAccount: state.noExternalAccount })),
  );

  const core = useMemo(() => {
    if (coreRef.current) coreRef.current.network.world.dispose();
    const config = getCoreConfig();
    const core = createCore(config);
    coreRef.current = core;
    return core;
  }, []);

  const { playerPrivateKey, playerAddress } = useMemo(() => {
    const playerPrivateKey = noExternalAccount
      ? ((localStorage.getItem("primodiumPlayerAccount") as Hex) ?? generatePrivateKey())
      : undefined;

    const playerAddress = playerPrivateKey ? privateKeyToAddress(playerPrivateKey) : externalAccount.address;

    const ret = { playerPrivateKey, playerAddress };
    return ret;
  }, [noExternalAccount, externalAccount.address]);
  if (MAINTENANCE) return <Maintenance />;

  if (!noExternalAccount && !externalAccount.isConnected) return null;

  // Don't initialize core until wallet is on the correct chain
  if (!noExternalAccount && externalAccount.chainId !== targetChain.id) return null;
  if (!core) return <Initializing />;

  return (
    <CoreProvider {...core}>
      <AccountClientProvider playerAddress={playerAddress} playerPrivateKey={playerPrivateKey}>
        <AppLoadingState />
      </AccountClientProvider>
    </CoreProvider>
  );
}
export default memo(Core);

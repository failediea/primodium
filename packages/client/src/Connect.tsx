import { chunk } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Connector, useAccount, useConnect, useSwitchChain } from "wagmi";

import { usePersistentStore } from "@primodiumxyz/game/src/stores/PersistentStore";
import { targetChain } from "@/config/wagmiConfig";
import { Landing } from "@/screens/Landing";

const connectorIcons: Record<string, string> = {
  ["MetaMask"]: "/img/icons/web3/metamask.svg",
  ["WalletConnect"]: "/img/icons/web3/walletconnect.svg",
  ["Coinbase Wallet"]: "/img/icons/web3/coinbase.svg",
};

export const Connect: React.FC = React.memo(() => {
  const { connector, isConnected, chainId } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { switchChain } = useSwitchChain();
  const { noExternalAccount, setNoExternalAccount } = usePersistentStore();
  const [showingToast, setShowingToast] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Auto-switch to the target chain when connected on the wrong network
  useEffect(() => {
    if (isConnected && chainId && chainId !== targetChain.id) {
      setIsSwitching(true);
      toast.info(`Switching to ${targetChain.name}...`);
      switchChain(
        { chainId: targetChain.id },
        {
          onSuccess: () => {
            setIsSwitching(false);
            toast.success(`Connected to ${targetChain.name}`);
          },
          onError: (err) => {
            setIsSwitching(false);
            toast.error(`Please switch to ${targetChain.name} (Chain ID: ${targetChain.id}) in your wallet manually.`);
            console.error("[Chain Switch]", err);
          },
        },
      );
    }
  }, [isConnected, chainId, switchChain]);

  useEffect(() => {
    if (error) toast.warn(error.message);
  }, [error]);

  const handleConnect = useCallback(
    (connector: Connector) => {
      if (isPending || isSwitching) return;
      connect({ connector });
    },
    [connect, isPending, isSwitching],
  );

  const confirmToast = async () => {
    toast.dismiss();
    if (showingToast) await new Promise((resolve) => setTimeout(resolve, 500));
    setShowingToast(true);
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col text-center justify-center items-center gap-2 w-full">
            <FaExclamationTriangle size={24} className="text-warning" />
            Are you sure you want to login as guest? You will not be able to win prizes or play across devices.
          </div>

          <div className="flex justify-center w-full gap-2">
            <button
              className="btn btn-secondary btn-xs"
              onClick={() => {
                setNoExternalAccount(true);
                closeToast && closeToast();
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowingToast(false);
                closeToast && closeToast();
              }}
              className="btn btn-primary btn-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        // className: "border-error",
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
      },
    );
  };

  if (isConnected || noExternalAccount) return null;

  return (
    <Landing>
      <div className="flex flex-col gap-2 w-full">
        <button
          className="btn-lg btn-secondary star-background w-full btn join-item inline pointer-events-auto font-bold outline-none h-fit z-10"
          onClick={confirmToast}
        >
          Login as Guest
        </button>

        {chunk(
          connectors.filter((x) => x.id !== connector?.id),
          2,
        ).map((chunk, i) => (
          <div key={`chunk-${i}`} className="flex flex-row gap-2">
            {chunk.map((x) => (
              <button
                className="flex-1 items-center justify-center btn btn-secondary star-background join-item inline pointer-events-auto font-bold outline-none h-fit z-10"
                key={`${x.id}-${x.name}`}
                onClick={() => handleConnect(x)}
                disabled={isPending || isSwitching}
              >
                <div className="flex w-full items-center justify-center gap-2">
                  {connectorIcons[x.name] && <img src={connectorIcons[x.name]} className="w-6 h-6" />}
                  {x.name}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Landing>
  );
});

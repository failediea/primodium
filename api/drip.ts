import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPublicClient, createWalletClient, http, parseEther, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const DRIP_AMOUNT = parseEther("0.0005");
const MIN_BALANCE = parseEther("0.001"); // only drip if recipient is below this
const drippedAddresses = new Map<string, number>();
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown per address

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const faucetKey = process.env.FAUCET_PRIVATE_KEY;
  if (!faucetKey) {
    return res.status(500).json({ error: "Faucet not configured" });
  }

  const { address } = req.body ?? {};
  if (!address || !isAddress(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  // Rate limit: 1 drip per address per hour
  const lastDrip = drippedAddresses.get(address.toLowerCase());
  if (lastDrip && Date.now() - lastDrip < COOLDOWN_MS) {
    return res.status(429).json({ error: "Rate limited. Try again later." });
  }

  try {
    const account = privateKeyToAccount(faucetKey as `0x${string}`);
    const rpcTransport = http("https://sepolia.base.org");

    const publicClient = createPublicClient({ chain: baseSepolia, transport: rpcTransport });

    // Skip if recipient already has enough
    const recipientBalance = await publicClient.getBalance({ address: address as `0x${string}` });
    if (recipientBalance >= MIN_BALANCE) {
      return res.status(200).json({ message: "Already funded", balance: recipientBalance.toString() });
    }

    // Check faucet balance before attempting transfer
    const faucetBalance = await publicClient.getBalance({ address: account.address });
    if (faucetBalance < DRIP_AMOUNT + parseEther("0.0001")) {
      return res.status(503).json({ error: "Faucet is empty. Please try again later." });
    }

    const client = createWalletClient({ account, chain: baseSepolia, transport: rpcTransport });

    const hash = await client.sendTransaction({
      to: address as `0x${string}`,
      value: DRIP_AMOUNT,
    });

    drippedAddresses.set(address.toLowerCase(), Date.now());
    return res.status(200).json({ hash });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

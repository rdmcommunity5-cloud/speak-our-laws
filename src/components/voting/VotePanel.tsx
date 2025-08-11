import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { connectWalletMock, getWalletAddress, isVerified, submitVote, verifyIdentityMock, type VoteType } from "@/lib/voting";

interface Props {
  lawId: string;
  lawTitle?: string;
}

export const VotePanel = ({ lawId, lawTitle }: Props) => {
  const [loading, setLoading] = useState<VoteType | null>(null);
  const wallet = getWalletAddress();
  const verified = isVerified();

  const status = useMemo(() => ({ wallet, verified }), [wallet, verified]);

  const handleConnect = async () => {
    const addr = await connectWalletMock();
    toast({ title: "Wallet connected", description: `${addr.slice(0, 10)}… connected (demo).` });
  };

  const handleVerify = async () => {
    // Demo: mark verified and optionally set region via prompt
    const region = window.prompt("Enter your region/ward (optional)") || undefined;
    await verifyIdentityMock(region);
    toast({ title: "Identity verified", description: "Demo verification complete. Connect Supabase to enable real KYC/OTP." });
  };

  const vote = async (vt: VoteType) => {
    try {
      if (!isVerified()) {
        toast({ title: "Verification required", description: "Please verify your identity to vote.", variant: "destructive" });
        return;
      }
      if (!getWalletAddress()) {
        toast({ title: "Wallet required", description: "Connect your wallet to receive the non-transferable CivicVoteToken.", variant: "destructive" });
        return;
      }
      setLoading(vt);
      const rec = await submitVote(lawId, vt);
      toast({
        title: `Vote recorded: ${vt.toUpperCase()}`,
        description: `Tx: ${rec.txHash.slice(0, 18)}… • SBT minted to ${rec.walletAddress?.slice(0, 10)}… (demo)`,
      });
    } catch (e: any) {
      toast({ title: "Vote failed", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Vote on this bill</div>
        <div className="flex items-center gap-2">
          {status.wallet ? (
            <Badge variant="secondary">{status.wallet.slice(0, 10)}…</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={handleConnect}>Connect wallet</Button>
          )}
          {status.verified ? (
            <Badge variant="default">Verified</Badge>
          ) : (
            <Button size="sm" variant="secondary" onClick={handleVerify}>Verify identity</Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button disabled={loading !== null} onClick={() => vote("yes")} className="min-w-24">Yes</Button>
        <Button disabled={loading !== null} variant="secondary" onClick={() => vote("no")} className="min-w-24">No</Button>
        <Button disabled={loading !== null} variant="outline" onClick={() => vote("abstain")} className="min-w-24">Abstain</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        On vote, a non-transferable CivicVoteToken with metadata (lawId, timestamp, userHash) is issued to your wallet. This is a demo stub.
      </p>
    </div>
  );
};

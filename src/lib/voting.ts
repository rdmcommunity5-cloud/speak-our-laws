// Voting and blockchain integration stubs (frontend-only)
// Replace these with Supabase Edge Functions and on-chain contract calls when connected

export type VoteType = "yes" | "no" | "abstain";

export interface VoteRecord {
  id: string; // uuid-like
  lawId: string;
  voteType: VoteType;
  userIdHash: string; // SHA-256 hex (salted server-side in production)
  region?: string;
  timestamp: number; // ms
  txHash: string; // on-chain tx hash
  walletAddress?: string;
}

const LS_LEDGER = "vop-ledger";
const LS_VERIFIED = "vop-verified";
const LS_REGION = "vop-region";
const LS_WALLET = "vop-wallet";

function loadLedger(): VoteRecord[] {
  try {
    const raw = localStorage.getItem(LS_LEDGER);
    return raw ? (JSON.parse(raw) as VoteRecord[]) : [];
  } catch {
    return [];
  }
}

function saveLedger(records: VoteRecord[]) {
  localStorage.setItem(LS_LEDGER, JSON.stringify(records));
}

export function isVerified(): boolean {
  return localStorage.getItem(LS_VERIFIED) === "true";
}

export function getRegion(): string | undefined {
  return localStorage.getItem(LS_REGION) || undefined;
}

export async function verifyIdentityMock(region?: string) {
  // In production: perform Supabase Auth + KYC as required
  localStorage.setItem(LS_VERIFIED, "true");
  if (region) localStorage.setItem(LS_REGION, region);
}

export function getWalletAddress(): string | null {
  return localStorage.getItem(LS_WALLET);
}

function randomHex(bytes = 20) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function connectWalletMock(): Promise<string> {
  // In production: integrate WalletConnect/MetaMask
  const addr = "0x" + randomHex(20);
  localStorage.setItem(LS_WALLET, addr);
  return addr;
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signVoteIntentMock(payload: object): Promise<string> {
  // In production: request wallet signature of a typed message
  const json = JSON.stringify(payload);
  const digest = await sha256Hex(json + ":signed");
  return "0x" + digest;
}

export async function getUserHash(): Promise<string> {
  // In production: server generates salted user hash (POPIA)
  const wallet = getWalletAddress() || "anonymous";
  const verified = isVerified() ? "1" : "0";
  return sha256Hex(wallet + ":" + verified);
}

export async function submitVote(lawId: string, voteType: VoteType): Promise<VoteRecord> {
  const timestamp = Date.now();
  const walletAddress = getWalletAddress() || undefined;
  const userIdHash = await getUserHash();
  const region = getRegion();

  const ledger = loadLedger();
  // Prevent duplicate vote for same law + user
  const already = ledger.find((r) => r.lawId === lawId && r.userIdHash === userIdHash);
  if (already) {
    throw new Error("You have already voted on this law.");
  }

  const intent = { lawId, voteType, timestamp, userIdHash };
  const signature = await signVoteIntentMock(intent);
  const txHash = "0x" + randomHex(32); // simulate on-chain tx hash

  const record: VoteRecord = {
    id: "rec_" + randomHex(8),
    lawId,
    voteType,
    userIdHash,
    region,
    timestamp,
    txHash,
    walletAddress,
  };
  ledger.push(record);
  saveLedger(ledger);

  // In production: call Supabase Edge Function to mint SBT + write on-chain
  // await fetch('/functions/vote', { method:'POST', body: JSON.stringify({ ...intent, signature }) })

  return record;
}

export function getLedgerRecords(): VoteRecord[] {
  return loadLedger();
}

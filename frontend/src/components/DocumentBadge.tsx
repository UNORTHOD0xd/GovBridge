import { explorerTxUrl } from "../lib/contracts";

interface DocumentBadgeProps {
  txHash: string;
  docHash?: string;
}

export default function DocumentBadge({ txHash, docHash }: DocumentBadgeProps) {
  return (
    <a
      href={explorerTxUrl(txHash)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
      title={docHash || txHash}
    >
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      Verified on-chain
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

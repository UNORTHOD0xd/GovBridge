import { useState } from "react";
import { verifyDocument, explorerTxUrl, BASE_SEPOLIA } from "../lib/contracts";

export default function Verification() {
  const [docHash, setDocHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  async function handleVerify() {
    if (!docHash.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await verifyDocument(docHash.trim());
      setResult(res);
    } catch {
      setResult({ verified: false });
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-yellow-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">GB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-500 mt-1">Verify any GovBridge document on-chain</p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Hash
        </label>
        <input
          type="text"
          value={docHash}
          onChange={(e) => setDocHash(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />

        <button
          onClick={handleVerify}
          disabled={loading || !docHash.trim()}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Querying blockchain...
            </span>
          ) : (
            "Verify on-chain"
          )}
        </button>

        {searched && result && (
          <div className="mt-6 animate-slide-up">
            {result.verified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-green-700 font-bold">Document Verified</span>
                </div>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><span className="text-gray-500">Agency:</span> {result.agency}</p>
                  <p><span className="text-gray-500">Type:</span> {result.docType}</p>
                  <p><span className="text-gray-500">Issued:</span> {new Date(result.issuedAt * 1000).toLocaleString()}</p>
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    {result.revoked ? (
                      <span className="text-red-600 font-medium">Revoked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Valid</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <span className="text-red-600 font-bold">Document Not Found</span>
                <p className="text-sm text-gray-500 mt-1">This hash was not found on the blockchain</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">How it works</h3>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>When a government document is issued through GovBridge, its SHA-256 hash is anchored on Base Sepolia (Ethereum L2)</li>
            <li>Enter the document hash above to query the blockchain directly</li>
            <li>The smart contract returns the issuing agency, document type, and timestamp</li>
            <li>No intermediary needed &mdash; verification is instant and tamper-proof</li>
          </ol>
          <p className="text-xs text-gray-400 mt-2">
            Chain: Base Sepolia (ID: {BASE_SEPOLIA.chainId}) &middot;{" "}
            <a href={BASE_SEPOLIA.explorer} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              Block Explorer
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/login" className="text-green-600 text-sm hover:underline">
            Sign in to GovBridge
          </a>
        </div>
      </div>
    </div>
  );
}

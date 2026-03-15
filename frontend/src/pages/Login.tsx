import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { api } from "../lib/api";

export default function Login() {
  const [nin, setNin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<any>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consented, setConsented] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { setCitizen } = useAuth();
  const navigate = useNavigate();

  async function handleVerify() {
    if (nin.length < 9) {
      setError("NIN must be 9 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await api.verifyNin(nin);
      setVerified(data);
    } catch {
      setError("NIN not found in NIDS registry");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1500));
    sessionStorage.setItem("citizenId", verified.id);
    setCitizen({
      id: verified.id,
      nin,
      ninHash: verified.ninHash,
      name: verified.name,
      parish: verified.parish,
      dob: verified.dateOfBirth,
      jamDexBalance: verified.jamdexBalance,
    });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-yellow-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/coat-of-arms.svg" alt="Jamaica Coat of Arms" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">GovBridge</h1>
          <p className="text-gray-500 mt-1">Unified Jamaica Government Services</p>
        </div>

        {!verified ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National Identification Number (NIN)
            </label>
            <input
              type="text"
              maxLength={9}
              value={nin}
              onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter your 9-digit NIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg tracking-widest font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading || nin.length < 9}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Identity"
              )}
            </button>
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Demo NINs:</p>
              <p className="font-mono mt-1">100100100 &middot; 100200200 &middot; 100300300</p>
            </div>
          </>
        ) : !consented ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-green-700 font-semibold text-sm">JDXP Verified</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{verified.name}</p>
              <p className="text-gray-600">{verified.parish}</p>
              <p className="text-gray-500 text-sm">DOB: {verified.dateOfBirth}</p>
              {verified.gender && (
                <p className="text-gray-500 text-sm">Gender: {verified.gender}</p>
              )}
              {verified.trn && (
                <p className="text-gray-500 text-sm">TRN: {verified.trn}</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Data Sharing Consent</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                GovBridge requests access to your identity data via the Jamaica Data Exchange
                Platform (JDXP). By continuing, you consent to NIRA sharing your identity
                information with GovBridge for this session, in accordance with the National
                Identification and Registration Act, 2021.
              </p>
              <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">I consent to identity data sharing</span>
              </label>
            </div>

            <button
              onClick={() => setConsented(true)}
              disabled={!consentChecked}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-green-700 font-semibold text-sm">JDXP Verified</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{verified.name}</p>
              <p className="text-gray-600">{verified.parish}</p>
              <p className="text-gray-500 text-sm">DOB: {verified.dateOfBirth}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Jam-Dex Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                J$ {verified.jamdexBalance.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {confirming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Biometric confirmation...
                </span>
              ) : (
                "Confirm Identity"
              )}
            </button>
          </div>
        )}

        <div className="mt-6 text-center space-y-1">
          <a href="/verify" className="text-green-600 text-sm hover:underline block">
            Verify a document instead
          </a>
          <a href="/about" className="text-gray-400 text-xs hover:underline block">
            What is GovBridge?
          </a>
        </div>
      </div>
    </div>
  );
}

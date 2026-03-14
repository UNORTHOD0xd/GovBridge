import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import { api } from "../lib/api";
import { useEventStream } from "../hooks/useEventStream";
import { explorerTxUrl } from "../lib/contracts";

const SERVICES = [
  { type: "tax_compliance", label: "Tax Compliance Certificate", agency: "TAJ", fee: 5000 },
  { type: "birth_cert", label: "Birth Certificate Extract", agency: "RGD", fee: 3000 },
  { type: "police_record", label: "Police Record Check", agency: "JCF", fee: 2500 },
];

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  approved: "bg-purple-100 text-purple-800",
  issued: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const { citizen, setCitizen } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [creating, setCreating] = useState<string | null>(null);
  const navigate = useNavigate();
  const { connected, latestStatus } = useEventStream();

  useEffect(() => {
    api.getRequests().then(setRequests).catch(() => {});
  }, []);

  async function handleCreateRequest(serviceType: string) {
    setCreating(serviceType);
    try {
      const req = await api.createRequest(serviceType);
      navigate(`/pay/${req.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(null);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("citizenId");
    setCitizen(null);
    navigate("/login");
  }

  if (!citizen) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">GovBridge</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {citizen.name}
                </span>
                <span>&middot;</span>
                <span>{citizen.parish}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Jam-Dex Balance</p>
              <p className="font-bold text-gray-900">J$ {citizen.jamDexBalance.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              {connected ? "Live" : "Offline"}
            </div>
            <Link to="/analytics" className="text-sm text-green-600 hover:underline">Analytics</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <button
                key={s.type}
                onClick={() => handleCreateRequest(s.type)}
                disabled={creating !== null}
                className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-green-400 hover:shadow-md transition-all disabled:opacity-50"
              >
                <p className="font-semibold text-gray-900">{s.label}</p>
                <p className="text-sm text-gray-500 mt-1">{s.agency}</p>
                <p className="text-green-600 font-bold mt-3">J$ {s.fee.toLocaleString()}</p>
                {creating === s.type && (
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
                    <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {requests.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Requests</h2>
            <div className="space-y-3">
              {requests.map((r) => {
                const liveStatus = latestStatus(r.id) || r.status;
                return (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {r.serviceType.replace("_", " ")}
                        <span className="text-gray-400 text-sm ml-2">{r.agency}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[liveStatus] || "bg-gray-100 text-gray-600"}`}>
                          {liveStatus}
                        </span>
                        <span className="text-xs text-gray-400">
                          J$ {r.feeAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.chainTxHash && (
                        <a
                          href={explorerTxUrl(r.chainTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:underline"
                        >
                          Verified on-chain
                        </a>
                      )}
                      {liveStatus === "submitted" && (
                        <Link
                          to={`/pay/${r.id}`}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Pay
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

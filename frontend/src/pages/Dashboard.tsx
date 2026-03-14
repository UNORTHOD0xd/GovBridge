import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import { api } from "../lib/api";
import { useEventStream } from "../hooks/useEventStream";
import Layout from "../components/Layout";
import ServiceCard from "../components/ServiceCard";
import StatusPipeline from "../components/StatusPipeline";
import DocumentBadge from "../components/DocumentBadge";

const SERVICES = [
  { type: "tax_compliance", label: "Tax Compliance Certificate", agency: "TAJ", fee: 5000 },
  { type: "birth_cert", label: "Birth Certificate Extract", agency: "RGD", fee: 3000 },
  { type: "police_record", label: "Police Record Check", agency: "JCF", fee: 2500 },
];

export default function Dashboard() {
  const { citizen } = useAuth();
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

  if (!citizen) return null;

  return (
    <Layout connected={connected}>
      <section className="mb-10 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Request a Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.type}
              label={s.label}
              agency={s.agency}
              fee={s.fee}
              loading={creating === s.type}
              onClick={() => handleCreateRequest(s.type)}
            />
          ))}
        </div>
      </section>

      <section className="animate-slide-up">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Requests</h2>
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-400 text-sm">No requests yet. Select a service above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const liveStatus = latestStatus(r.id) || r.status;
              return (
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {r.serviceType.replace("_", " ")}
                        <span className="text-gray-400 text-sm ml-2">{r.agency}</span>
                      </p>
                      <span className="text-xs text-gray-400">
                        J$ {r.feeAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.chainTxHash && (
                        <DocumentBadge txHash={r.chainTxHash} docHash={r.docHash} />
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
                  <StatusPipeline status={liveStatus} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}

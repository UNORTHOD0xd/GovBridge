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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {r.serviceType.replace("_", " ")}
                        <span className="text-gray-400 text-xs sm:text-sm ml-2">{r.agency}</span>
                      </p>
                      <span className="text-xs text-gray-400">
                        J$ {r.feeAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {r.docHash && liveStatus === "issued" && (
                        <a
                          href={api.getCertificateUrl(r.docHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </a>
                      )}
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

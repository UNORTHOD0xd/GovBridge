import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../App";
import { api } from "../lib/api";
import { explorerTxUrl } from "../lib/contracts";

const SERVICE_LABELS: Record<string, string> = {
  tax_compliance: "Tax Compliance Certificate",
  birth_cert: "Birth Certificate Extract",
  police_record: "Police Record Check",
};

export default function Payment() {
  const { requestId } = useParams<{ requestId: string }>();
  const { citizen, setCitizen } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  useEffect(() => {
    if (!requestId) return;
    api.getRequests().then((reqs) => {
      const found = reqs.find((r: any) => r.id === requestId);
      if (found) setRequest(found);
    });
  }, [requestId]);

  async function handlePay() {
    if (!requestId || !citizen) return;
    setPaying(true);
    try {
      const res = await api.pay(requestId);
      setResult(res);
      setCitizen({ ...citizen, jamDexBalance: res.remainingBalance });
      triggerProcessing(requestId);
    } catch (e: any) {
      alert(e.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  async function triggerProcessing(id: string) {
    setProcessing(true);
    for (let i = 0; i < 3; i++) {
      setProcessStep(i + 1);
      await new Promise((r) => setTimeout(r, 2000));
      try {
        await api.processRequest(id);
      } catch { /* ignore */ }
    }
    setProcessing(false);
  }

  if (!request || !citizen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const STEPS = ["Processing", "Approved", "Issued"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <Link to="/dashboard" className="text-sm text-green-600 hover:underline mb-6 inline-block">
          &larr; Back to dashboard
        </Link>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {SERVICE_LABELS[request.serviceType] || request.serviceType}
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Agency</span>
            <span className="font-medium">{request.agency}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Fee</span>
            <span className="font-bold text-lg">J$ {request.feeAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Your balance</span>
            <span className="font-medium">J$ {citizen.jamDexBalance.toLocaleString()}</span>
          </div>
        </div>

        {!result ? (
          <button
            onClick={handlePay}
            disabled={paying || citizen.jamDexBalance < request.feeAmount}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing payment...
              </span>
            ) : (
              `Pay J$ ${request.feeAmount.toLocaleString()} with Jam-Dex`
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-green-600 font-bold text-lg">Payment Confirmed</span>
              <p className="text-sm text-gray-600 mt-2">
                Remaining balance: J$ {result.remainingBalance.toLocaleString()}
              </p>
            </div>

            {result.receiptId && (
              <div className="text-xs text-gray-500 break-all">
                <p>Receipt: {result.receiptId}</p>
              </div>
            )}

            {result.txHash && (
              <a
                href={explorerTxUrl(result.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-green-600 hover:underline"
              >
                View on Base Sepolia Explorer
              </a>
            )}

            {processing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 mb-3">Processing request...</p>
                <div className="flex gap-2">
                  {STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={`flex-1 text-center text-xs py-2 rounded ${
                        processStep > i
                          ? "bg-green-500 text-white"
                          : processStep === i + 1
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/dashboard"
              className="block text-center w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

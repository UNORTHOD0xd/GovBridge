import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getAnalytics().then(setData).catch(() => {
      setData({
        totalDocuments: 0,
        totalPayments: 0,
        avgProcessingMinutes: 0,
        totalVolume: 0,
        byAgency: {},
      });
    });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const agencies = Object.entries(data.byAgency || {}) as [string, number][];
  const maxAgency = Math.max(...agencies.map(([, v]) => v), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <h1 className="font-bold text-gray-900">Analytics</h1>
          </div>
          <Link to="/dashboard" className="text-sm text-green-600 hover:underline">
            &larr; Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Documents" value={data.totalDocuments} />
          <MetricCard label="Total Payments" value={data.totalPayments} />
          <MetricCard label="Avg Processing" value={`${data.avgProcessingMinutes} min`} />
          <MetricCard label="Jam-Dex Volume" value={`J$ ${Number(data.totalVolume).toLocaleString()}`} />
        </div>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Requests by Agency</h2>
          <div className="space-y-3">
            {agencies.map(([agency, count]) => (
              <div key={agency}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{agency}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxAgency) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

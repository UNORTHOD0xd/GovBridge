import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Layout from "../components/Layout";
import JamaicaMap from "../components/JamaicaMap";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [parishData, setParishData] = useState<Record<string, number>>({});

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
    api.getAnalyticsByParish().then(setParishData).catch(() => {});
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
    <Layout title="Analytics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Documents" value={data.totalDocuments} />
        <MetricCard label="Total Payments" value={data.totalPayments} />
        <MetricCard label="Avg Processing" value={`${data.avgProcessingMinutes} min`} />
        <MetricCard label="Jam-Dex Volume" value={`J$ ${Number(data.totalVolume).toLocaleString()}`} />
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Service Volume by Parish</h2>
        <JamaicaMap data={parishData} />
      </section>

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
    </Layout>
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

interface ServiceCardProps {
  label: string;
  agency: string;
  fee: number;
  loading: boolean;
  onClick: () => void;
}

export default function ServiceCard({ label, agency, fee, loading, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-green-400 hover:shadow-md transition-all disabled:opacity-50"
    >
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-sm text-gray-500 mt-1">{agency}</p>
      <p className="text-green-600 font-bold mt-3">J$ {fee.toLocaleString()}</p>
      {loading && (
        <span className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
          <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Creating...
        </span>
      )}
    </button>
  );
}

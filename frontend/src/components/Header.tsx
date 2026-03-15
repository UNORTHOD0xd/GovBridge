import { Link } from "react-router-dom";
import type { Citizen } from "../App";

interface HeaderProps {
  citizen?: Citizen | null;
  connected?: boolean;
  onLogout?: () => void;
  title?: string;
}

export default function Header({ citizen, connected, onLogout, title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/coat-of-arms.svg" alt="Jamaica Coat of Arms" className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-gray-900">{title || "GovBridge"}</h1>
              {citizen && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {citizen.name}
                  </span>
                  <span>&middot;</span>
                  <span>{citizen.parish}</span>
                </div>
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {citizen && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Jam-Dex Balance</p>
              <p className="font-bold text-gray-900">J$ {citizen.jamDexBalance.toLocaleString()}</p>
            </div>
          )}
          {connected !== undefined && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              {connected ? "Live" : "Offline"}
            </div>
          )}
          <Link to="/analytics" className="text-sm text-green-600 hover:underline">Analytics</Link>
          <Link to="/verify" className="text-sm text-green-600 hover:underline">Verify</Link>
          {onLogout && (
            <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

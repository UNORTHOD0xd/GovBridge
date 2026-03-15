import { useState } from "react";
import { Link } from "react-router-dom";
import type { Citizen } from "../App";

interface HeaderProps {
  citizen?: Citizen | null;
  connected?: boolean;
  onLogout?: () => void;
  title?: string;
}

export default function Header({ citizen, connected, onLogout, title }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src="/coat-of-arms.svg" alt="Jamaica Coat of Arms" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">{title || "GovBridge"}</h1>
              {citizen && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1 truncate">
                    <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                    <span className="truncate">{citizen.name}</span>
                  </span>
                  <span className="hidden sm:inline">&middot;</span>
                  <span className="hidden sm:inline">{citizen.parish}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
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

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 px-3 py-3 space-y-3 bg-gray-50">
          {citizen && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Jam-Dex Balance</span>
              <span className="font-bold text-gray-900">J$ {citizen.jamDexBalance.toLocaleString()}</span>
            </div>
          )}
          {connected !== undefined && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              {connected ? "Live" : "Offline"}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link to="/analytics" onClick={() => setMenuOpen(false)} className="text-sm text-green-600 hover:underline">Analytics</Link>
            <Link to="/verify" onClick={() => setMenuOpen(false)} className="text-sm text-green-600 hover:underline">Verify</Link>
            {onLogout && (
              <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 text-left">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

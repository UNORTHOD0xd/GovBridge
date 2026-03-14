import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  connected?: boolean;
  title?: string;
}

export default function Layout({ children, connected, title }: LayoutProps) {
  const { citizen, setCitizen } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("citizenId");
    setCitizen(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        citizen={citizen}
        connected={connected}
        onLogout={handleLogout}
        title={title}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

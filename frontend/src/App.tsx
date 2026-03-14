import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, type ReactNode } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Verification from "./pages/Verification";
import Analytics from "./pages/Analytics";

export interface Citizen {
  id: string;
  nin: string;
  ninHash: string;
  name: string;
  parish: string;
  dob: string;
  jamDexBalance: number;
}

interface AuthCtx {
  citizen: Citizen | null;
  setCitizen: (c: Citizen | null) => void;
}

export const AuthContext = createContext<AuthCtx>({
  citizen: null,
  setCitizen: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function Protected({ children }: { children: ReactNode }) {
  const { citizen } = useAuth();
  if (!citizen) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);

  return (
    <AuthContext.Provider value={{ citizen, setCitizen }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
          <Route
            path="/dashboard"
            element={<Protected><Dashboard /></Protected>}
          />
          <Route
            path="/pay/:requestId"
            element={<Protected><Payment /></Protected>}
          />
          <Route
            path="/analytics"
            element={<Protected><Analytics /></Protected>}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

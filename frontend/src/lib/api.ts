const BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const citizenId = sessionStorage.getItem("citizenId");
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(citizenId ? { "X-Citizen-Id": citizenId } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  verifyNin: (nin: string) =>
    request<any>("/api/auth/verify-nin", {
      method: "POST",
      body: JSON.stringify({ nin }),
    }),

  getRequests: () => request<any[]>("/api/requests"),

  createRequest: (serviceType: string) =>
    request<any>("/api/requests", {
      method: "POST",
      body: JSON.stringify({ serviceType }),
    }),

  processRequest: (id: string) =>
    request<void>(`/api/requests/${id}/process`, { method: "POST" }),

  pay: (requestId: string) =>
    request<any>(`/api/payments/${requestId}`, { method: "POST" }),

  getAnalytics: () => request<any>("/api/analytics/summary"),

  getAnalyticsByParish: () => request<Record<string, number>>("/api/analytics/by-parish"),

  getCertificateUrl: (docHash: string) => `${BASE}/api/documents/${docHash}/pdf`,
};

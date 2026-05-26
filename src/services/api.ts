const BASE = "http://10.10.0.153:5000";

const getToken = () => localStorage.getItem("token") || "";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// 🔥 WRAPPER: Centraliza as chamadas e desloga se o token expirar (401)
const request = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }

  return res.json();
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  getCampaigns: () => request(`${BASE}/campaigns`, { headers: authHeaders() }),
  getContacts: (id: number) =>
    request(`${BASE}/campaigns/${id}/contacts`, { headers: authHeaders() }),
  createCampaign: (data: any) =>
    request(`${BASE}/campaigns`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }),
  updateCampaign: (id: number, data: any) =>
    request(`${BASE}/campaigns/${id}`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }),
  deleteCampaign: (id: number) =>
    request(`${BASE}/campaigns/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  sendCampaign: (id: number) =>
    request(`${BASE}/campaigns/${id}/send`, {
      method: "POST",
      headers: authHeaders(),
    }),

  getInstances: () =>
    request(`${BASE}/evolution/instances`, { headers: authHeaders() }),
  createInstance: (instanceName: string) =>
    request(`${BASE}/evolution/instances`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS",
      }),
    }),
  connectInstance: (name: string) =>
    request(`${BASE}/evolution/instances/connect/${name}`, {
      headers: authHeaders(),
    }),
  deleteInstance: (name: string) =>
    request(`${BASE}/evolution/instances/${name}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
};

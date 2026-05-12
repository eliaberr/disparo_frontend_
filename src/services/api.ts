const BASE = "http://10.10.0.201:5000";
const getToken = () => localStorage.getItem("token") || "";
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});
const jsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});
export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  getCampaigns: async () => {
    const res = await fetch(`${BASE}/campaigns`, {
      headers: authHeaders(),
    });
    return res.json();
  },
  getContacts: async (id: number) => {
    const res = await fetch(`${BASE}/campaigns/${id}/contacts`, {
      headers: authHeaders(),
    });
    return res.json();
  },
  createCampaign: async (data: any) => {
    const res = await fetch(`${BASE}/campaigns`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateCampaign: async (id: number, data: any) => {
    const res = await fetch(`${BASE}/campaigns/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteCampaign: async (id: number) => {
    const res = await fetch(`${BASE}/campaigns/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return res.json();
  },
  sendCampaign: async (id: number) => {
    const res = await fetch(`${BASE}/campaigns/${id}/send`, {
      method: "POST",
      headers: authHeaders(),
    });
    return res.json();
  },

  // No seu api.ts, adicione dentro do export const api = { ... }
  getInstances: async () => {
    const res = await fetch(`${BASE}/evolution/instances`, {
      headers: authHeaders(),
    });
    return res.json();
  },
  createInstance: async (instanceName: string) => {
    const res = await fetch(`${BASE}/evolution/instances`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ instanceName }),
    });
    return res.json();
  },
  connectInstance: async (instanceName: string) => {
    const res = await fetch(`${BASE}/evolution/instances/connect/${instanceName}`, {
      headers: authHeaders(),
    });
    return res.json();
  },
  deleteInstance: async (instanceName: string) => {
    const res = await fetch(`${BASE}/evolution/instances/${instanceName}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return res.json();
  },
};

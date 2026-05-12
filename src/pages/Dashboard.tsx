import { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "@/services/api";
import CampaignCard from "@/components/CampaignCard";
import NewCampaignModal from "@/components/NewCampaignModal";
import { ImExit } from "react-icons/im";
import EvolutionModal from "@/components/EvolutionModal";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [evolutionOpen, setEvolutionOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Recarrega para voltar à tela de login
  };

  const load = useCallback(async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      await load();
    };
    initializeDashboard();
    const intervalId = setInterval(load, 3000);
    return () => clearInterval(intervalId);
  }, [load]);

  const filtered = useMemo(() => {
    return campaigns.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [campaigns, query]);

  const newCampaign = () => {
    setSelectedCampaign(null);
    setOpen(true);
  };

  const editCampaign = async (campaign: any) => {
    try {
      const contacts = await api.getContacts(campaign.id);
      setSelectedCampaign({
        ...campaign,
        contacts: contacts || [],
      });
      setOpen(true);
    } catch (err) {
      console.log(err);
      alert("Erro ao carregar contatos da campanha");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <input
              className="border p-2 rounded w-full max-w-64 bg-white shadow-sm"
              placeholder="Buscar campanha..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={newCampaign}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors shadow-md"
            >
              Nova campanha
            </button>
            <button
              onClick={() => setEvolutionOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
            >
              WhatsApp
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-3xl flex justify-center items-center rounded hover:bg-red-600 transition-colors h-10 w-12"
            >
              <ImExit />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onReload={load}
                onEdit={editCampaign}
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              {query
                ? "Nenhuma campanha encontrada para esta busca."
                : "Nenhuma campanha cadastrada."}
            </div>
          )}
        </div>
        <NewCampaignModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={load}
          campaign={selectedCampaign}
        />
        <EvolutionModal
          open={evolutionOpen}
          onClose={() => setEvolutionOpen(false)}
        />
      </div>
    </div>
  );
}

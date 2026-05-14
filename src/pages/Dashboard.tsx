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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
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
    <div className="min-h-screen bg-[#1C1D20] text-slate-100 p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* === NOVO CABEÇALHO ESPAÇADO E MODERNO === */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-800">
          
          {/* Título à esquerda */}
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie seus disparos e campanhas</p>
          </div>

          {/* Área de Ações à direita */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Input de Busca com Ícone */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl bg-[#141517] border border-slate-700 text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                placeholder="Buscar campanha..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Grupo de Botões (Nova Campanha e WhatsApp) encapsulados */}
            <div className="flex items-center gap-2 bg-[#141517] p-1.5 rounded-2xl border border-slate-700 shadow-sm">
              <button
                onClick={newCampaign}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-md active:scale-95"
              >
                Nova campanha
              </button>
              <button
                onClick={() => setEvolutionOpen(true)}
                className="bg-green-600/10 text-green-500 border border-green-600/20 px-5 py-2 rounded-xl hover:bg-green-600 hover:text-white transition-all font-semibold text-sm flex items-center gap-2 active:scale-95"
              >
                WhatsApp
              </button>
            </div>

            {/* Separador Visual (Linha fina) */}
            <div className="h-8 w-px bg-slate-800 hidden md:block mx-2" />

            {/* Botão Sair isolado */}
            <button
              onClick={handleLogout}
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-90"
              title="Sair"
            >
              <ImExit size={20} />
            </button>

          </div>
        </div>
        {/* === FIM DO NOVO CABEÇALHO === */}

        {/* Grid de Campanhas */}
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
            <div className="col-span-full py-10 text-center text-slate-400 italic">
              {query
                ? "Nenhuma campanha encontrada para esta busca."
                : "Nenhuma campanha cadastrada."}
            </div>
          )}
        </div>
        
        {/* Modais */}
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
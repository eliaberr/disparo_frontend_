import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { IoWarningOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";

export default function CampaignCard({ campaign, onReload, onEdit }: any) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (campaign.status === "enviando") {
      interval = setInterval(() => { onReload(); }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [campaign.status, onReload]);

  const statusStyles: any = {
    ativa: "bg-blue-900/30 text-blue-400",
    enviando: "bg-yellow-900/30 text-yellow-400 animate-pulse",
    finalizado: "bg-green-900/30 text-green-400",
  };

  const currentStyle = statusStyles[campaign.status] || "bg-slate-800 text-slate-400";
  const processed = (campaign.sent || 0) + (campaign.errors || 0);
  const percent = campaign.total > 0 ? Math.min(Math.floor((processed / campaign.total) * 100), 100) : 0;

  return (
    <div className={`bg-[#141517] p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-600 transition-all relative ${isDeleting ? "opacity-50" : ""}`}>
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-[#141517] p-6 rounded-xl border-t-4 border-red-500 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <IoWarningOutline className="mx-auto text-red-500 text-5xl" />
            <h3 className="text-xl font-bold text-white">Excluir Campanha?</h3>
            <p className="text-slate-400 text-sm">Deseja apagar <span className="text-white font-bold">"{campaign.name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancelar</button>
              <button onClick={async () => { setShowDeleteModal(false); setIsDeleting(true); await api.deleteCampaign(campaign.id); onReload(); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start">
        <h2 className="font-bold text-lg text-white truncate pr-2">{campaign.name}</h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentStyle}`}>
          {campaign.status}
        </span>
      </div>

     <div className="grid grid-cols-3 gap-3 text-center text-sm">
        {/* TOTAL */}
        <div className="bg-gray-600/15 border border-transparent border-slate-800 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Total</p>
          <p className="font-bold text-lg text-white">
            {campaign.total}
          </p>
        </div>

        {/* ENVIADOS (OK) */}
        <div className="bg-green-600/15 border border-transparent border-green-900/30 rounded-xl p-3">
          <p className="text-green-400 text-xs">Enviados</p>
          <p className="font-bold text-lg text-green-400">
            {campaign.sent}
          </p>
        </div>

        {/* ERROS */}
        <div className="bg-red-600/10 border border-transparent border-red-900/30 rounded-xl p-3">
          <p className="text-red-400 text-xs">Erros</p>
          <p className="font-bold text-lg text-red-400">
            {campaign.errors || 0}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
          <span>Progresso</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div className={`${percent === 100 ? "bg-green-500" : "bg-blue-600"} h-full transition-all duration-700`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <button onClick={async () => { setLoading(true); await api.sendCampaign(campaign.id); setLoading(false); onReload(); }} disabled={campaign.status === "enviando"} className="bg-green-600/10 text-green-500 border border-green-900 hover:bg-green-600 hover:text-white py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30">
          {campaign.status === "enviando" ? "..." : "Enviar"}
        </button>
        <button onClick={() => onEdit(campaign)} className="bg-blue-600/10 text-blue-400 border border-blue-900 hover:bg-blue-600 hover:text-white py-2 rounded-lg text-xs font-bold transition-all">Editar</button>
        <button onClick={() => setShowDeleteModal(true)} className="bg-red-600/10 text-red-500 border border-red-900 hover:bg-red-600 hover:text-white py-2 rounded-lg text-xs font-bold transition-all">Excluir</button>
      </div>
    </div>
  );
}
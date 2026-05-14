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
      interval = setInterval(() => {
        onReload();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [campaign.status, onReload]);

  const statusStyles: any = {
    ativa: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    "ativa (editada)":
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    enviando:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 animate-pulse",
    finalizado:
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  };

  const currentStyle =
    statusStyles[campaign.status] ||
    "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300";

  const send = async () => {
    setLoading(true);
    await api.sendCampaign(campaign.id);
    setLoading(false);
    onReload();
  };
  const executeDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await api.deleteCampaign(campaign.id);
      onReload();
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const processed = (campaign.sent || 0) + (campaign.errors || 0);
  const percent =
    campaign.total > 0
      ? Math.min(Math.floor((processed / campaign.total) * 100), 100)
      : 0;

  return (
    <div
      className={`bg-white dark:bg-[#141517] p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 space-y-4 hover:shadow-xl transition-all relative ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {showDeleteModal && (
        <div className="fixed h-screen inset-0 bg-black/60 flex items-center justify-center z-[100] animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-[#141517] p-6 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-4 border-t-4 border-red-500">
            <div className="flex justify-center text-red-500 text-5xl">
              <IoWarningOutline />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Excluir Campanha?
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Tem certeza que deseja apagar a campanha{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                "{campaign.name}"
              </span>
              ? Todos os relatórios de envio serão perdidos.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-[#1C1D20] text-slate-600 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">
            {campaign.name}
          </h2>
          {isDeleting && (
            <CgSpinner className="animate-spin text-red-500 text-xl" />
          )}
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium inline-block capitalize mt-2 ${currentStyle}`}
        >
          {campaign.status}
        </span>
        <div className="mt-3 text-xs text-slate-500 dark:text-gray-400 space-y-1">
          <p>
            Criada em: {new Date(campaign.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="bg-slate-50 dark:bg-gray-600/15 border border-transparent dark:border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 dark:text-gray-400 text-xs">Total</p>
          <p className="font-bold text-lg text-slate-900 dark:text-white">
            {campaign.total}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-600/15 border border-transparent dark:border-green-900/30 rounded-xl p-3">
          <p className="text-green-600 dark:text-green-400 text-xs">Enviados</p>
          <p className="font-bold text-lg text-green-700 dark:text-green-400">
            {campaign.sent}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-600/10 border border-transparent dark:border-red-900/30 rounded-xl p-3">
          <p className="text-red-600 dark:text-red-400 text-xs">Erros</p>
          <p className="font-bold text-lg text-red-700 dark:text-red-400">
            {campaign.errors || 0}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400">
          <span>Progresso</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className={` ${percent === 100 ? "bg-green-600" : "bg-blue-600" } h-3 transition-all duration-700 ease-in-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={send}
          disabled={loading || campaign.status === "enviando" || isDeleting}
          className={`${
            campaign.status === "enviando"
              ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-gray-300"
              : "bg-green-600/10 text-green-700 dark:text-green-400 hover:bg-green-700  cursor-pointer border border-green-900 font-medium hover:text-white dark:hover:text-white"
          } py-2 rounded-xl transition-colors`}
        >
          {loading || campaign.status === "enviando" ? "..." : "Enviar"}
        </button>
        <button
          onClick={() => onEdit(campaign)}
          disabled={campaign.status === "enviando" || isDeleting}
          className="bg-blue-600/10 hover:bg-blue-700 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white py-2 rounded-xl cursor-pointer  border  border-blue-900 font-medium disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={campaign.status === "enviando" || isDeleting}
          className="bg-red-600/10 hover:bg-red-700 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white py-2 rounded-xl cursor-pointer  border border-red-900 font-medium disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 flex justify-center items-center transition-colors"
        >
          {isDeleting ? <CgSpinner className="animate-spin" /> : "Excluir"}
        </button>
      </div>
    </div>
  );
}

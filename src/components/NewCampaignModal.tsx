import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IoClose, IoHelpCircleOutline, IoPeopleOutline } from "react-icons/io5";

import ContactsModal, { type Contact } from "./ContactsModal";
import HelpModal from "./HelpModal";
import {
  MESSAGE_CONFIGS,
  type SelectedPreview,
} from "@/constants/campaignConstants";

export default function NewCampaignModal({
  open,
  onClose,
  onCreated,
  campaign,
}: any) {
  const editing = !!campaign;

  // ── Estado ──────────────────────────────────────────────
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<Record<SelectedPreview, string>>({
    A: "",
    B: "",
    C: "",
  });
  const [selectedPreview, setSelectedPreview] = useState<SelectedPreview>("A");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // ── Reset / preenchimento ao abrir ──────────────────────
  useEffect(() => {
    if (!open) return;

    if (campaign) {
      setName(campaign.name || "");
      setMessages({
        A: campaign.message || "",
        B: campaign.message_b || "",
        C: campaign.message_c || "",
      });
      setContacts(campaign.contacts || []);
    } else {
      setName("");
      setMessages({ A: "", B: "", C: "" });
      setContacts([]);
      setSelectedPreview("A");
    }
  }, [open, campaign]);

  // ── Handlers de contatos ─────────────────────────────────
  const addContact = (contact: Contact) =>
    setContacts((prev) => [...prev, contact]);

  const removeContact = (i: number) =>
    setContacts((prev) => prev.filter((_, idx) => idx !== i));

  const clearAllContacts = () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todos os contatos desta campanha?",
      )
    )
      setContacts([]);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const parsed = text
        .split(/\r?\n/)
        .slice(1)
        .map((row) => {
          const [num, nom] = row.split(",");
          return { number: num?.trim(), name: nom?.trim() };
        })
        .filter((c) => c.number);

      setContacts((prev) => [...prev, ...parsed]);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Preview ──────────────────────────────────────────────
  const getPreviewText = () => {
    const baseText = messages[selectedPreview];
    if (!baseText)
      return `Preencha a Mensagem ${selectedPreview} para ver a prévia...`;

    return baseText
      .replace(/{nome}/gi, contacts[0]?.name || "Cliente")
      .replace(/\[([^\]]+)\]/g, (_, opts) => opts.split("|")[0]);
  };

  // ── Salvar ───────────────────────────────────────────────
  const save = async () => {
    if (!name || !messages.A) {
      alert("Preencha o nome e pelo menos a Mensagem A principal!");
      return;
    }
    if (contacts.length === 0) {
      alert("Adicione pelo menos um contato para salvar a campanha.");
      return;
    }

    const payload = {
      name,
      message: messages.A,
      message_b: messages.B,
      message_c: messages.C,
      contacts,
    };

    if (editing) {
      await api.updateCampaign(campaign.id, payload);
    } else {
      await api.createCampaign(payload);
    }

    onCreated();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center backdrop-blur-sm p-4">
        <div className="bg-[#141517] text-white border border-slate-800 w-full max-w-3xl rounded-2xl p-6 flex flex-col relative max-h-[90vh]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors cursor-pointer z-10"
          >
            <IoClose size={28} />
          </button>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pr-10 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {editing ? "Editar Campanha" : "Nova Campanha"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-md cursor-pointer border border-slate-700"
                title="Como usar o sistema"
              >
                <IoHelpCircleOutline size={22} />
              </button>
              <button
                type="button"
                onClick={() => setShowContactsModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-md cursor-pointer border ${
                  contacts.length > 0
                    ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-600/30"
                    : "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
                }`}
              >
                <IoPeopleOutline size={20} />
                {contacts.length > 0
                  ? `${contacts.length} Contatos`
                  : "Inserir Contatos"}
              </button>
            </div>
          </div>
          <div className="space-y-5 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent scrollbar-thumb-rounded-full flex-1">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Nome da Campanha
              </label>
              <input
                className="bg-[#1C1D20] border border-slate-700 p-3.5 w-full rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-600 font-medium transition-all shadow-inner"
                placeholder="Ex: Oferta Cartão Crefaz - Lote 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {MESSAGE_CONFIGS.map((cfg) => (
                <div
                  key={cfg.key}
                  className={`bg-[#1C1D20] p-4 rounded-xl border ${cfg.borderColor} ${cfg.focusColor} transition-colors shadow-inner`}
                >
                  <label
                    className={`text-xs font-bold ${cfg.labelColor} uppercase tracking-wider mb-2 flex justify-between`}
                  >
                    <span>{cfg.label}</span>
                    <span className="text-slate-500 font-normal normal-case">
                      {cfg.badge}
                    </span>
                  </label>
                  <textarea
                    className={`bg-transparent w-full ${cfg.height} text-white outline-none resize-none text-sm leading-relaxed placeholder:text-slate-600`}
                    placeholder={cfg.placeholder}
                    value={messages[cfg.key]}
                    onChange={(e) =>
                      setMessages((prev) => ({
                        ...prev,
                        [cfg.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            {(() => {
              const activeCfg = MESSAGE_CONFIGS.find(
                (c) => c.key === selectedPreview,
              )!;
              return (
                <div
                  className={`p-4 mt-2 rounded-xl border-t-4 shadow-inner ${activeCfg.previewBorder} transition-all duration-300 bg-[#1C1D20]/50`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${activeCfg.previewText}`}
                    >
                      Visualizar Prévia
                    </p>
                    <div className="flex gap-1.5 bg-[#141517] p-1 rounded-lg border border-slate-800">
                      {MESSAGE_CONFIGS.map((cfg) => (
                        <button
                          key={cfg.key}
                          type="button"
                          onClick={() => setSelectedPreview(cfg.key)}
                          className={`px-4 py-1 rounded text-xs font-extrabold transition-all duration-300 border focus:outline-none focus:ring-2 ${
                            selectedPreview === cfg.key
                              ? `${cfg.tabActive} text-white shadow-md`
                              : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800 cursor-pointer"
                          }`}
                        >
                          MENSAGEM {cfg.key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#141517] p-4 rounded-lg border border-slate-800 min-h-[60px] flex items-center">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                      {getPreviewText()}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="pt-6 mt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={save}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all cursor-pointer font-extrabold shadow-lg text-lg flex items-center justify-center gap-2"
            >
              {editing
                ? "Salvar Alterações da Campanha"
                : "Criar Nova Campanha"}
            </button>
          </div>
        </div>
      </div>
      {showContactsModal && (
        <ContactsModal
          contacts={contacts}
          onAdd={addContact}
          onRemove={removeContact}
          onClearAll={clearAllContacts}
          onImportCSV={handleCSVUpload}
          onClose={() => setShowContactsModal(false)}
        />
      )}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </>
  );
}

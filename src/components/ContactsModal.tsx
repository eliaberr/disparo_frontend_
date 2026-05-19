// ============================================================
//  src/components/ContactsModal.tsx
// ============================================================

import {
  IoClose,
  IoPeopleOutline,
  IoTrashOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";

export type Contact = {
  number: string;
  name: string;
};

type Props = {
  contacts: Contact[];
  onAdd: (contact: Contact) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
};

export default function ContactsModal({
  contacts,
  onAdd,
  onRemove,
  onClearAll,
  onImportCSV,
  onClose,
}: Props) {
  const [number, setNumber] = React.useState("");
  const [cname, setCname] = React.useState("");

  const handleAdd = () => {
    if (!number.trim()) return;
    onAdd({ number, name: cname });
    setNumber("");
    setCname("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C1D20] text-white border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <IoPeopleOutline className="text-blue-500" size={24} />
            Gerenciar Contatos
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <IoClose size={28} />
          </button>
        </div>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Inputs de adição manual */}
          <div className="flex gap-2">
            <input
              placeholder="Número (Ex: 5511999999999)"
              className="bg-[#141517] border border-slate-700 p-3 w-full rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              placeholder="Nome do Cliente"
              className="bg-[#141517] border border-slate-700 p-3 w-full rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              value={cname}
              onChange={(e) => setCname(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-bold shadow-md"
            >
              +
            </button>
          </div>

          {/* Upload CSV */}
          <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors bg-[#141517]">
            <IoCloudUploadOutline size={20} className="text-slate-400" />
            <span className="text-slate-300 font-medium text-sm">
              Importar Planilha CSV
            </span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImportCSV}
            />
          </label>

          {/* Cabeçalho da lista */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Lista de Envios ({contacts.length})
            </p>
            {contacts.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <IoTrashOutline /> Limpar Todos
              </button>
            )}
          </div>

          {/* Lista de contatos */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent scrollbar-thumb-rounded-full bg-[#141517] p-2 rounded-lg border border-slate-800">
            {contacts.length === 0 ? (
              <p className="text-center text-slate-600 text-sm py-8 italic">
                Nenhum contato adicionado ainda.
              </p>
            ) : (
              contacts.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border border-slate-800 bg-[#1C1D20] p-2.5 rounded-lg"
                >
                  <span className="text-slate-300 text-sm font-medium">
                    {c.name || "Sem nome"}{" "}
                    <span className="text-blue-500/80 ml-2 text-xs">
                      {c.number}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors p-1"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer font-bold mt-4"
        >
          Concluir e Voltar
        </button>
      </div>
    </div>
  );
}

// Necessário porque o useState é usado dentro do componente
import React from "react";
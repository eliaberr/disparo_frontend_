// ============================================================
//  src/components/HelpModal.tsx
// ============================================================

import { IoClose, IoInformationCircleOutline, IoPeopleOutline } from "react-icons/io5";
import { HELP_ITEMS } from "@/constants/campaignConstants";

type Props = {
  onClose: () => void;
};

// Resolve o ícone pelo nome salvo na constante (evita importar tudo no constants)
function Icon({ name }: { name?: string }) {
  if (name === "people") return <IoPeopleOutline size={16} />;
  return null;
}

export default function HelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C1D20] text-white border border-slate-700 w-full max-w-md md:max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-blue-400">
          <IoInformationCircleOutline size={24} />
          Como preencher e enviar?
        </h2>

        {/* Lista gerada pelo .map() — para adicionar um item basta editar campaignConstants.ts */}
        <div className="space-y-4 text-sm text-slate-300 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent scrollbar-thumb-rounded-full">
          {HELP_ITEMS.map((item) => (
            <div
              key={item.title}
              className={`bg-[#141517] p-3 rounded-lg border border-slate-800 ${item.accentBorder ?? ""}`}
            >
              <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                <Icon name={item.icon} />
                {item.title}
              </h3>
              <p className="whitespace-pre-line">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
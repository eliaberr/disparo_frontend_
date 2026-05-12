import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IoClose, IoAdd, IoTrash, IoQrCodeOutline, IoWarningOutline, IoSettingsOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg"; 

export default function EvolutionModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [instances, setInstances] = useState<any[]>([]);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  // Controle do Tipo de API
  const [apiType, setApiType] = useState<"AGX" | "META">("AGX");

  // Configuração Meta (Sendo salva apenas no estado por enquanto)
  const [metaConfig, setMetaConfig] = useState({
    token: "",
    phoneId: "",
    wabaId: ""
  });

  // Estados de carregamento
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadInstances = async () => {
    try {
      const data = await api.getInstances();
      const list = Array.isArray(data) ? data : data.instances || [];
      setInstances(list);
    } catch (error) {
      console.error("Erro ao carregar instâncias:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && apiType === "AGX") {
      loadInstances();
      setQrCode(null);
      interval = setInterval(loadInstances, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [open, apiType]);

  const handleCreate = async () => {
    if (!newInstanceName) return;
    setLoadingCreate(true);
    try {
      await api.createInstance(newInstanceName);
      setNewInstanceName("");
      await loadInstances(); 
    } finally {
      setLoadingCreate(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const instanceName = confirmDelete;
    setConfirmDelete(null);
    setLoadingDelete(instanceName);
    try {
      await api.deleteInstance(instanceName); 
      await loadInstances(); 
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleConnect = async (name: string) => {
    setQrCode(null);
    const data = await api.connectInstance(name);
    if (data && (data.base64 || data.code)) {
      setQrCode(data.base64 || data.code);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      
      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-4 border-t-4 border-red-500">
            <div className="flex justify-center text-red-500 text-5xl">
              <IoWarningOutline />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Excluir Instância?</h3>
            <p className="text-slate-600">Tem certeza que deseja apagar a instância <span className="font-bold">{confirmDelete}</span>?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Cancelar</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Gerenciar WhatsApp</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500 transition-colors">
            <IoClose />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* --- CHAVE SELETORA (TOGGLE) --- */}
          <div className="flex justify-center">
            <div className="bg-slate-200 p-1 rounded-lg flex gap-1 w-full max-w-[400px] shadow-inner">
              <button
                onClick={() => setApiType("AGX")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                  apiType === "AGX" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                AGX API (Evolution)
              </button>
              <button
                onClick={() => setApiType("META")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                  apiType === "META" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Meta API (Oficial)
              </button>
            </div>
          </div>

          {/* --- CONTEÚDO AGX API --- */}
          {apiType === "AGX" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex gap-2">
                <input
                  className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                  placeholder="Nome da nova instância..."
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  disabled={loadingCreate} 
                />
                <button 
                  onClick={handleCreate} 
                  disabled={loadingCreate}
                  className={`text-white px-4 py-2 rounded flex items-center gap-2 transition-all shadow-md ${loadingCreate ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {loadingCreate ? <CgSpinner className="animate-spin" /> : <IoAdd />}
                  {loadingCreate ? 'Criando...' : 'Criar'}
                </button>
              </div>

              {qrCode && (
                <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                  <p className="text-sm font-bold text-blue-800 mb-3 animate-pulse text-center">Escaneie o QR Code abaixo:</p>
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="QR Code" className="w-64 h-64" />
                  </div>
                  <button onClick={() => setQrCode(null)} className="mt-4 text-sm font-medium text-red-600 underline">Fechar QR Code</button>
                </div>
              )}

              <div className={`space-y-3 transition-opacity duration-300 ${(loadingCreate || !!loadingDelete) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="font-bold text-slate-700">Minhas Instâncias</h3>
                {instances.map((inst) => {
                  const name = inst.instanceName || inst.name || inst.instance?.instanceName;
                  const status = (inst.status || inst.connectionStatus || inst.instanceStatus || inst.state || "").toString().toLowerCase();
                  const isConnected = status === "open" || status === "connected";
                  const isDeleting = loadingDelete === name;

                  return (
                    <div key={name} className="flex justify-between items-center p-4 border rounded-xl bg-white hover:shadow-sm border-slate-200">
                      <div>
                        <p className="font-bold text-slate-800">{name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] ${isConnected ? 'text-green-500 animate-pulse' : 'text-slate-400'}`}>●</span>
                          <span className={`text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-slate-500'}`}>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleConnect(name)} className={`p-2.5 rounded-lg transition-all ${isConnected ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`} disabled={isConnected || isDeleting}><IoQrCodeOutline className="text-xl" /></button>
                        <button onClick={() => setConfirmDelete(name)} disabled={isDeleting} className={`p-2.5 rounded-lg transition-all shadow-sm ${isDeleting ? 'bg-slate-200 text-slate-400' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}>{isDeleting ? <CgSpinner className="text-xl animate-spin" /> : <IoTrash className="text-xl" />}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- CONTEÚDO META API --- */}
          {apiType === "META" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                  <IoSettingsOutline />
                  Configuração Meta API
                </div>
                <p className="text-xs text-amber-700">Insira as credenciais do seu painel Meta Developers para realizar disparos oficiais em massa.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Permanent Access Token</label>
                  <input 
                    type="password"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="EAAB..."
                    value={metaConfig.token}
                    onChange={(e) => setMetaConfig({...metaConfig, token: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number ID</label>
                    <input className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1056..." value={metaConfig.phoneId} onChange={(e) => setMetaConfig({...metaConfig, phoneId: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">WABA ID</label>
                    <input className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1092..." value={metaConfig.wabaId} onChange={(e) => setMetaConfig({...metaConfig, wabaId: e.target.value})} />
                  </div>
                </div>
                <button 
                  onClick={() => alert("Configuração Meta salva com sucesso (Front-end)!")}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Salvar Configurações Meta
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
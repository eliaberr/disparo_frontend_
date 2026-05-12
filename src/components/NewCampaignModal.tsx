import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Contact = {
  number: string;
  name: string;
};

export default function NewCampaignModal({
  open,
  onClose,
  onCreated,
  campaign, // 🔥 se vier campaign = editar
}: any) {
  const editing = !!campaign;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [number, setNumber] = useState("");
  const [cname, setCname] = useState("");

  // 🔥 quando abrir modal para editar
  useEffect(() => {
    if (open && campaign) {
      setName(campaign.name || "");
      setMessage(campaign.message || "");
      setContacts(campaign.contacts || []);
    }

    if (open && !campaign) {
      setName("");
      setMessage("");
      setContacts([]);
    }
  }, [open, campaign]);

  const addContact = () => {
    if (!number.trim()) return;

    setContacts((p) => [
      ...p,
      {
        number,
        name: cname,
      },
    ]);

    setNumber("");
    setCname("");
  };

  const removeContact = (i: number) => {
    setContacts((p) => p.filter((_, idx) => idx !== i));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = String(event.target?.result || "");

      const rows = text.split(/\r?\n/).slice(1);

      const parsed = rows
        .map((row) => {
          const [number, name] = row.split(",");

          return {
            number: number?.trim(),
            name: name?.trim(),
          };
        })
        .filter((c) => c.number);

      setContacts(parsed);
    };

    reader.readAsText(file);
  };

  const save = async () => {
    if (!name || !message) {
      alert("Preencha nome e mensagem");
      return;
    }

    if (editing) {
      await api.updateCampaign(campaign.id, {
        name,
        message,
        contacts,
      });
    } else {
      await api.createCampaign({
        name,
        message,
        contacts,
      });
    }

    onCreated();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[950px] rounded-2xl p-6 grid grid-cols-2 gap-6">
        {/* CONTATOS */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Contatos</h2>

          <div className="flex gap-2">
            <input
              placeholder="Número"
              className="border p-2 w-full rounded"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <input
              placeholder="Nome"
              className="border p-2 w-full rounded"
              value={cname}
              onChange={(e) => setCname(e.target.value)}
            />

            <button
              onClick={addContact}
              className="bg-blue-600 text-white px-4 rounded"
            >
              +
            </button>
          </div>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-blue-50">
            <span>Importar CSV</span>

            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </label>

          <div className="max-h-72 overflow-auto space-y-2">
            {contacts.map((c, i) => (
              <div key={i} className="flex justify-between border p-2 rounded">
                <span>
                  {c.name || "Sem nome"} - {c.number}
                </span>

                <button
                  onClick={() => removeContact(i)}
                  className="text-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPANHA */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            {editing ? "Editar campanha" : "Nova campanha"}
          </h2>

          <input
            className="border p-2 w-full rounded"
            placeholder="Nome campanha"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="border p-2 w-full h-40 rounded"
            placeholder="Mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Prévia:</p>

            <p>{message.replace("{nome}", contacts[0]?.name || "Cliente")}</p>
          </div>

          <button
            onClick={save}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {editing ? "Salvar alterações" : "Criar campanha"}
          </button>

          <button onClick={onClose} className="w-full text-red-600">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

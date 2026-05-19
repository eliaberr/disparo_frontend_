import { useState } from "react";
import { api } from "@/services/api";

export default function Login({ onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      onLogin();
    } else {
      alert("Login inválido");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#1C1D20]">
      <div className="bg-[#141517] p-8 rounded-2xl shadow-2xl w-96 space-y-6 border border-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Bem-vindo</h1>
          <p className="text-slate-400 text-sm">Faça login para gerenciar seus disparos</p>
        </div>
        
        <div className="space-y-4">
          <input
            className="bg-[#1C1D20] border border-slate-700 p-3 w-full rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-[#1C1D20] border border-slate-700 p-3 w-full rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
            onClick={handleLogin}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
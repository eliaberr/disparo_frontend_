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
    <div className="min-h-screen grid place-items-center bg-slate-100">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-3">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
          onClick={handleLogin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

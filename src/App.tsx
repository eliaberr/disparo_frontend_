import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Força as classes dark por segurança
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    // Pinta o fundo da tela 100% com a sua cor base
    document.body.style.backgroundColor = "#1C1D20";
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#1C1D20] text-slate-100">
      {logged ? <Dashboard /> : <Login onLogin={() => setLogged(true)} />}
    </div>
  );
}
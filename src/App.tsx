import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');

    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = "#f1f5f9"; // slate-100 para o fundo claro
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = "#1C1D20"; // A sua cor escura
    }
  }, []);

  return (
    <div className="w-full min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {logged ? <Dashboard /> : <Login onLogin={() => setLogged(true)} />}
    </div>
  );
}
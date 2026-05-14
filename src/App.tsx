import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  // Adicionamos o useEffect para ler o tema da URL ao carregar o app
  useEffect(() => {
    // Pega os parâmetros que vieram na URL do iframe (enviados pelo Chatwoot)
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');

    // Se o Chatwoot mandou "dark", adiciona a classe no HTML para ativar o seu index.css
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return logged ? <Dashboard /> : <Login onLogin={() => setLogged(true)} />;
}
import { useState } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  return logged ? <Dashboard /> : <Login onLogin={() => setLogged(true)} />;
}

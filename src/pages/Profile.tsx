import React, { useState, useEffect } from "react";
import { Settings, LogOut, Phone, ChevronRight, Camera, User, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-bg-dark/80 backdrop-blur-md">
        <div className="w-10 h-10" />
        <h1 className="text-lg font-bold text-white">Configurar Perfil</h1>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors">
          <Settings size={22} className="text-slate-300" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="flex flex-col items-center py-8 px-4">
          <div className="relative group">
            <div className="size-32 rounded-full border-4 border-primary p-1 shadow-[0_0_20px_rgba(255,99,33,0.2)]">
              <div 
                className="size-full rounded-full bg-cover bg-center bg-slate-800 flex items-center justify-center overflow-hidden" 
                style={{ backgroundImage: `url('https://picsum.photos/seed/${user?.id || 'user'}/200')` }}
              >
                {!user && <User size={48} className="text-slate-600" />}
              </div>
            </div>
            <label className="absolute bottom-0 right-0 bg-primary text-white size-10 rounded-full flex items-center justify-center border-4 border-bg-dark shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <Camera size={18} />
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">{user?.name || "Carregando..."}</h2>
          <p className="text-slate-500 text-sm">ID: #{user?.id?.slice(-6).toUpperCase() || "N/A"}</p>
        </section>

        <section className="px-4 space-y-3">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">Dados da Conta</h3>
          
          <div className="bg-card-dark p-4 rounded-xl flex items-center gap-4 border border-white/5">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs">Nome Completo</p>
              <p className="font-medium text-slate-200">{user?.name}</p>
            </div>
            <button className="text-primary text-xs font-bold">Editar</button>
          </div>

          <div className="bg-card-dark p-4 rounded-xl flex items-center gap-4 border border-white/5">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs">Telefone</p>
              <p className="font-medium text-slate-200">{user?.phone}</p>
            </div>
            <button className="text-primary text-xs font-bold">Editar</button>
          </div>

          <div className="bg-card-dark p-4 rounded-xl flex items-center gap-4 border border-white/5">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs">Data de Nascimento</p>
              <p className="font-medium text-slate-200">{user?.birthDate || "Não informada"}</p>
            </div>
            <button className="text-primary text-xs font-bold">Editar</button>
          </div>
        </section>

        <section className="px-4 py-8 space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Segurança</h3>
          </div>
          
          <button className="w-full bg-card-dark p-4 rounded-xl flex items-center justify-between border border-white/5 group">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <Settings size={20} />
              </div>
              <p className="font-medium text-slate-200">Alterar Senha de Acesso</p>
            </div>
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </section>

        <section className="px-4 pb-12">
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-xl border border-white/10 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </section>
      </main>
    </div>
  );
}

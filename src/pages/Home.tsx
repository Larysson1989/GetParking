import React, { useState, useEffect } from "react";
import { Search, Car, LayoutGrid, User, Settings, Camera, ChevronRight, Construction } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ vehicleCount: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }

    // Fetch stats
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-8">
      {/* Header / Profile Section */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-14 rounded-full border-2 border-primary p-0.5">
              <div 
                className="size-full rounded-full bg-cover bg-center bg-slate-800" 
                style={{ backgroundImage: `url('https://picsum.photos/seed/${user?.id || 'user'}/200')` }}
              ></div>
            </div>
            <button className="absolute -bottom-1 -right-1 bg-primary text-white size-5 rounded-full flex items-center justify-center border border-bg-dark shadow-lg">
              <Camera size={10} />
            </button>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Bem-vindo,</p>
            <h2 className="text-white font-bold text-lg">{user?.name || "Usuário"}</h2>
          </div>
        </div>
        <button 
          onClick={() => navigate("/profile")}
          className="size-10 rounded-full bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Search Bar */}
      <section>
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Buscar por Nome ou Placa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-card-dark border border-white/5 rounded-2xl pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:border-primary/50 focus:ring-0 transition-all"
          />
        </form>
      </section>

      {/* Stats Card */}
      <section>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary to-orange-600 p-6 rounded-3xl shadow-xl shadow-primary/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Car size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Total de Veículos</p>
            <h3 className="text-white text-4xl font-black">{stats.vehicleCount}</h3>
            <p className="text-white/60 text-[10px] mt-2 font-medium uppercase tracking-tighter">Base de dados atualizada em tempo real</p>
          </div>
        </motion.div>
      </section>

      {/* Main Actions Grid */}
      <section className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/search")}
          className="bg-card-dark p-5 rounded-2xl border border-white/5 flex items-center gap-4 group text-left"
        >
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <Car size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-base">Veículos Cadastrados</h3>
            <p className="text-slate-500 text-xs">Consultar lista completa de veículos</p>
          </div>
          <ChevronRight size={20} className="text-slate-700" />
        </motion.button>

        <div className="bg-card-dark p-5 rounded-2xl border border-white/5 flex items-center gap-4 opacity-60 relative overflow-hidden">
          <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <LayoutGrid size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-base">Setores</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Construction size={12} className="text-amber-500" />
              <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Em Construção</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-2">
            <div className="bg-amber-500/20 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">WIP</div>
          </div>
        </div>
      </section>

      {/* Profile Quick Config */}
      <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-primary" />
          <h3 className="text-white font-bold">Configurações do Perfil</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">Mantenha seus dados atualizados para facilitar a comunicação entre os voluntários.</p>
        <button 
          onClick={() => navigate("/profile")}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Editar Perfil
        </button>
      </section>
    </div>
  );
}

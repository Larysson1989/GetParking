import React, { useState, useEffect } from "react";
import { ClipboardList, ArrowLeft, MessageSquare, Search } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: string;
  owner: string;
  phone: string;
  plate: string;
  manufacturer: string;
  vehicleName: string;
  whatsapp: string;
}

export default function VehicleList() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Erro ao carregar veículos.");
        const data = await response.json();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="p-4 flex items-center gap-4 border-b border-white/5 bg-card-dark/50 sticky top-0 z-10 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="size-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white">Lista de Cadastro</h1>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {/* Search within list */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="FILTRAR NA LISTA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            className="w-full h-12 bg-card-dark border border-white/5 rounded-xl pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:border-primary/50 focus:ring-0 transition-all text-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm animate-pulse">Carregando base de dados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center">
            <p className="font-bold mb-2">Ops!</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-3 px-2 text-[10px] font-black text-primary uppercase tracking-widest">Nome</th>
                  <th className="py-3 px-2 text-[10px] font-black text-primary uppercase tracking-widest">Modelo</th>
                  <th className="py-3 px-2 text-[10px] font-black text-primary uppercase tracking-widest">Placa</th>
                  <th className="py-3 px-2 text-[10px] font-black text-primary uppercase tracking-widest">Celular</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle, idx) => (
                  <motion.tr 
                    key={vehicle.id || idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <p className="text-white text-xs font-bold leading-tight">{vehicle.owner}</p>
                    </td>
                    <td className="py-4 px-2 text-slate-300 text-xs">{vehicle.vehicleName}</td>
                    <td className="py-4 px-2 text-slate-300 text-xs font-mono uppercase">{vehicle.plate}</td>
                    <td className="py-4 px-2">
                      <a 
                        href={`https://wa.me/${vehicle.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-whatsapp font-bold text-xs"
                      >
                        <MessageSquare size={12} />
                        <span>{vehicle.phone}</span>
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-20 text-slate-600">
                <p>Nenhum veículo encontrado com este filtro.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, Car, MapPin, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";

interface Vehicle {
  id: string;
  owner: string;
  phone: string;
  plate: string;
  manufacturer: string;
  vehicleName: string;
  whatsapp: string;
}

export default function Search() {
  const location = useLocation();
  const [plate, setPlate] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const performSearch = useCallback(async (query: string) => {
    if (!query) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/vehicle/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao buscar veículo.");
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setPlate(query);
      performSearch(query);
    }
  }, [location.search, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(plate);
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <header className="flex items-center justify-center py-4">
        <h1 className="text-xl font-bold text-white uppercase tracking-[0.1em]">LOCALIZAR VEÍCULO</h1>
      </header>

      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex w-full items-stretch rounded-xl h-14 bg-card-dark border border-primary/20 focus-within:border-primary transition-colors overflow-hidden">
          <div className="text-primary flex items-center justify-center pl-4">
            <Car size={24} />
          </div>
          <input 
            className="flex w-full border-none bg-transparent focus:ring-0 text-slate-100 placeholder:text-slate-600 px-4 text-base font-medium" 
            placeholder="Nome ou Placa (ABC-1234)" 
            type="text" 
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl h-14 px-5 bg-primary text-white gap-2 font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <SearchIcon size={20} />
          <span>{loading ? "Pesquisando..." : "Pesquisar"}</span>
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-primary text-sm font-bold uppercase tracking-[0.2em]">RESULTADOS ({results.length})</h2>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {results.map((result, index) => (
            <motion.div 
              key={result.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card-dark rounded-xl p-6 border border-primary/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">PROPRIETÁRIO</p>
                  <h3 className="text-white text-lg font-semibold leading-tight">{result.owner}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">VEÍCULO</p>
                    <p className="text-slate-200 font-medium">{result.vehicleName}</p>
                  </div>
                  <div>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">PLACA</p>
                    <p className="text-slate-200 font-medium uppercase">{result.plate}</p>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${result.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-white py-3 rounded-lg font-bold transition-all mt-2 shadow-lg shadow-green-900/20"
                >
                  <MessageSquare size={20} />
                  <span>Contatar via WhatsApp</span>
                </a>
              </div>
            </motion.div>
          ))}

          {results.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-slate-600">
              <Car size={48} className="mx-auto mb-4 opacity-20" />
              <p>Digite um nome ou placa para localizar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

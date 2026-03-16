import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Smartphone, Car, Tag, Save } from "lucide-react";
import { motion } from "motion/react";
import { maskPhone } from "../utils/masks";

export default function RegisterVehicleForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      ownerName: formData.get("ownerName")?.toString().toUpperCase(),
      phone: phone,
      plate: formData.get("plate")?.toString().toUpperCase(),
      model: formData.get("model")?.toString().toUpperCase(),
    };

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar veículo.");
      }

      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 flex flex-col min-h-screen">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Dados do Veículo</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Nome do Proprietário</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                name="ownerName"
                className="w-full h-14 pl-12 pr-4 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                placeholder="NOME COMPLETO"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Telefone</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="tel" 
                name="phone"
                className="w-full h-14 pl-12 pr-4 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="(00) 0 0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Placa do Veículo</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                name="plate"
                maxLength={7}
                minLength={7}
                className="w-full h-14 pl-12 pr-4 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                placeholder="ABC1234"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Modelo do Veículo</label>
            <div className="relative group">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                name="model"
                className="w-full h-14 pl-12 pr-4 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                placeholder="EX: TOYOTA COROLLA"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 mt-8 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Cadastro"}
            {!loading && <Save size={20} />}
          </button>
        </form>
      </main>
    </div>
  );
}

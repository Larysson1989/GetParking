import React, { useState } from "react";
import { Smartphone, Car, Tag, User, Save, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { maskPhone } from "../utils/masks";

export default function PublicVehicleRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="px-6 py-12 flex flex-col min-h-screen items-center justify-center text-center bg-bg-dark">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="size-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20"
        >
          <CheckCircle2 size={48} className="text-emerald-500" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Cadastro Realizado!</h2>
        <p className="text-slate-400 max-w-xs mx-auto leading-relaxed mb-8">
          Seus dados foram enviados com sucesso para a equipe do Get.Parking. Obrigado por colaborar!
        </p>
        <div className="flex flex-col items-center opacity-40">
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="text-[#9F7445]">GET</span>
            <span className="text-white">.Parking</span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 flex flex-col min-h-screen bg-bg-dark">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-1">
          <span className="text-[#9F7445]">GET</span>
          <span className="text-white">.Parking</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">Cadastro de Veículo</p>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Olá!</h2>
          <p className="text-slate-400 text-sm">
            Por favor, preencha os dados do seu veículo abaixo para que possamos manter nossa base atualizada.
          </p>
        </div>

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
                placeholder="DIGITE SEU NOME COMPLETO"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Telefone de Contato</label>
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
            {loading ? "Enviando..." : "Finalizar Cadastro"}
            {!loading && <Save size={20} />}
          </button>
        </form>

        <div className="mt-12 text-center opacity-30">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] leading-relaxed">
            Todos os direitos reservados ® <br />
            <span className="text-slate-400">Larysson Lara 21.178.711/0001-20</span>
          </p>
        </div>
      </main>
    </div>
  );
}

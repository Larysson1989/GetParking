import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Smartphone, Lock, Eye, EyeOff, UserPlus, ArrowLeft, ShieldCheck, Calendar, ParkingCircle } from "lucide-react";
import { motion } from "motion/react";
import { maskPhone } from "../utils/masks";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
    if (error) setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name");
    const phoneValue = phone;
    const password = formData.get("password");
    const birthDate = formData.get("birthDate");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneValue, password, birthDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      navigate("/login");
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
        <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Cadastro de Voluntário</h1>
      </header>

      <main className="flex-1 flex flex-col items-center max-w-md mx-auto w-full">
        <div className="w-full mb-8 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center rounded-full mb-4 p-4 bg-primary/10 border border-primary/20"
          >
            <img 
              src="data:image/png;base64,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 (Logo)" 
              className="w-32 h-32 object-contain"
            />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Junte-se a nós</h2>
          <p className="text-slate-400 px-6">
            Preencha os dados abaixo para começar sua jornada como voluntário e transformar vidas.
          </p>
        </div>

        <div className="w-full bg-card-dark p-6 rounded-xl border border-white/10 shadow-xl">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">NOME COMPLETO</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input 
                  type="text" 
                  name="name"
                  className="w-full pl-10 pr-4 py-3 bg-bg-dark border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="DIGITE SEU NOME COMPLETO"
                  onChange={(e) => e.target.value = e.target.value.toUpperCase()}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Número do Celular</label>
              <div className="relative group">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full pl-10 pr-4 py-3 bg-bg-dark border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="(00) 0 0000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  minLength={16}
                  maxLength={16}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Data de Nascimento</label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input 
                  type="date" 
                  name="birthDate"
                  className="w-full pl-10 pr-4 py-3 bg-bg-dark border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Senha (6 dígitos numéricos)</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-bg-dark border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="000000"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
              {!loading && <UserPlus size={20} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Já possui uma conta?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">Entre aqui</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 opacity-60">
          <ShieldCheck size={16} className="text-slate-400" />
          <p className="text-xs text-slate-400">Seus dados estão seguros conosco sob a LGPD</p>
        </div>
      </main>
    </div>
  );
}

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

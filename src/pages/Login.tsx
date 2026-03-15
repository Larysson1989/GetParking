import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Smartphone, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { maskPhone } from "../utils/masks";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotRegisteredModal, setShowNotRegisteredModal] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password: e.currentTarget.password.value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao entrar.");
      }

      // Store user info in localStorage for simple session management
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err: any) {
      if (err.message === "Número não cadastrado.") {
        setShowNotRegisteredModal(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 flex flex-col min-h-screen justify-center">
      <div className="flex flex-col items-center mb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 mb-6 bg-primary/10 rounded-full flex items-center justify-center p-4 border border-primary/20"
        >
          <img 
            src="data:image/png;base64,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" 
            alt="Get Parking Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Get Parking</h1>
        <p className="text-slate-400 text-sm mt-2">Acesse sua conta premium</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Celular</label>
          <div className="relative group">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="tel" 
              name="phone"
              className="w-full h-14 pl-12 pr-4 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-slate-300">Senha (6 dígitos)</label>
            <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">Esqueceu a senha?</button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              minLength={6}
              className="w-full h-14 pl-12 pr-12 bg-card-dark border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-4 uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <LogIn size={20} />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline">Cadastre-se</Link>
        </p>
      </div>

      {/* Modal Overlay for Unregistered User */}
      {showNotRegisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-card-dark border border-white/10 rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <Smartphone className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Usuário não cadastrado</h2>
            <p className="text-slate-400 mb-8">
              Não encontramos nenhum cadastro para este número de celular. Deseja criar uma conta agora?
            </p>
            <div className="space-y-3">
              <Link 
                to="/register" 
                className="block w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all uppercase tracking-wider"
              >
                Cadastrar agora
              </Link>
              <button 
                onClick={() => setShowNotRegisteredModal(false)}
                className="block w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl transition-all"
              >
                Tentar outro número
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

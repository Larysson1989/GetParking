import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Smartphone, Lock, Eye, EyeOff, LogIn, ParkingCircle } from "lucide-react";
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

  const handleForgotPassword = () => {
    const message = encodeURIComponent("Oi, eu esqueci a minha senha de acesso no Get.Parking");
    window.open(`https://wa.me/5541997015424?text=${message}`, "_blank");
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
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-2">
          <span className="text-[#9F7445]">GET</span>
          <span className="text-white">.Parking</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold tracking-[0.3em] uppercase">GET CHURCH CURITIBA</p>
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
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Esqueceu a senha?
            </button>
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

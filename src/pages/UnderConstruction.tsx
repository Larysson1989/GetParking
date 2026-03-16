import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { motion } from "motion/react";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 flex flex-col min-h-screen">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Em Construção</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="size-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
        >
          <Construction size={64} className="text-primary" />
        </motion.div>
        
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Em Construção</h2>
        <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
          Estamos trabalhando nesta funcionalidade. Em breve você poderá enviar links de cadastro diretamente pelo WhatsApp.
        </p>
        
        <button 
          onClick={() => navigate(-1)}
          className="mt-12 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
        >
          Voltar
        </button>
      </main>
    </div>
  );
}

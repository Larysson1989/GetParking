import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Link as LinkIcon, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function RegisterVehicleChoice() {
  const navigate = useNavigate();

  const handleShareLink = () => {
    const publicUrl = `${window.location.origin}/cadastrar`;
    const message = encodeURIComponent(`Olá! Por favor, utilize este link para cadastrar seu veículo no Get.Parking: ${publicUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="px-6 py-8 flex flex-col min-h-screen">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Cadastrar Veículo</h1>
      </header>

      <main className="flex-1 flex flex-col gap-4 max-w-md mx-auto w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareLink}
          className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4 group text-left"
        >
          <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <LinkIcon size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Enviar link de cadastro</h3>
            <p className="text-slate-500 text-sm">Compartilhar link para o proprietário preencher</p>
          </div>
          <ChevronRight size={20} className="text-slate-700" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/register-vehicle-form")}
          className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4 group text-left"
        >
          <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <FileText size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Preencher dados</h3>
            <p className="text-slate-500 text-sm">Cadastrar veículo manualmente agora</p>
          </div>
          <ChevronRight size={20} className="text-slate-700" />
        </motion.button>
      </main>
    </div>
  );
}

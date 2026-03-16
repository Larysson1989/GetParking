import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Car, LogOut, AlertCircle } from "lucide-react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import VehicleList from "./pages/VehicleList";
import RegisterVehicleChoice from "./pages/RegisterVehicleChoice";
import RegisterVehicleForm from "./pages/RegisterVehicleForm";
import PublicVehicleRegistration from "./pages/PublicVehicleRegistration";
import UnderConstruction from "./pages/UnderConstruction";
import Navigation from "./components/Navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = ["/login", "/register", "/register-vehicle-choice", "/register-vehicle-form", "/under-construction", "/cadastrar"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSupport = () => {
    const message = encodeURIComponent("Olá Larysson Lara, preciso de ajuda com o suporte.");
    window.open(`https://wa.me/5541997015424?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative overflow-hidden">
      {!hideNav && (
        <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Car size={18} className="text-primary" />
            </div>
            <span className="font-bold text-white tracking-tighter">Get Parking</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleSupport}
              className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-all"
              title="Suporte"
            >
              <AlertCircle size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center size-10 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
      )}
      <main className={`flex-1 overflow-y-auto ${!hideNav ? "pb-24" : "pb-8"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <footer className="py-8 px-6 text-center border-t border-white/5 mt-8">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] leading-relaxed">
            Todos os direitos reservados ® <br />
            <span className="text-slate-400">Larysson Lara 21.178.711/0001-20</span>
          </p>
        </footer>
      </main>
      {!hideNav && <Navigation />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/database" element={<VehicleList />} />
          <Route path="/register-vehicle-choice" element={<RegisterVehicleChoice />} />
          <Route path="/register-vehicle-form" element={<RegisterVehicleForm />} />
          <Route path="/cadastrar" element={<PublicVehicleRegistration />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

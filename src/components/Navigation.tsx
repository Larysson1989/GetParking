import { NavLink } from "react-router-dom";
import { Search, LayoutGrid, Home, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navigation() {
  const navItems = [
    { path: "/home", label: "Início", icon: Home },
    { path: "/search", label: "Consulta", icon: Search },
    { path: "/database", label: "Lista de Cadastro", icon: LayoutGrid },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card-dark border-t border-white/5 px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-primary scale-110" : "text-primary/40 hover:text-primary/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

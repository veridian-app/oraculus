import { useNavigate, useLocation } from "react-router-dom";
import { Home, Bookmark, User } from "lucide-react";
import "./BottomDock.css";

export const BottomDock = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.startsWith("/veridian-news")) return "feed";
    if (location.pathname.startsWith("/library")) return "library";
    if (location.pathname.startsWith("/profile") || location.pathname.startsWith("/settings")) return "profile";
    return "feed"; // Por defecto, feed activo
  };

  const activeTab = getActiveTab();

  const handleNavigation = (tab: string) => {
    if (tab === "feed") {
      navigate("/veridian-news");
    } else if (tab === "library") {
      navigate("/library");
    } else if (tab === "profile") {
      navigate("/profile");
    }
  };

  const iconClass = (tab: string) => {
    const isActive = activeTab === tab;
    return `w-6 h-6 transition-all duration-300 ${
      isActive 
        ? "text-primary" 
        : "text-neutral-500"
    }`;
  };

  return (
    <div className="bottom-dock-container">
      <div className="bottom-dock-content">
        {/* Icono Home - Feed */}
        <button
          onClick={() => handleNavigation("feed")}
          className="dock-button"
          aria-label="Feed de Verdad"
        >
          <Home className={iconClass("feed")} />
        </button>

        {/* Icono Bookmark - Biblioteca */}
        <button
          onClick={() => handleNavigation("library")}
          className="dock-button"
          aria-label="Biblioteca"
        >
          <Bookmark className={iconClass("library")} />
        </button>

        {/* Icono User - Perfil */}
        <button
          onClick={() => handleNavigation("profile")}
          className="dock-button"
          aria-label="Perfil"
        >
          <User className={iconClass("profile")} />
        </button>
      </div>
    </div>
  );
};


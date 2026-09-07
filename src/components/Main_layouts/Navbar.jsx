import { useState } from "react";
import {Menu, LogOut, LayoutDashboard  } from "lucide-react";
import { useNavigate, Link  } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const handleLogout = () => { sessionStorage.removeItem("otpVerified");
    navigate("/");
  };

  return (
    <header className="relative w-full h-16 bg-white border-b flex items-center justify-between px-3 sm:px-6 shadow-sm gap-2 sm:gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={onMenuClick} className="md:hidden p-2 -ms-1 rounded-lg text-gray-600 hover:bg-gray-100 transition shrink-0" aria-label="فتح القائمة">
          <Menu size={22} />
        </button>

        <Link to="/admin/dashboard" className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800 whitespace-nowrap truncate hover:text-blue-600 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <h1 className="whitespace-nowrap truncate">لوحة التحكم</h1>
        </Link>
      </div>

      {/* Right group */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          aria-label="بحث"
        >
        </button>

        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition whitespace-nowrap">
          <LogOut className="w-5 h-5"/>
          <span className="hidden sm:inline">تسجيل خروج</span>
          <span className="sm:hidden">تسجيل خروج</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
import { useState } from "react";
import {Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const handleLogout = () => {
    sessionStorage.removeItem("otpVerified");
    navigate("/");
  };

  return (
    <header className="relative w-full h-16 bg-white border-b flex items-center justify-between px-3 sm:px-6 shadow-sm gap-2 sm:gap-4" dir="ltr">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ms-1 rounded-lg text-gray-600 hover:bg-gray-100 transition shrink-0"
          aria-label="فتح القائمة"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-gray-800 whitespace-nowrap truncate">
          Dashboard
        </h1>
      </div>

      {/* Right group */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          aria-label="بحث"
        >
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition whitespace-nowrap"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Logout</span>
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="absolute top-full inset-x-0 bg-white border-b shadow-sm p-3 sm:hidden z-20">
          {/* <form onSubmit={handleSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث..."
                className="w-full ps-10 pe-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="إغلاق البحث"
            >
              <X size={18} />
            </button>
          </form> */}
        </div>
      )}
    </header>
  );
}

export default Navbar;
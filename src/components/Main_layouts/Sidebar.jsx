import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";

function Sidebar({ isOpen, onClose, onOpen }) {
const [openSections, setOpenSections] = useState({
  booking: false,
  reports: false,
  settings: false,
});  

  const sidebarRef = useRef(null);
  const edgeRef = useRef(null);

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition text-base ${
      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose?.();
  };

  useEffect(() => {
    const sidebarEl = sidebarRef.current;
    const edgeEl = edgeRef.current;
    if (!sidebarEl) return;

    const isMobile = () => window.innerWidth < 768;
    const width = () => sidebarEl.offsetWidth || window.innerWidth;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let locked = null;
    let currentPercent = isOpen ? 0 : 100;

    const setTransform = (percent, animate) => {
      sidebarEl.style.transition = animate ? "transform 280ms ease-in-out" : "none";
      sidebarEl.style.transform = `translateX(${percent}%)`;
    };

    const applyBaseState = () => {
      if (!isMobile()) {
        sidebarEl.style.transition = "none";
        sidebarEl.style.transform = "none";
      } else {
        setTransform(isOpen ? 0 : 100, true);
      }
    };
    applyBaseState();

    const onStart = (x, y) => {
      if (!isMobile()) return;
      startX = x;
      startY = y;
      dragging = true;
      locked = null;
      currentPercent = isOpen ? 0 : 100;
      setTransform(currentPercent, false);
    };

    const onMove = (x, y, e) => {
      if (!dragging) return;
      const deltaX = x - startX;
      const deltaY = y - startY;

      if (!locked) {
        if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
          locked = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
        }
      }
      if (locked !== "horizontal") return;

      e.preventDefault();
      const base = isOpen ? 0 : 100;
      let percent = base + (deltaX / width()) * 100;
      percent = Math.min(100, Math.max(0, percent));
      currentPercent = percent;
      setTransform(percent, false);
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      if (locked === "horizontal") {
        if (currentPercent < 65) {
          setTransform(0, true);
          if (!isOpen) onOpen?.();
        } else {
          setTransform(100, true);
          if (isOpen) onClose?.();
        }
      } else {
        setTransform(isOpen ? 0 : 100, true);
      }
      locked = null;
    };

    const tsSidebar = (e) => onStart(e.touches[0].clientX, e.touches[0].clientY);
    const tmSidebar = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY, e);
    const teSidebar = () => onEnd();

    sidebarEl.addEventListener("touchstart", tsSidebar, { passive: true });
    sidebarEl.addEventListener("touchmove", tmSidebar, { passive: false });
    sidebarEl.addEventListener("touchend", teSidebar);

    let tsEdge, tmEdge, teEdge;
    if (edgeEl) {
      tsEdge = (e) => onStart(e.touches[0].clientX, e.touches[0].clientY);
      tmEdge = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY, e);
      teEdge = () => onEnd();
      edgeEl.addEventListener("touchstart", tsEdge, { passive: true });
      edgeEl.addEventListener("touchmove", tmEdge, { passive: false });
      edgeEl.addEventListener("touchend", teEdge);
    }

    const onResize = () => applyBaseState();
    window.addEventListener("resize", onResize);

    return () => {
      sidebarEl.removeEventListener("touchstart", tsSidebar);
      sidebarEl.removeEventListener("touchmove", tmSidebar);
      sidebarEl.removeEventListener("touchend", teSidebar);
      if (edgeEl) {
        edgeEl.removeEventListener("touchstart", tsEdge);
        edgeEl.removeEventListener("touchmove", tmEdge);
        edgeEl.removeEventListener("touchend", teEdge);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, onOpen, onClose]);

  return (
    <>
      {!isOpen && (
        <div ref={edgeRef} className="fixed inset-y-0 end-0 w-5 z-40 md:hidden">
          <div className="absolute top-1/2 -translate-y-1/2 end-1 w-1.5 h-16 rounded-full bg-gray-300/70" />
        </div>
      )}

      <div ref={sidebarRef} className="bg-white p-5 gap-4 flex flex-col fixed md:static top-0 bottom-0 end-0 z-40 w-full md:w-64 md:border-s
          translate-x-full md:translate-x-0 overflow-y-auto touch-pan-y">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My App</h2>
          <button onClick={onClose} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="إغلاق القائمة">
            <X size={24} />
          </button>
        </div>

        {/* Section 1 */}
        <div className="mb-2 flex flex-col gap-4">
          <button
            onClick={() => toggleSection("booking")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium text-base">
            <span>ادارة التطبيق</span>
            <ChevronDown size={18} className={`transition-transform ${openSections.booking ? "rotate-180" : ""}`}/>
          </button>

          {openSections.booking && (
            <nav className="flex flex-col gap-2 mt-2 ps-2">
              <NavLink to="/home/booking" className={linkClass} onClick={handleLinkClick}>ادارة الاشتراكات و الحجوزات</NavLink>
              <NavLink to="/home/users" className={linkClass} onClick={handleLinkClick}>اداة حسابات المستخدمين</NavLink>
              <NavLink to="/home/cars" className={linkClass} onClick={handleLinkClick}>ادارة معلومات السيارات</NavLink>
            </nav>
          )}
        </div>

        {/* Section 2 */}
        <div className="flex flex-col gap-4">
          <button onClick={() => toggleSection("reports")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium text-base">
            <span>التسويق و المبيعات</span>
            <ChevronDown size={18} className={`transition-transform ${openSections.reports ? "rotate-180" : ""}`}/>
          </button>

          {openSections.reports && (
            <nav className="flex flex-col gap-2 mt-2 ps-2">
              <NavLink to="/home/baqu" className={linkClass} onClick={handleLinkClick}>الباقات </NavLink>
              <NavLink to="/home/gift" className={linkClass} onClick={handleLinkClick}>الهدايا </NavLink>
              <NavLink to="/home/points" className={linkClass} onClick={handleLinkClick}>ادارة النقاط</NavLink>
            </nav>
          )}
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-4">
          <button onClick={() => toggleSection("settings")} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium text-base">
            <span>الاعدادات و الفوترة</span>
            <ChevronDown size={18} className={`transition-transform ${openSections.settings ? "rotate-180" : ""}`} />
          </button>

          {openSections.settings && (
            <nav className="flex flex-col gap-2 mt-2 ps-2">
              <NavLink to="/home/invoice" className={linkClass} onClick={handleLinkClick}>ادارة الفواتير</NavLink>
              <NavLink to="/home/manage_message" className={linkClass} onClick={handleLinkClick}>ادارة الرسائل النصية</NavLink>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
export default Sidebar;
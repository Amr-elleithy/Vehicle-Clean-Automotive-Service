import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div dir="rtl">
      <div className="flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onOpen={() => setIsSidebarOpen(true)} onClose={() => setIsSidebarOpen(false)}/>
          <main className="flex-1 p-4 sm:p-6 bg-gray-50 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
export default Layout;
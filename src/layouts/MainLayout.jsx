import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,_#f5f7fb,_#f8fafc)] text-[var(--color-acc2)]">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        />
        <div className="flex flex-1 pt-20">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <div
            className="w-full flex-1 px-4 pb-8 pt-4 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:pt-5 md:pr-8 md:pt-6 lg:pl-[18rem]"
          >
            <div className="mx-auto w-full max-w-[1500px]">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

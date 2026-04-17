import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,_#f5f7fb,_#f8fafc)] text-[var(--color-acc2)]">
        <Navbar />
        <div className="flex flex-1 pt-20">
          <Sidebar />
          <div
            className="w-full flex-1 px-4 pb-8 pt-6 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pr-8"
            style={{ paddingLeft: "18rem" }}
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

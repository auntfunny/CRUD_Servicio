import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";



export default function MainLayout() {
    const [abierto, setAbierto] = useState(false);
    return (
        <div>
            <div>
                <div>
                    <Navbar abierto={abierto} setAbierto={setAbierto} />
                </div>
                <div className="flex flex-1 flex-col md:flex-row" >
                    <div>
                    <Sidebar abierto={abierto} />
                </div>
                <div className="w-full">                    
                    <Outlet />
                </div>
                </div>
                
                <div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
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
                <div>
                    <Sidebar abierto={abierto} />
                </div>
                <div>
                    <Outlet />
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
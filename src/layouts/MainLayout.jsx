import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <div>
            <div>
                <Sidebar/>
            </div>

            <div>
                <div>
                    <Navbar/>
                </div>
                <div>
                    <Outlet/>
                </div>
                <div>
                    <Footer/>
                </div>
            </div>

        </div>
    );
}
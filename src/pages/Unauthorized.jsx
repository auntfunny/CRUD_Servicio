import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png"

const Unauthorized = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if(!user?.role){
            navigate("/login")
        } else if(user?.role === "ADMIN") {
            navigate("/");
        } else {
            navigate("/estudiante/dash");
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-5xl mx-auto gap-12">
            <img src={Logo} alt="Funval Logo" className="w-xs" />
            <h2 className="text-4xl text-acc2 text-center">No estás autorizado para eso. Por favor, {user?.role ? "vuelve a su Dashboard" : "ingresa con su cuenta"}</h2>
            <button type="button" onClick={handleClick} className="w-56 p-2 bg-acc1 text-white rounded-lg text-xl hover:bg-acc2 hover:cursor-pointer">Volver {user?.role ? "a Home" : "al Login"}</button>
        </div>
    );
}

export default Unauthorized;

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if(user.role === "ADMIN") {
            navigate("/");
        } else {
            navigate("/estudiante/dash");
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <h2 className="text-4xl text-acc2 text-center">No estás autorizado para eso. Por favor, vuelve a su Dashboard</h2>
            <button type="button" onClick={handleClick}>Volver a Home</button>
        </div>
    );
}

export default Unauthorized;

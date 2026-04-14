import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user?.role) {
      navigate("/login");
    } else if (user?.role === "ADMIN") {
      navigate("/");
    } else {
      navigate("/estudiante/dash");
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 mx-auto">
      <img src={Logo} alt="Funval Logo" className="w-xs" />
      <h2 className="text-4xl text-acc2 text-center">
        No estas autorizado para eso. Por favor, {user?.role ? "vuelve a su Dashboard" : "ingresa con su cuenta"}
      </h2>
      <button
        type="button"
        onClick={handleClick}
        className="w-56 rounded-lg bg-acc1 p-2 text-xl text-white hover:cursor-pointer hover:bg-acc2"
      >
        Volver {user?.role ? "a Home" : "al Login"}
      </button>
    </div>
  );
};

export default Unauthorized;

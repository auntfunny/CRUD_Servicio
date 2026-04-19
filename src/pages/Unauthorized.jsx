import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import { useCookies } from "react-cookie";
import { primaryButtonClass } from "../components/PageShell";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const role = user && cookies?.token ? user.role : null;

  const handleClick = () => {
    if (!role) {
      navigate("/login");
    } else if (role === "ADMIN") {
      navigate("/");
    } else {
      navigate("/estudiante/dash");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-5xl mx-auto gap-12">
      <img src={Logo} alt="Funval Logo" className="w-sm" />
      <h2 className="text-4xl text-acc2 text-center">
        No estás autorizado para eso. Por favor,{" "}
        {role ? "vuelve a su Dashboard" : "ingresa con su cuenta"}
      </h2>
      <button
        type="button"
        onClick={handleClick}
        className={primaryButtonClass}
      >
        Volver {role ? "a Home" : "al Login"}
      </button>
    </div>
  );
};

export default Unauthorized;

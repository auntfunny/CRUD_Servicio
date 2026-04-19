import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { primaryButtonClass } from "../components/PageShell";

const NoExiste = () => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-5xl mx-auto gap-12">
      <img src={Logo} alt="Funval Logo" className="w-sm" />
      <h2 className="text-4xl text-acc2 text-center">
        Lo sentimos, la página que estás buscando no existe
      </h2>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={primaryButtonClass}
      >
        Volver
      </button>
    </div>
  );
};

export default NoExiste;

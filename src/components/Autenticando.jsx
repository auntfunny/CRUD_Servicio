import Logo from "../assets/Logo.png";
const Autenticando = () => {
  return (
    <div className="flex flex-col  items-center w-full min-h-screen max-w-5xl mx-auto gap-12 p-20">
      <img src={Logo} alt="Funval Logo" className="w-xs" />
      <h2 className="text-4xl text-acc2 text-center">
        Autenticando Session, espere por favor.
      </h2>
    </div>
  );
};

export default Autenticando;

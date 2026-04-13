import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const estilosCampo =
  "peer w-full border-b border-slate-200 bg-transparent pb-3 pl-12 pr-3 pt-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5d80c8]";

function CampoEntrada({
  autocompletado,
  etiqueta,
  icono,
  id,
  nombre,
  tipo,
  valor,
  alCambiar,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
        {etiqueta}
      </span>
      <span className="relative block text-slate-300 transition focus-within:text-[#5d80c8]">
        <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 p-1">
          <img
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain opacity-80"
            src={icono}
          />
        </span>
        <input
          autoComplete={autocompletado}
          onChange={alCambiar}
          className={estilosCampo}
          id={id}
          name={nombre}
          placeholder={`Ingresa tu ${etiqueta.toLowerCase()}`}
          required
          type={tipo}
          value={valor}
        />
      </span>
    </label>
  );
}

function Login() {
  const { login, loading } = useAuth();
  const [credenciales, setCredenciales] = useState({
    contrasena: "",
    email: "",
  });

  const manejarCambio = ({ target }) => {
    const { name, value } = target;

    setCredenciales((credencialesActuales) => ({
      ...credencialesActuales,
      [name]: value,
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    await login(credenciales.email, credenciales.contrasena);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_rgba(7,19,39,0.32)] lg:grid-cols-[0.95fr_1.2fr]">
          <aside className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#143963] px-7 py-8 sm:px-10 sm:py-9">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />
            <div className="absolute -left-14 top-10 h-36 w-36 rounded-full bg-white/18 blur-3xl" />
            <div className="absolute right-[-18%] top-1/3 h-44 w-44 rounded-full bg-[#8eb2ff]/20 blur-3xl" />
            <div className="absolute bottom-0 left-[-8%] h-28 w-[70%] rounded-tr-[120px] bg-[#17335d]" />
            <div className="absolute bottom-0 right-[-10%] h-36 w-[75%] rounded-tl-[160px] bg-[#102b4d]" />
            <div className="absolute bottom-16 right-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <img alt="FUNVAL" className=" rounded-full h-8 w-8" src="/icoFunval.jpg" />
              </div>
              <div>
                
                <h1 className="font-montserrat text-2xl font-bold tracking-[0.2em] text-white">
                  FUNVAL
                </h1>
              </div>
            </div>

            <div className="relative z-10 mt-12 max-w-xs text-white sm:mt-16">
              <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white/80 uppercase backdrop-blur-sm">
                Bienvenido/a. 
              </span>
              <h2 className="mt-5 font-montserrat text-3xl font-semibold leading-tight sm:text-[2.35rem]">
                Reporte de horas de servicio
              </h2>
              <p className="mt-4 font-avenir text-sm leading-7 text-white/80 sm:text-base">
                Usa esta pagina para informar y llevar un control de tus horas de servicio en Funval.
              </p>
            </div>

            <div className="relative z-10 mt-10 flex items-end justify-between text-white/80">
              <div> 
                <p className="mt-2 mb-2 font-avenir text-sm text-white/70">
                  Hecho por estudiantes de Funval.
                </p>
              </div>
              <div className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium backdrop-blur-sm">
                2026
              </div>
            </div>
          </aside>

          <div className="flex items-center px-6 py-8 sm:px-10 md:px-14 lg:px-16 lg:py-12">
            <div className="w-full max-w-lg">
              <span className="inline-flex rounded-full bg-[#eaf1ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#476fb5]">
                Login
              </span>
              <h2 className="mt-6 font-montserrat text-3xl font-semibold text-slate-800 sm:text-[2.4rem]">
                Inicia sesion en{" "}
                <span className="text-[#4e76bf]">FUNVAL</span>
              </h2>
              <p className="mt-4 max-w-md font-avenir text-base leading-7 text-slate-500">
                Ingresa tu correo y contraseña de funval de Funval para acceder a tu cuenta y reportar tus horas de servicio.
              </p>

              <form
                className="mt-10 space-y-7"
                onSubmit={manejarEnvio}
              >
                <CampoEntrada
                  autocompletado="email"
                  etiqueta="email"
                  alCambiar={manejarCambio}
                  icono="/icoCorreo.png"
                  id="email"
                  nombre="email"
                  tipo="email"
                  valor={credenciales.email}
                />

                <CampoEntrada
                  autocompletado="current-password"
                  etiqueta="password"
                  alCambiar={manejarCambio}
                  icono="/icoPassword.png"
                  id="password"
                  nombre="contrasena"
                  tipo="password"
                  valor={credenciales.contrasena}
                />

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    className="cursor-pointer inline-flex min-w-[180px] items-center justify-center rounded-full bg-[linear-gradient(90deg,#7796db_0%,#5d80c8_45%,#3b5f9f_100%)] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(93,128,200,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(93,128,200,0.42)] focus:outline-none focus:ring-2 focus:ring-[#7b9ae0] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
                    type="submit"
                  >
                    Ingresar
                  </button>
                </div>
              </form>

              <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-avenir">
                  Esta pagina usa cookies para mejorar tu experiencia.
                </p>
                <a
                  className=" cursor-pointer w-fit font-medium text-[#5d80c8] underline decoration-[#c5d3f2] underline-offset-4"
                  href="https://github.com/auntfunny/CRUD_Servicio.git"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;

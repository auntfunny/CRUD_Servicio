import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHero, controlClass, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import useAxios from "../hooks/useAxios";

function CampoPassword(props) {
  return (
    <input
      {...props}
      className={controlClass}
    />
  );
}

export default function CambiarPassword() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const { loading, request } = useAxios("/profile/password", {
    method: "PATCH",
  });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }

    try {
      await request({
        body: {
          current_password: form.current_password,
          new_password: form.new_password,
        },
      });

      setMensaje({ tipo: "ok", texto: "Contraseña actualizada correctamente." });
      setTimeout(() => {
        navigate("/perfil");
      }, 1200);
    } catch (error) {
      if (error.response?.status === 401) {
        setMensaje({ tipo: "error", texto: "La contraseña actual es incorrecta." });
      } else {
        setMensaje({ tipo: "error", texto: "No se pudo actualizar la contraseña." });
      }
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Seguridad"
          title="Cambiar contraseña"
          description="Actualiza tu clave de acceso manteniendo el mismo lenguaje visual del resto del sistema."
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/perfil")} type="button">
                Volver
              </button>
              <button className={primaryButtonClass} disabled={loading} form="password-form" type="submit">
                {loading ? "Procesando..." : "Actualizar contraseña"}
              </button>
            </>
          )}
          meta={(
            <div className="relative">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                onClick={() => setMostrarAyuda((valor) => !valor)}
                type="button"
              >
                ?
              </button>
              {mostrarAyuda ? (
                <div className="absolute right-0 top-14 z-10 w-72 rounded-[1rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-[0_18px_35px_rgba(15,23,42,0.12)]">
                  Usa una contraseña segura, verifica que ambos campos coincidan y procura usar al menos 8 caracteres.
                </div>
              ) : null}
            </div>
          )}
        />

        <form className={`${panelBaseClass} !bg-white mx-auto max-w-2xl`} id="password-form" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <CampoPassword
              name="current_password"
              onChange={handleChange}
              placeholder="Contraseña actual"
              required
              type="password"
              value={form.current_password}
            />
            <CampoPassword
              name="new_password"
              onChange={handleChange}
              placeholder="Nueva contraseña"
              required
              type="password"
              value={form.new_password}
            />
            <CampoPassword
              name="confirm_password"
              onChange={handleChange}
              placeholder="Confirmar nueva contraseña"
              required
              type="password"
              value={form.confirm_password}
            />
          </div>

          {mensaje ? (
            <div
              className={`mt-5 rounded-[1rem] px-4 py-3 text-sm font-medium ${
                mensaje.tipo === "ok"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {mensaje.texto}
            </div>
          ) : null}
        </form>
      </div>
    </PageShell>
  );
}

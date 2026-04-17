import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";

function CampoPassword(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[1.1rem] bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-[var(--color-acc1)]/20"
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }

    try {
      await request({
        body: {
          current_password: form.current_password,
          new_password: form.new_password,
        },
      });

      setMensaje({ tipo: "ok", texto: "Contraseña actualizada correctamente" });

      setTimeout(() => {
        navigate("/perfil");
      }, 1200);
    } catch (error) {
      if (error.response?.status === 401) {
        setMensaje({ tipo: "error", texto: "Contraseña actual incorrecta" });
      } else {
        setMensaje({ tipo: "error", texto: "Error inesperado" });
      }
    }
  }

  return (
    <PageShell>
      <section className="rounded-[2rem] bg-white/60 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-4">
        <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
          <div className="h-28 bg-[linear-gradient(90deg,_rgba(160,198,243,0.95),_rgba(230,236,247,0.92)_55%,_rgba(251,241,204,0.92))] md:h-32" />

          <div className="px-5 pb-8 pt-6 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[15px] font-semibold uppercase tracking-[0.16em] text-[var(--color-acc1)]">
                  Seguridad
                </p>
                <h1 className="mt-3 font-montserrat text-3xl font-bold text-slate-800 md:text-4xl">
                  Cambiar contraseña
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Actualiza tu contraseña y mantén protegida tu cuenta.
                </p>
              </div>

              <div>
                <button
                  onClick={() => navigate("/perfil")}
                  className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  type="button"
                >
                  Volver
                </button>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="mb-4 flex justify-end">
                  <div className="relative">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                      onClick={() => setMostrarAyuda((valor) => !valor)}
                      type="button"
                    >
                      ?
                    </button>

                    {mostrarAyuda ? (
                      <div className="absolute right-0 top-12 z-10 w-72 rounded-[1rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-[0_18px_35px_rgba(15,23,42,0.12)]">
                        Usa una contraseña segura, verifica que ambos campos coincidan y procura usar al menos 8 caracteres.
                      </div>
                    ) : null}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-slate-50/70 p-6">
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

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-[var(--color-acc1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(42,125,225,0.24)] transition hover:brightness-95 disabled:opacity-60"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? "Procesando..." : "Actualizar contraseña"}
                    </button>
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
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

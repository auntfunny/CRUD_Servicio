import { useCookies } from "react-cookie";

export default function CookieConsentBanner() {
  const [cookies, setCookie] = useCookies(["cookie_consent"]);
  const consentAccepted = cookies.cookie_consent === "accepted";

  if (consentAccepted) return null;

  return (
    <aside className="fixed inset-x-0 bottom-4 z-[95] flex justify-center px-4">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-[1.4rem] border border-slate-200 bg-white/96 px-5 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Usamos cookies para mantener tu sesion activa.
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Aceptalas para continuar usando la plataforma con normalidad.
          </p>
        </div>

        <button
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2f80ed,#195ec9)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95"
          onClick={() =>
            setCookie("cookie_consent", "accepted", {
              maxAge: 31536000,
              path: "/",
            })
          }
          type="button"
        >
          Aceptar cookies
        </button>
      </div>
    </aside>
  );
}

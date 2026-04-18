function ToastCaja({ onClose, toast, visible }) {
  return (
    <aside
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex justify-center px-4 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-[1.4rem] border border-[rgba(47,128,237,0.14)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(242,248,255,0.98))] px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,_#2f80ed,_#195ec9)] text-white shadow-[0_10px_22px_rgba(42,109,221,0.28)]">
          <span className="material-symbols-rounded text-[20px] leading-none">notifications</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              {toast?.title ?? "Notificacion"}
            </p>
            {toast?.context ? (
              <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-400">
                {toast.context}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
            {toast?.message}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full bg-[linear-gradient(90deg,_#66a3ff,_#2f80ed)] ${visible ? "animate-[toast-progress_3.2s_linear_forwards]" : "w-0"}`} />
          </div>
        </div>

        <button
          aria-label="Cerrar notificacion"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-rounded text-[18px] leading-none">close</span>
        </button>
      </div>
    </aside>
  );
}

export default ToastCaja;

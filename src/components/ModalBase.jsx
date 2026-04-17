function ModalBase({ children, onClose, title, widthClass = "max-w-4xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-4 backdrop-blur-[2px]">
      <div className={`w-full ${widthClass} overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(247,250,255,0.98))] shadow-[0_32px_80px_rgba(15,23,42,0.18)]`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              FUNVAL
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalBase;

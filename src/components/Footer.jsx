export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-[linear-gradient(180deg,_rgba(245,247,251,0.92),_rgba(248,250,252,0.98))] px-6 py-5 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
            Funval
          </p>
          <p className="mt-1 font-medium text-slate-700">
            Horas de servicio
          </p>
        </div>

        <div className="flex flex-col gap-1 text-left md:items-end md:text-right">
          <p>Proyecto academico desarrollado por estudiantes.</p>
          <p className="text-slate-400">© {new Date().getFullYear()} FUNVAL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

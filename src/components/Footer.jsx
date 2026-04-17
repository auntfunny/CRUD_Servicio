export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/90 px-4 py-4 text-center text-sm shadow-[0_-10px_30px_rgba(0,55,100,0.05)] backdrop-blur-sm">
      <p className="font-montserrat font-semibold text-[var(--color-acc2)]">FUNVAL - Curso Frontend 2026 </p>

      <p className="mt-1 text-slate-500"> Grupo 1 | Proyecto acadÃ©mico desarrollado por estudiantes</p>

      <p className="mt-1 text-slate-400"> Â© {new Date().getFullYear()} Todos los derechos reservados </p>
    </footer>
  );
}

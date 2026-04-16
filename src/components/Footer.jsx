

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm p-4 mt-0 border-t">
      <p className="font-semibold">FUNVAL - Curso Frontend 2026 </p>

      <p className="text-gray-600"> Grupo 1 | Proyecto académico desarrollado por estudiantes</p>

      <p className="text-gray-500 mt-1"> © {new Date().getFullYear()} Todos los derechos reservados </p>
    </footer>
  ); 
 
}
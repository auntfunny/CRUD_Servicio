import { Outlet, Route, Routes } from "react-router-dom";
import DashboardAdmin from "./pages/DashboardAdmin";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import DashboardEstudiante from "./pages/DashboardEstudiante";
import ProtectedAdmin from "./routes/ProtectedAdmin";
import ProtectedStudent from "./routes/ProtectedStudent";
import ProtectedAnyUser from "./routes/ProtectedAnyUser";
import ProtectedLogin from "./routes/ProtectedLogin";
import Unauthorized from "./pages/Unauthorized";
import MainLayout from "./layouts/MainLayout";
import CambiarPassword from "./pages/CambiarPassword";
import UsuariosCards from "./pages/UsuariosCards";
import EditarPerfil from "./pages/EditarPerfil";
import CrearUsuario from "./pages/CrearUsuario";
import ImportUsers from "./pages/ImportUsers";
import ReportesAdmin from "./pages/ReportesAdmin";
import ReportesEstudiante from "./pages/ReportesEstudiante";
import EstudiantesDeuda from "./pages/EstudiantesDeuda";
import Categorias from "./pages/Categorias";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route element={<ProtectedAdmin />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardAdmin />} />
            <Route path="/usuarios" element={<UsuariosCards />} />
            <Route path="/usuarios/crear" element={<CrearUsuario />} />
            <Route path="/usuarios/import" element={<ImportUsers />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/paises" element={<h2>Admin Paises</h2>} />
            <Route path="/cursos" element={<h2>Admin Cursos</h2>} />
            <Route path="/reportes" element={<ReportesAdmin />} />
            <Route path="/estudiantes-pendientes" element={<EstudiantesDeuda />} />
          </Route>
        </Route>
        <Route path="/estudiante" element={<ProtectedStudent />}>
          <Route element={<MainLayout />}>
            <Route path="dash" element={<DashboardEstudiante />} />
            <Route path="reportes" element={<ReportesEstudiante />} />
          </Route>
        </Route>
        <Route element={<ProtectedAnyUser />}>
          <Route element={<MainLayout />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/editar" element={<EditarPerfil />} />
            <Route path="/cambiarpassword" element={<CambiarPassword />} />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h2>Error 404</h2>} />
      </Routes>
    </>
  );
}

export default App;

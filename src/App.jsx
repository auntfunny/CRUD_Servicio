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
import CambiarPassword from "./components/CambiarPassword";
import Usuarios from "./pages/Usuarios";
import EditarUsuario from "./pages/EditarUsuario";
import CrearUsuario from "./pages/CrearUsuario";
import ImportUsers from "./pages/ImportUsers";
import UsuariosCards from "./pages/UsuariosCards";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route element={<ProtectedAdmin />}>
          <Route element={<Outlet />}>
            <Route path="/" element={<DashboardAdmin />} />
            <Route path="/usuarios" element={<UsuariosCards />} />
            <Route path="/usuarios/:id/editar" element={<EditarUsuario />} />
            <Route path="/usuarios/crear" element={<CrearUsuario />} />
            <Route path="/users/import" element={<ImportUsers />} />
            <Route path="/categorias" element={<h2>Admin Categorias</h2>} />
            <Route path="/paises" element={<h2>Admin Paises</h2>} />
            <Route path="/reportes" element={<h2>Admin Reportes</h2>} />
          </Route>
        </Route>
        <Route path="/estudiante" element={<ProtectedStudent />}>
          <Route element={<Outlet />}>
            <Route path="dash" element={<DashboardEstudiante />} />
            <Route path="reportes" element={<h2>Student Reportes</h2>} />
          </Route>
        </Route>
        <Route element={<ProtectedAnyUser />}>
          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/cambiarpassword" element={<CambiarPassword/>}/>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h2>Error 404</h2>} />
      </Routes>
    </>
  );
}

export default App;

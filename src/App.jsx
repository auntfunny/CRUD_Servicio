import { Outlet, Route, Routes } from "react-router-dom";
import DashboardAdmin from "./pages/DashboardAdmin";
import Login from "./pages/Login";
import DashboardEstudiante from "./pages/DashboardEstudiante";
import ProtectedAdmin from "./routes/ProtectedAdmin";
import ProtectedStudent from "./routes/ProtectedStudent";
import ProtectedAnyUser from "./routes/ProtectedAnyUser";
import ProtectedLogin from "./routes/ProtectedLogin";
import Unauthorized from "./pages/Unauthorized";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route element={<ProtectedAdmin />}>
          <Route element={<MainLayout/>}>
            <Route path="/" element={<DashboardAdmin />} />
            <Route path="/usuarios" element={<h2>Admin Usuarios</h2>} />
            <Route path="/categorias" element={<h2>Admin Categorias</h2>} />
            <Route path="/paises" element={<h2>Admin Paises</h2>} />
            <Route path="/reportes" element={<h2>Admin Reportes</h2>} />
          </Route>
        </Route>
        <Route path="/estudiante" element={<ProtectedStudent />}>
          <Route element={<MainLayout/>}>
            <Route path="dash" element={<DashboardEstudiante />} />
            <Route path="reportes" element={<h2>Student Reportes</h2>} />
          </Route>
        </Route>
        <Route element={<ProtectedAnyUser />}>
          <Route path="/perfil" element={<h2>Perfil</h2>} />
          <Route path="/cambiarcontraseña" element={<h2>Cambiar Contreseña</h2>}/>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h2>Error 404</h2>} />
      </Routes>
    </>
  );
}

export default App;

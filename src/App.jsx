import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardEstudiante from "./pages/DashboardEstudiante";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Outlet />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/categorias" element={<h2>Admin Categorias</h2>}/>
          <Route path="/paises" element={<h2>Admin Paises</h2>}/>
          <Route path="/reportes" element={<h2>Admin Reportes</h2>}/>
        </Route>
        <Route path="/estudiante"  element={<Outlet />}>
          <Route path="dash" element={<DashboardEstudiante />} />
          <Route path="reportes" element={<h2>Student Reportes</h2>}/>
        </Route>
        <Route element={<Outlet />}>
          <Route path="/perfil" element={<h2>Perfil</h2>} />
          <Route path="/cambiarcontraseña" element={<h2>Cambiar Contreseña</h2>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

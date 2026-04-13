import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Outlet />}>
          <Route path="/" element={<h2>Admin Dashboard</h2>}/>
          <Route path="/usuarios" element={<h2>Admin Usuarios</h2>}/>
          <Route path="/categorias" element={<h2>Admin Categorias</h2>}/>
          <Route path="/paises" element={<h2>Admin Paises</h2>}/>
          <Route path="/reportes" element={<h2>Admin Reportes</h2>}/>
        </Route>
        <Route path="/estudiante"  element={<Outlet />}>
          <Route path="dash" element={<h2>Student Dashboard</h2>}/>
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

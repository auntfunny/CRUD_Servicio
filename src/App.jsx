import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<h2>Admin Dashboard</h2>} />
          <Route path="/usuarios" element={<h2>Admin Usuarios</h2>} />
          <Route path="/categorias" element={<h2>Admin Categorias</h2>} />
          <Route path="/paises" element={<h2>Admin Paises</h2>} />
          <Route path="/reportes" element={<h2>Admin Reportes</h2>} />
        </Route>
      </Route>

      {/* ESTUDIANTE */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route element={<Layout />}>
          <Route path="/estudiante/dash" element={<h2>Student Dashboard</h2>} />
          <Route path="/estudiante/reportes" element={<h2>Student Reportes</h2>} />
        </Route>
      </Route>

      {/* GENERAL */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/perfil" element={<h2>Perfil</h2>} />
          <Route path="/cambiarcontraseña" element={<h2>Cambiar Contraseña</h2>} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;

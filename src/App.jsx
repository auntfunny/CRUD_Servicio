import { Route, Routes } from "react-router-dom";
import ProtectedAdmin from "./routes/ProtectedAdmin";
import ProtectedStudent from "./routes/ProtectedStudent";
import ProtectedAnyUser from "./routes/ProtectedAnyUser";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedAdmin />}>
          <Route path="/" element={<h2>Admin Dashboard</h2>}/>
          <Route path="/usuarios" element={<h2>Admin Usuarios</h2>}/>
          <Route path="/categorias" element={<h2>Admin Categorias</h2>}/>
          <Route path="/paises" element={<h2>Admin Paises</h2>}/>
          <Route path="/reportes" element={<h2>Admin Reportes</h2>}/>
        </Route>
        <Route path="/estudiante"  element={<ProtectedStudent />}>
          <Route path="dash" element={<h2>Student Dashboard</h2>}/>
          <Route path="reportes" element={<h2>Student Reportes</h2>}/>
        </Route>
        <Route element={<ProtectedAnyUser />}>
          <Route path="/perfil" element={<h2>Perfil</h2>} />
          <Route path="/cambiarcontraseña" element={<h2>Cambiar Contreseña</h2>} />
        </Route>
        <Route path="/unauthorized" element={<h2>No estás autorizado</h2>} />
        <Route path="*" element={<h2>Error 404</h2>} />
      </Routes>
    </>
  );
}

export default App;

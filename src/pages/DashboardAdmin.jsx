import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";


function DashboardAdmin() {
  const { data, loading, error } = useAxios("/dashboard/stats");


  if (loading) return <p>Cargando dashboard...</p>;
  if (error) return <p>Error cargando datos</p>; 

  return (
    

    <main className="grid grid-cols-1 md:grid-cols-2 lg:px-12 lg:gap-x-6">
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Usuarios</h2>
          <p>Total usuarios: {data?.users?.total_students + data?.users?.total_admins}</p>
          <p>Estudiantes: {data?.users?.total_students}</p>
          <p>Administradores: {data?.users?.total_admins}</p>
        </div>
      </section>
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 md:text-[15px] gap-2 mt-0.5">
            <p>Total reportes: {data?.reports?.total}</p>
            <p>Pendientes: {data?.reports?.pending}</p>
            <p>Aprobados: {data?.reports?.approved}</p>
            <p>Rechazados: {data?.reports?.rejected}</p>
            <p>Horas presentadas: {data?.reports?.total_hours_submitted}</p>
            <p>Horas aprobadas: {data?.reports?.total_hours_approved}</p>
          </div>

        </div>
      </section>
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl lg:px-6">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Categorías</h2>
          <div className="grid grid-cols-1 text-xs justify-center gap-1 md:gap-3 md:mt-1">
            {data?.top_categories?.map((item) => (
              <div className="flex flex-col bg-gray-600 rounded-xl p-3" key={item.id}>
                <p className="text-blue-400 font-montserrat font-bold">{item.name}</p>
                <p>Total reportes: {item.total_reports}</p>
                <p>Horas aprobadas: {item.total_hours_approved}</p>
              </div>
            )
            )}
          </div>
        </div>
      </section>

      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl lg:px-6">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Cursos</h2>
          <div className="grid grid-cols-1 text-xs justify-center gap-1 md:grid-cols-2 md:gap-4.5">
            {data?.top_courses?.map((item) => (
              <div className="bg-gray-600 rounded-xl p-4" key={item.id}>
                <p className="text-blue-400 font-montserrat font-bold">{item.name}</p>
                <p>Total estudiantes: {item.total_students}</p>
              </div>
            )
            )}
          </div>
        </div>
      </section>

    </main>

  )

}
export default DashboardAdmin
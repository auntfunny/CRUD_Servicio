const respuesta = {
  "users": {
    "total_students": 7,
    "total_admins": 4
  },
  "reports": {
    "total": 3,
    "pending": 1,
    "approved": 2,
    "rejected": 0,
    "total_hours_submitted": 17,
    "total_hours_approved": 12
  },
  "top_categories": [
    {
      "id": 1,
      "name": "Tutorias",
      "total_reports": 1,
      "total_hours_approved": 2
    },
    {
      "id": 2,
      "name": "Visita al templo",
      "total_reports": 1,
      "total_hours_approved": 0
    },
    {
      "id": 3,
      "name": "Indexacion",
      "total_reports": 1,
      "total_hours_approved": 10
    }
  ],
  "top_courses": [
    {
      "id": 32,
      "name": "Desarrollo Web",
      "total_students": 1
    },
    {
      "id": 37,
      "name": "Atención al Cliente",
      "total_students": 1
    },
    {
      "id": 31,
      "name": "Inglés",
      "total_students": 0
    },
    {
      "id": 33,
      "name": "Auxiliar de Farmacias",
      "total_students": 0
    },
    {
      "id": 41,
      "name": "dota 2",
      "total_students": 0
    }
  ]
}
function DashboardAdmin() {
  return (

    <main className="grid grid-cols-1 md:grid-cols-2 lg:px-12 lg:gap-x-6">
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Usuarios</h2>
          <p>Total usuarios: {respuesta.users?.total_students + respuesta.users?.total_admins}</p>
          <p>Estudiantes: {respuesta.users?.total_students}</p>
          <p>Administradores: {respuesta.users?.total_admins}</p>
        </div>
      </section>
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 md:text-[15px] gap-2 mt-0.5">
            <p>Total reportes: {respuesta.reports?.total}</p>
            <p>Pendientes: {respuesta.reports?.pending}</p>
            <p>Aprobados: {respuesta.reports?.approved}</p>
            <p>Rechazados: {respuesta.reports?.rejected}</p>
            <p>Horas presentadas: {respuesta.reports?.total_hours_submitted}</p>
            <p>Horas aprobadas: {respuesta.reports?.total_hours_approved}</p>
          </div>

        </div>
      </section>
      <section className="p-4">
        <div className="flex flex-col bg-blue-900 text-white font-montserrat gap-2 p-2 rounded-2xl lg:px-6">
          <h2 className="font-avenir text-2xl text-blue-400 font-bold">Categorías</h2>
          <div className="grid grid-cols-1 text-xs justify-center gap-1 md:gap-3 md:mt-1">
            {respuesta.top_categories.map((item) => (
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
            {respuesta.top_courses.map((item) => (
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
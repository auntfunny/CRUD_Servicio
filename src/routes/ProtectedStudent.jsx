
const ProtectedStudent = () => {
    const user = "";
    if(user.role !== "STUDENT") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedStudent;

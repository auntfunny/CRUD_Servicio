const ProtectedLogin = ({children}) => {
    const user = ""
    if(user) {
        if(user.role === "ADMIN"){
            return <Navigate to="/" />
        } else {
            return <Navigate to="/estudiante/dash" />
        }
    } else {
        return children;
    }
}

export default ProtectedLogin;

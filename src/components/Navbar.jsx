import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <div className="flex justify-around bg-blue-100">
      <span className="text-red-500">
        {role} - {user?.first_name}
      </span>

      <button className="border-2 bg-gray-200 " onClick={logout}>
        Logout
      </button>
    </div>
  );
}
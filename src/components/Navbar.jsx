import { useAuth } from "../context/AuthContext";

export default function Navbar({ abierto, setAbierto }) {
  const { user, logout } = useAuth();
  
  console.log(user);
  if (!user) return null;

  return (
    <div className="flex justify-around bg-blue-100">
      <button
        onClick={() => setAbierto(!abierto)} className="p-2 md:hidden" >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </div>
      </button>


      <span className="text-red-500">
        {user && user.first_name}
      </span>

      <button className="border-2 bg-gray-200 " onClick={logout}>
        Logout
      </button>
    </div>
  );
}
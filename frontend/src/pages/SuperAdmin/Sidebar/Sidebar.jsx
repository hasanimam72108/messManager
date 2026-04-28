import {
  Building2,
  ChefHat,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  logoutSuccess,
  useLogoutMutation,
} from "../../../features/auth/authSlice";

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/super-admin/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Mess Group",
      path: "/super-admin/mess-group",
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      name: "Manager",
      path: "/super-admin/manager",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      name: "System Report",
      path: "/super-admin/system-report",
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(logoutSuccess());
      if (onClose) onClose();
      window.location.replace("/home");
    }
  };

  const handleGoHome = () => {
    if (onClose) onClose();
    window.location.replace("/home");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-full max-h-screen overflow-y-auto flex flex-col justify-between shadow-xl lg:shadow-none">
      <div>
        <div className="p-8 pb-6 flex items-center gap-3 border-b border-gray-50">
          <div className="bg-green-600 p-2 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mess<span className="text-green-600">Manager</span>
          </h1>
        </div>
        <nav className="p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium border border-transparent ${
                    isActive
                      ? "bg-green-50 border-green-100 text-green-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <NavLink
          to="/home"
          onClick={handleGoHome}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5"
        >
          <Home className="w-5 h-5 text-green-600" />
          Back to Home
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

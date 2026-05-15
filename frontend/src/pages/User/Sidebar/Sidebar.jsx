import {
  ChefHat,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Utensils,
  Wallet,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import {
  logoutSuccess,
  useLogoutMutation,
} from "../../../features/auth/authSlice";

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

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

  const menuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Meal Entry",
      path: "/user/meal-entry",
      icon: Utensils,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      name: "My Bill",
      path: "/user/my-bill",
      icon: FileText,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      name: "Balance",
      path: "/user/balance",
      icon: Wallet,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-100",
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 border-r border-emerald-100/70 h-full max-h-screen overflow-y-auto flex flex-col justify-between shadow-xl lg:shadow-none">
      <div>
        <Link to="/home" onClick={onClose && onClose}>
          <div className="p-8 pb-6 flex items-center gap-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <div className="bg-emerald-500 p-2 rounded-xl flex items-center justify-center shadow-sm">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Mess<span className="text-green-600">Manager</span>
            </h2>
          </div>
        </Link>

        <nav className="p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium border ${
                    isActive
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm"
                      : "border-transparent text-gray-600 hover:bg-emerald-50/60"
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium border border-emerald-100 bg-white/90 text-gray-700 hover:bg-emerald-50 hover:shadow-sm hover:-translate-y-0.5"
        >
          <Home className="w-5 h-5 text-emerald-600" />
          Back to Home
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium border border-rose-100 bg-white/90 text-gray-700 hover:bg-rose-50 hover:shadow-sm hover:-translate-y-0.5"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import {
  ChefHat,
  Home,
  LayoutDashboard,
  LogOut,
  PieChart,
  Receipt,
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
      path: "/manager/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Members",
      path: "/manager/members",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      name: "Add Expense",
      path: "/manager/add-expense",
      icon: Receipt,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      name: "Monthly Report",
      path: "/manager/monthly-report",
      icon: PieChart,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-100",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-full max-h-screen overflow-y-auto shadow-xl lg:shadow-none">
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

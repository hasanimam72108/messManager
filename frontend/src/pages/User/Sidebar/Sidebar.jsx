import {
  ChefHat,
  FileText,
  LayoutDashboard,
  LogOut,
  Utensils,
  Wallet,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../../features/auth/authSlice";

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Redux state & localStorage
    dispatch(logoutSuccess());
    if (onClose) onClose();
    // Redirect to login page
    navigate("/login");
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
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      name: "My Bill",
      path: "/user/my-bill",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      name: "Balance",
      path: "/user/balance",
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-full max-h-screen overflow-y-auto flex flex-col justify-between shadow-xl lg:shadow-none">
      <div>
        <div className="p-8 pb-6 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Mess<span className="text-green-600">Manager</span>
          </h2>
        </div>
        <nav className="px-4 space-y-2">
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
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl w-full transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

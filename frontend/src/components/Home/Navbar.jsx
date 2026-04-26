import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-8 bg-white/80 backdrop-blur-lg shadow-sm font-sans border-b border-gray-100 transition-all">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-extrabold text-gray-800 tracking-tight">
          Mess
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Manager
          </span>
        </div>
      </Link>
      <div className="flex items-center space-x-8">
        <a
          href="#features"
          className="text-gray-600 hover:text-green-600 font-semibold transition-colors"
        >
          Features
        </a>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-700 hover:text-green-600 font-semibold px-4 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Create Mess
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

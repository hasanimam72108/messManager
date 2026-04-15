import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-8 bg-white/80 backdrop-blur-md shadow-sm font-sans border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-green-600 p-2 text-white rounded-xl shadow-md flex items-center justify-center">
          <ChefHat className="w-6 h-6" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-gray-800">
          Mess<span className="text-green-600">Manager</span>
        </div>
      </Link>
      <div className="flex items-center space-x-6">
        <a
          href="#features"
          className="text-gray-600 hover:text-green-600 font-medium transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-gray-600 hover:text-green-600 font-medium transition-colors hidden md:block"
        >
          How It Works
        </a>
        <Link
          to="/login"
          className="text-gray-600 hover:text-green-600 font-medium transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md shadow-green-600/20 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

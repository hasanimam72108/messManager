import { ChefHat } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-sm font-sans">
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-2 rounded-xl flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-800">
          Mess<span className="text-green-600">Manager</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <a
          href="#features"
          className="text-gray-600 hover:text-green-600 font-medium"
        >
          Features
        </a>
        <a
          href="/login"
          className="text-gray-600 hover:text-green-600 font-medium"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
        >
          Register
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

import { ChefHat } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/auth/authSlice";
import { getRoleHomePath, loginMock } from "../../mock/mockBackend";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const result = loginMock(formData);
      dispatch(loginSuccess(result));
      toast.success("Login successful.");
      navigate(getRoleHomePath(result.user.role), { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed.");
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-green-600 p-2.5 rounded-2xl flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">
          Mess<span className="text-green-600">Manager</span>
        </h1>
      </div>

      <p className="text-gray-500 mt-2 mb-6">
        Welcome back! Please login to your account.
      </p>
      <div className="max-w-105 mx-auto mb-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg px-4 py-3 text-sm text-left space-y-2">
        <p className="font-semibold">Demo Accounts (Frontend Only)</p>
        <div>
          <p className="font-medium">Super Admin</p>
          <p>Email: superadmin@mess.com</p>
          <p>Password: admin123</p>
        </div>
        <div>
          <p className="font-medium">Manager</p>
          <p>Email: manager@mess.com</p>
          <p>Password: manager123</p>
        </div>
        <div>
          <p className="font-medium">User</p>
          <p>Email: user@mess.com</p>
          <p>Password: user123</p>
        </div>
      </div>
      <div className="flex items-center justify-center mx-auto">
        <div className="bg-white shadow-xl border border-gray-200 w-105 p-8 rounded-xl text-left ">
          <h2 className="text-xl font-semibold">Login</h2>

          <p className="text-gray-500 text-sm mb-4">
            Enter your credentials to access your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg mt-2"
            >
              Login
            </button>

            <p className="text-center text-sm mt-3">
              Don't have an account?
              <Link
                to="/register"
                className="text-green-600 font-medium hover:underline"
              >
                Create Mess
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

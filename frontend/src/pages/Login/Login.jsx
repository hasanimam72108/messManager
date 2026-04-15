import { ChefHat } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginSuccess, useLoginMutation } from "../../features/auth/authSlice";

const Login = () => {
  // const [login, { isLoading }] = useLoginMutation();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const onSubmit = async (data) => {
  //   const toastId = toast.loading("Logging in...");
  //   try {
  //     const response = await login(data).unwrap();

  //     if (response.data?.token && response.data?.user) {
  //       toast.success("Login successful!", { id: toastId });
  //       dispatch(
  //         loginSuccess({
  //           user: response.data?.user,
  //           token: response.data?.token,
  //         })
  //       );
  //       navigate("/dashboard");
  //     } else {
  //       toast.error("Invalid response from server.", { id: toastId });
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err?.data?.message || "Login failed. Please try again.";
  //     toast.error(errorMessage, { id: toastId });
  //   }
  // };

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
      <div className="flex items-center justify-center mx-auto">
        <div className="bg-white shadow-xl border border-gray-200 w-[420px] p-8 rounded-xl text-left ">
          <h2 className="text-xl font-semibold">Login</h2>

          <p className="text-gray-500 text-sm mb-4">
            Enter your credentials to access your account
          </p>

          <form className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block mb-2">Role</label>

              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="role" checked />
                  Member
                </label>

                <label className="flex items-center gap-1">
                  <input type="radio" name="role" />
                  Manager
                </label>
              </div>
            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg mt-2">
              Login
            </button>

            <p className="text-center text-sm mt-3">
              Don't have an account?
              <a
                href="register"
                className="text-green-600 font-medium hover:underline"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

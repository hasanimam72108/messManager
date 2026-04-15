import { ChefHat } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "../../features/auth/authSlice";

const Register = () => {
  // const [registerUser, { isLoading }] = useRegisterMutation();
  // const navigate = useNavigate();

  // const onSubmit = async (data) => {
  //   const toastId = toast.loading("Creating account...");

  //   try {
  //     const response = await registerUser(data).unwrap();

  //     if (response.data?.token && response.data?.user) {
  //       toast.success("Registration successful!", { id: toastId });
  //       navigate("/login");
  //     } else {
  //       toast.error("Invalid response from server.", { id: toastId });
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err?.data?.message === "Validation failed"
  //         ? "User email/phone already exists!"
  //         : "Registration failed. Please try again.";
  //     toast.error(errorMessage, { id: toastId });
  //   }
  // };

  return (
    <div className="text-center w-full">
      {/* <!-- Title --> */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-green-600 p-2.5 rounded-2xl flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">
          Mess<span className="text-green-600">Manager</span>
        </h1>
      </div>
      <p className="text-gray-500 mt-2 mb-8">
        Create your account to get started
      </p>

      {/* <!-- Card --> */}
      <div className="bg-white shadow-xl border border-gray-200 w-[420px] mx-auto p-8 rounded-xl text-left">
        <h2 className="text-xl font-semibold">Register</h2>
        <p className="text-gray-500 text-sm mb-4">
          Fill in your details to create an account
        </p>

        <form className="space-y-4">
          {/* <!-- Full Name --> */}
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* <!-- Email --> */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* <!-- Password --> */}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* <!-- Confirm Password --> */}
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* <!-- Role --> */}
          <div>
            <label className="block mb-2">Role</label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  defaultChecked
                  className="accent-green-600"
                />
                Member
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="role" className="accent-green-600" />
                Manager
              </label>
            </div>
          </div>

          {/* <!-- Button --> */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-2">
            Register
          </button>

          {/* <!-- Login Link --> */}
          <p className="text-center text-sm mt-3">
            Already have an account?
            <a
              href="login"
              className="text-green-600 font-medium hover:underline"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

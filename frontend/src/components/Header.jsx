// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logoutSuccess, useLogoutMutation } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const [logoutApi, { isLoading }] = useLogoutMutation();

  // const handleLogout = async () => {
  //   const toastId = toast.loading("Logging out...");
  //   try {
  //     await logoutApi().unwrap();
  //     dispatch(logoutSuccess());
  //     navigate("/login");
  //     toast.success("Logged out successfully.", { id: toastId });
  //   } catch (err) {
  //     const errorMessage =
  //       err?.data?.message || "Logout failed. Please try again.";
  //     toast.error(errorMessage, { id: toastId });
  //   }
  // };

  return (
    <header className="bg-white">
      <p>{user?.name}</p>
    </header>
  );
};

export default Header;

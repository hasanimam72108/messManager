import { Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutSuccess,
  updateAuthenticatedUser,
} from "../../../features/auth/authSlice";
import {
  useDeleteManagerMessMutation,
  useGetManagerMessQuery,
  useUpdateManagerMessMutation,
} from "../../../features/management/managementSlice";

const MessSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: messResponse, isLoading } = useGetManagerMessQuery();
  const [updateManagerMess, { isLoading: isUpdating }] =
    useUpdateManagerMessMutation();
  const [deleteManagerMess, { isLoading: isDeleting }] =
    useDeleteManagerMessMutation();

  const currentMessName = messResponse?.data?.name || "";
  const [messName, setMessName] = useState("");

  const handleSave = async (event) => {
    event.preventDefault();
    const trimmedName = messName.trim() || currentMessName;

    if (!trimmedName) {
      toast.error("Mess name is required.");
      return;
    }

    try {
      const response = await updateManagerMess({ name: trimmedName }).unwrap();
      dispatch(
        updateAuthenticatedUser({
          messName: response?.mess?.name || trimmedName,
        }),
      );
      setMessName("");
      toast.success(response?.message || "Mess name updated.");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.errors?.name?.[0] ||
          "Failed to update mess name.",
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your mess? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const response = await deleteManagerMess().unwrap();
      toast.success(response?.message || "Mess deleted successfully.");
      dispatch(logoutSuccess());
      navigate("/home");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete mess.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mess Settings</h1>
        <p className="text-gray-500 mt-1">
          Update your mess name or delete your mess.
        </p>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Change Mess Name
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mess Name
            </label>
            <input
              type="text"
              value={messName}
              onChange={(event) => setMessName(event.target.value)}
              placeholder={
                isLoading ? "Loading..." : currentMessName || "Enter mess name"
              }
              className="w-full md:w-2/3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading || isUpdating}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-6 py-2.5 transition-colors disabled:opacity-60"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Deleting your mess removes all related data. This action cannot be
          undone.
        </p>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-6 py-2.5 transition-colors disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete Mess"}
        </button>
      </section>
    </div>
  );
};

export default MessSettings;

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
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-rose-50 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-sky-100 p-3 text-sky-600 shadow-sm">
          <Settings className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mess Settings</h1>
          <p className="mt-1 text-slate-500">
            Update your mess name or delete your mess.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:w-2/3"
              disabled={isLoading || isUpdating}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isUpdating}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-rose-700">Danger Zone</h2>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Deleting your mess removes all related data. This action cannot be
          undone.
        </p>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete Mess"}
        </button>
      </section>
    </div>
  );
};

export default MessSettings;

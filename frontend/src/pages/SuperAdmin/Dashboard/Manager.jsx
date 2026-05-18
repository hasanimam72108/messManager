import { Building2, Mail, ShieldUser, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import {
  useGetManagersQuery,
  useToggleManagerStatusAsAdminMutation,
} from "../../../features/management/managementSlice";

const Manager = () => {
  const { data, isLoading } = useGetManagersQuery();
  const managers = data?.data || [];
  const [toggleManagerStatusAsAdmin, { isLoading: isTogglingManager }] =
    useToggleManagerStatusAsAdminMutation();
  const [pendingManagerAction, setPendingManagerAction] = useState(null);

  const handleToggleManager = async (managerId, managerName, isActive) => {
    setPendingManagerAction({ managerId, managerName, isActive });
  };

  const confirmToggleManager = async () => {
    if (!pendingManagerAction) return;

    try {
      const response = await toggleManagerStatusAsAdmin(
        pendingManagerAction.managerId,
      ).unwrap();
      toast.success(
        response?.message || "Manager status updated successfully.",
      );
      setPendingManagerAction(null);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.errors?.manager?.[0] ||
          "Failed to update manager status.",
      );
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-linear-to-br from-sky-50 via-white to-emerald-50 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-sky-100 p-3 text-sky-600 shadow-sm">
          <ShieldUser className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manager Details</h1>
          <p className="mt-1 text-slate-500">
            View all approved manager accounts.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sky-100 bg-sky-50/70 text-slate-600">
                <th className="py-3 px-2">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-sky-500" />
                    Name
                  </span>
                </th>
                <th className="py-3 px-2">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-500" />
                    Email
                  </span>
                </th>
                <th className="py-3 px-2">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    Mess Name
                  </span>
                </th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    Loading managers...
                  </td>
                </tr>
              ) : managers.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    No manager found.
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr key={manager.id} className="border-b border-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {manager.name}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      {manager.email}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {manager.messName || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleManager(
                            manager.id,
                            manager.name,
                            manager.isActive,
                          )
                        }
                        disabled={isTogglingManager}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-60"
                        title={
                          manager.isActive
                            ? "Deactivate manager"
                            : "Activate manager"
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {manager.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmActionModal
        open={Boolean(pendingManagerAction)}
        title={
          pendingManagerAction?.isActive
            ? "Deactivate manager"
            : "Activate manager"
        }
        message={`Do you want to ${pendingManagerAction?.isActive ? "deactivate" : "activate"} manager "${pendingManagerAction?.managerName || ""}"?`}
        confirmText={pendingManagerAction?.isActive ? "Deactivate" : "Activate"}
        onConfirm={confirmToggleManager}
        onCancel={() => setPendingManagerAction(null)}
        isLoading={isTogglingManager}
      />
    </div>
  );
};

export default Manager;

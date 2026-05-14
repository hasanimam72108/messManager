import { toast } from "react-hot-toast";
import {
  useDeleteManagerAsAdminMutation,
  useGetManagersQuery,
} from "../../../features/management/managementSlice";

const Manager = () => {
  const { data, isLoading } = useGetManagersQuery();
  const managers = data?.data || [];
  const [deleteManagerAsAdmin, { isLoading: isDeletingManager }] =
    useDeleteManagerAsAdminMutation();

  const handleDeleteManager = async (managerId, managerName) => {
    const confirmed = window.confirm(
      `Delete manager "${managerName}"? Make sure their mess is deleted first.`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteManagerAsAdmin(managerId).unwrap();
      toast.success(response?.message || "Manager deleted successfully.");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.errors?.manager?.[0] ||
          "Failed to delete manager.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Details</h1>
        <p className="text-gray-500 mt-1">
          View all approved manager accounts.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Mess Name</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={3}>
                    Loading managers...
                  </td>
                </tr>
              ) : managers.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={3}>
                    No manager found.
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      {manager.name}
                    </td>
                    <td className="py-3">{manager.email}</td>
                    <td className="py-3">{manager.messName || "N/A"}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteManager(manager.id, manager.name)
                        }
                        disabled={isDeletingManager || Boolean(manager.messId)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                        title={
                          manager.messId
                            ? "Delete the manager's mess first"
                            : "Delete manager"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manager;

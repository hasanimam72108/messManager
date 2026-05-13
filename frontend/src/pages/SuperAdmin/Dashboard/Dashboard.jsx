import { toast } from "react-hot-toast";
import {
  useDeleteManagerAsAdminMutation,
  useDeleteMessAsAdminMutation,
  useGetManagersQuery,
  useGetMessesWithDetailsQuery,
  useGetSystemReportQuery,
} from "../../../features/management/managementSlice";

const Dashboard = () => {
  const { data: reportResponse } = useGetSystemReportQuery();
  const { data: messesResponse } = useGetMessesWithDetailsQuery();
  const { data: managersResponse } = useGetManagersQuery();
  const [deleteMessAsAdmin, { isLoading: isDeletingMess }] =
    useDeleteMessAsAdminMutation();
  const [deleteManagerAsAdmin, { isLoading: isDeletingManager }] =
    useDeleteManagerAsAdminMutation();

  const report = reportResponse?.data ?? {
    totalMesses: 0,
    totalManagers: 0,
    totalUsers: 0,
    pendingRequests: 0,
  };

  const messes = messesResponse?.data ?? [];
  const managers = managersResponse?.data ?? [];

  const handleDeleteMess = async (messId, messName) => {
    const confirmed = window.confirm(
      `Delete mess "${messName}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteMessAsAdmin(messId).unwrap();
      toast.success(response?.message || "Mess deleted successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete mess.");
    }
  };

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor all messes and managers from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card title="Total Messes" value={report.totalMesses} />
        <Card title="Total Managers" value={report.totalManagers} />
        <Card title="Total Users" value={report.totalUsers} />
        <Card title="Pending Requests" value={report.pendingRequests} />
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900">Mess Overview</h2>
        <p className="text-sm text-gray-500 mb-4">
          Mess details and assigned managers.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3">Mess Name</th>
                <th className="py-3">Manager</th>
                <th className="py-3">Manager Email</th>
                <th className="py-3">Members</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {messes.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    No mess created yet.
                  </td>
                </tr>
              ) : (
                messes.map((mess) => (
                  <tr key={mess.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      {mess.name}
                    </td>
                    <td className="py-3">{mess.managerName}</td>
                    <td className="py-3">{mess.managerEmail}</td>
                    <td className="py-3">{mess.memberCount}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteMess(mess.id, mess.name)}
                        disabled={isDeletingMess}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
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
      </section>

      {/* Manager details moved to the Super Admin 'Manager' page */}
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
  </div>
);

export default Dashboard;

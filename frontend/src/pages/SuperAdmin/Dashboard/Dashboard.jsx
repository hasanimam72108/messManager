import { Building2, ShieldCheck, Trash2, UserCog, Users } from "lucide-react";
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
    <div className="space-y-8 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-sky-50 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 shadow-sm">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-slate-500">
            Monitor all messes and managers from one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Messes"
          value={report.totalMesses}
          icon={Building2}
          badgeClassName="bg-sky-100 text-sky-600"
        />
        <Card
          title="Total Managers"
          value={report.totalManagers}
          icon={UserCog}
          badgeClassName="bg-emerald-100 text-emerald-600"
        />
        <Card
          title="Total Users"
          value={report.totalUsers}
          icon={Users}
          badgeClassName="bg-violet-100 text-violet-600"
        />
        <Card
          title="Pending Requests"
          value={report.pendingRequests}
          icon={ShieldCheck}
          badgeClassName="bg-amber-100 text-amber-600"
        />
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-sky-500" />
          <h2 className="text-xl font-semibold text-slate-900">
            Mess Overview
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Mess details and assigned managers.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sky-100 bg-sky-50/70 text-slate-600">
                <th className="py-3 px-2">Mess Name</th>
                <th className="py-3 px-2">Manager</th>
                <th className="py-3 px-2">Manager Email</th>
                <th className="py-3 px-2">Members</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {messes.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={5}>
                    No mess created yet.
                  </td>
                </tr>
              ) : (
                messes.map((mess) => (
                  <tr key={mess.id} className="border-b border-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {mess.name}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      {mess.managerName}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      {mess.managerEmail}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                        {mess.memberCount} members
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteMess(mess.id, mess.name)}
                        disabled={isDeletingMess}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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

const Card = ({ title, value, icon: Icon, badgeClassName }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm backdrop-blur">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">{title}</p>
      <div className={`rounded-xl p-2 ${badgeClassName}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
  </div>
);

export default Dashboard;

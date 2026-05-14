import { CheckCircle2, PencilLine, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddMemberMutation,
  useApprovePendingDepositRequestMutation,
  useDeleteMemberMutation,
  useGetMembersQuery,
  useGetPendingDepositRequestsQuery,
  useUpdateMemberMutation,
} from "../../../features/management/managementSlice";

const Members = () => {
  const [lastTempPassword, setLastTempPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });
  const { data, isLoading } = useGetMembersQuery();
  const members = data?.data || [];
  const { data: pendingDepositResponse, isLoading: isPendingRequestsLoading } =
    useGetPendingDepositRequestsQuery();
  const pendingDepositRequests = pendingDepositResponse?.data || [];
  const [addMember, { isLoading: isSubmitting }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();
  const [approveRequest, { isLoading: isApproving }] =
    useApprovePendingDepositRequestMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (event) => {
    event.preventDefault();

    try {
      const result = await addMember({
        name: formData.name,
        email: formData.email,
      }).unwrap();
      setFormData({ name: "", email: "" });
      setLastTempPassword(`Temporary password: ${result.tempPassword}`);
      toast.success("Member added successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add member.");
    }
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name || "",
      email: member.email || "",
    });
    setLastTempPassword("");
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setEditFormData({ name: "", email: "" });
  };

  const handleUpdateMember = async (event) => {
    event.preventDefault();

    if (!editingMember?.id) return;

    try {
      await updateMember({
        id: editingMember.id,
        name: editFormData.name,
        email: editFormData.email,
      }).unwrap();
      toast.success("Member updated successfully.");
      closeEditModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update member.");
    }
  };

  const handleDeleteMember = async (member) => {
    const confirmed = window.confirm(
      `Delete ${member.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteMember(member.id).unwrap();
      toast.success("Member deleted successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete member.");
    }
  };

  const handleApproveDepositRequest = async (request) => {
    try {
      await approveRequest(request.id).unwrap();
      toast.success("Deposit approved successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve deposit.");
    }
  };

  return (
    <div className="space-y-8 rounded-3xl bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-6 font-sans md:p-8">
      {/* Add New Member Section */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">
              Add New Member
            </h3>
            <p className="text-sm text-slate-500">Enter new member details</p>
          </div>
        </div>

        {lastTempPassword && (
          <p className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {lastTempPassword}
          </p>
        )}

        <form onSubmit={handleAddMember}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Member List Section */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <h3 className="text-xl font-semibold text-slate-900">
          Pending Deposit Approvals
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Approve member balance requests from this section
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-violet-50/70">
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Member
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Email
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Date
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Type
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Amount
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-800">
              {isPendingRequestsLoading ? (
                <tr>
                  <td className="py-4 px-2 text-slate-500" colSpan={6}>
                    Loading pending requests...
                  </td>
                </tr>
              ) : pendingDepositRequests.length === 0 ? (
                <tr>
                  <td className="py-4 px-2 text-slate-500" colSpan={6}>
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingDepositRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={
                      index !== pendingDepositRequests.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }
                  >
                    <td className="py-4 px-2 font-medium">
                      {request.userName || "-"}
                    </td>
                    <td className="py-4 px-2">{request.userEmail || "-"}</td>
                    <td className="py-4 px-2">{request.date || "-"}</td>
                    <td className="py-4 px-2">{request.type || "-"}</td>
                    <td className="py-4 px-2 font-medium text-[#16a34a]">
                      ৳{Number(request.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-2">
                      <button
                        type="button"
                        onClick={() => handleApproveDepositRequest(request)}
                        disabled={isApproving}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <h3 className="text-xl font-semibold text-slate-900">Member List</h3>
        <p className="mb-6 text-sm text-slate-500">All members in your mess</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-sky-50/70">
                <th className="w-1/5 py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Name
                </th>
                <th className="w-1/4 py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Email
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Total Meals
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Deposit
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-800">
              {isLoading ? (
                <tr>
                  <td className="py-4 px-2 text-slate-500" colSpan={5}>
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td className="py-4 px-2 text-slate-500" colSpan={5}>
                    No members added yet.
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr
                    key={member.id}
                    className={
                      index !== members.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }
                  >
                    <td className="py-4 px-2 font-medium wrap-break-word text-slate-900">
                      {member.name}
                    </td>
                    <td className="py-4 px-2 wrap-break-word text-slate-600">
                      {member.email}
                    </td>
                    <td className="py-4 px-2 text-slate-700">
                      {member.totalMeals ?? 0}
                    </td>
                    <td className="py-4 px-2 text-slate-700">
                      ৳{Number(member.balance || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Edit Member
                </h4>
                <p className="text-sm text-gray-500">
                  Update member name and email
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-5 px-6 py-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditFormData((prev) => ({ ...prev, [name]: value }));
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditFormData((prev) => ({ ...prev, [name]: value }));
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-[#00a859] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-70"
                >
                  {isUpdating ? "Updating..." : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Members;

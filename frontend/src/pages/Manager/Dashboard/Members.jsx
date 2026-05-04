import { PencilLine, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddMemberMutation,
  useDeleteMemberMutation,
  useGetMembersQuery,
  useUpdateMemberMutation,
} from "../../../features/management/managementSlice";

const Members = () => {
  const [lastTempPassword, setLastTempPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { data, isLoading } = useGetMembersQuery();
  const members = data?.data || [];
  const [addMember, { isLoading: isSubmitting }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();

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
      phone: member.phone || "",
    });
    setLastTempPassword("");
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setEditFormData({ name: "", email: "", phone: "" });
  };

  const handleUpdateMember = async (event) => {
    event.preventDefault();

    if (!editingMember?.id) return;

    try {
      await updateMember({
        id: editingMember.id,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
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

  return (
    <div className="space-y-8 font-sans">
      {/* Add New Member Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-3xl font-bold text-gray-800">Add New Member</h3>
        <p className="text-sm text-gray-500 mb-6">Enter new member details</p>

        {lastTempPassword && (
          <p className="text-sm bg-green-50 text-green-700 border border-green-100 rounded-lg px-3 py-2 mb-4">
            {lastTempPassword}
          </p>
        )}

        <form onSubmit={handleAddMember}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-gray-200 transition text-sm"
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
                className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-gray-200 transition text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00a859] hover:bg-green-600 disabled:opacity-70 text-white font-medium py-2.5 px-6 rounded-lg transition text-sm"
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Member List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900">Member List</h3>
        <p className="text-sm text-gray-500 mb-6">All members in your mess</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm w-1/5 whitespace-nowrap">
                  Name
                </th>
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm w-1/4 whitespace-nowrap">
                  Email
                </th>
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm whitespace-nowrap">
                  Phone
                </th>
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm whitespace-nowrap">
                  Total Meals
                </th>
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm whitespace-nowrap">
                  Balance
                </th>
                <th className="py-4 px-2 font-semibold text-gray-900 text-sm whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {isLoading ? (
                <tr>
                  <td className="py-4 px-2 text-gray-500" colSpan={6}>
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td className="py-4 px-2 text-gray-500" colSpan={6}>
                    No members added yet.
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr
                    key={member.id}
                    className={
                      index !== members.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }
                  >
                    <td className="py-4 px-2 font-medium wrap-break-word">
                      {member.name}
                    </td>
                    <td className="py-4 px-2 wrap-break-word">
                      {member.email}
                    </td>
                    <td className="py-4 px-2">{member.phone || "N/A"}</td>
                    <td className="py-4 px-2">{member.totalMeals ?? 0}</td>
                    <td className="py-4 px-2">
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
                  Update member name, email, and phone
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
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditFormData((prev) => ({ ...prev, [name]: value }));
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
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

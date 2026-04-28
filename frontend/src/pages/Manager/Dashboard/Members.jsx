import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddMemberMutation,
  useGetMembersQuery,
} from "../../../features/management/managementSlice";

const Members = () => {
  const [lastTempPassword, setLastTempPassword] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { data, isLoading } = useGetMembersQuery();
  const members = data?.data || [];
  const [addMember, { isLoading: isSubmitting }] = useAddMemberMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (event) => {
    event.preventDefault();

    try {
      const result = await addMember({
        ...formData,
      }).unwrap();
      setFormData({ name: "", email: "" });
      setLastTempPassword(`Temporary password: ${result.tempPassword}`);
      toast.success("Member added successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add member.");
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
                    <td className="py-4 px-2">N/A</td>
                    <td className="py-4 px-2">0</td>
                    <td className="py-4 px-2">৳0</td>
                    <td className="py-4 px-2 text-gray-500">-</td>
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

export default Members;

const Members = () => {
  // Dummy member data mapping what is on the screenshot
  const members = [
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "01712345678",
      meals: 45,
      balance: "৳1750",
    },
    {
      id: 2,
      name: "Fatima Begum",
      email: "fatima@example.com",
      phone: "01812345678",
      meals: 38,
      balance: "৳2100",
    },
    {
      id: 3,
      name: "Rakib Hasan",
      email: "rakib@example.com",
      phone: "01912345678",
      meals: 42,
      balance: "৳1500",
    },
    {
      id: 4,
      name: "Nusrat Jahan",
      email: "nusrat@example.com",
      phone: "01612345678",
      meals: 40,
      balance: "৳1800",
    },
    {
      id: 5,
      name: "Kamal Rahman",
      email: "kamal@example.com",
      phone: "01512345678",
      meals: 35,
      balance: "৳2500",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Add New Member Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-3xl font-bold text-gray-800">Add New Member</h3>
        <p className="text-sm text-gray-500 mb-6">Enter new member details</p>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-gray-200 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-gray-200 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone"
                className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-gray-200 transition text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            className="bg-[#00a859] hover:bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg transition text-sm"
          >
            Add Member
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
              {members.map((member, index) => (
                <tr
                  key={member.id}
                  className={
                    index !== members.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="py-4 px-2 font-medium break-words">
                    {member.name}
                  </td>
                  <td className="py-4 px-2 break-words">{member.email}</td>
                  <td className="py-4 px-2">{member.phone}</td>
                  <td className="py-4 px-2">{member.meals}</td>
                  <td className="py-4 px-2">{member.balance}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600 hover:text-black transition">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;

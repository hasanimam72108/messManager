const Dashboard = () => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manager Dashboard</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Manage your mess and track all activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">
              Total
              <br />
              Members
            </p>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">8</h3>
          <p className="text-gray-400 text-xs">active members</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <div className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-lg font-bold">
              ৳
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">৳26000</h3>
          <p className="text-gray-400 text-xs">this month</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Total Meals</p>
            <div className="p-2 bg-green-50 text-green-500 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">360</h3>
          <p className="text-gray-400 text-xs">meals consumed</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Per Meal Rate</p>
            <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">৳72.22</h3>
          <p className="text-gray-400 text-xs">per meal</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h4 className="text-lg font-medium text-gray-900 mb-6">
          Recent Activity
        </h4>
        <div className="space-y-6">
          {/* Activity Item 1 */}
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-sm mr-4">
              AK
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Ahmed Khan</p>
              <p className="text-sm text-gray-500">Added 1 dinner</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Activity Item 2 */}
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-sm mr-4">
              FB
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Fatima Begum</p>
              <p className="text-sm text-gray-500">Added 1 lunch</p>
              <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Activity Item 3 */}
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-sm mr-4">
              RH
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Rakib Hasan</p>
              <p className="text-sm text-gray-500">Added deposit ৳3000</p>
              <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

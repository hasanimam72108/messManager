const MonthlyReport = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Monthly Report</h1>
          <p className="text-gray-500 mt-1">
            Complete report for February 2026
          </p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center transition-colors">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Report
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Total Members
          </p>
          <h2 className="text-3xl font-bold text-gray-800">8</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Meals</p>
          <h2 className="text-3xl font-bold text-gray-800">360</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Total Expenses
          </p>
          <h2 className="text-3xl font-bold text-red-600">৳26000</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Cost Per Meal
          </p>
          <h2 className="text-3xl font-bold text-green-600">৳72.22</h2>
        </div>
      </div>

      {/* Expense Breakdown Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Expense Breakdown</h3>
          <p className="text-gray-500 text-sm">Category-wise expense summary</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 mb-4 inline-table w-full">
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3">
                  Category
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3">
                  Amount
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3 text-right md:text-left">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="block mt-2 space-y-4">
              {/* Row 1 */}
              <tr className="flex items-center text-sm text-gray-700">
                <td className="w-1/3 font-medium">Bazaar</td>
                <td className="w-1/3">৳18500</td>
                <td className="w-1/3 flex items-center gap-3">
                  <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "71.2%" }}
                    ></div>
                  </div>
                  <span className="text-gray-500">71.2%</span>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="flex items-center text-sm text-gray-700 border-t border-gray-50 pt-4">
                <td className="w-1/3 font-medium">Gas</td>
                <td className="w-1/3">৳3600</td>
                <td className="w-1/3 flex items-center gap-3">
                  <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "13.8%" }}
                    ></div>
                  </div>
                  <span className="text-gray-500">13.8%</span>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="flex items-center text-sm text-gray-700 border-t border-gray-50 pt-4">
                <td className="w-1/3 font-medium">Electricity</td>
                <td className="w-1/3">৳2100</td>
                <td className="w-1/3 flex items-center gap-3">
                  <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "8.1%" }}
                    ></div>
                  </div>
                  <span className="text-gray-500">8.1%</span>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="flex items-center text-sm text-gray-700 border-t border-gray-50 pt-4">
                <td className="w-1/3 font-medium">Water</td>
                <td className="w-1/3">৳800</td>
                <td className="w-1/3 flex items-center gap-3">
                  <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "3.1%" }}
                    ></div>
                  </div>
                  <span className="text-gray-500">3.1%</span>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="flex items-center text-sm text-gray-700 border-t border-gray-50 pt-4">
                <td className="w-1/3 font-medium">Other</td>
                <td className="w-1/3">৳1000</td>
                <td className="w-1/3 flex items-center gap-3">
                  <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "3.8%" }}
                    ></div>
                  </div>
                  <span className="text-gray-500">3.8%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;

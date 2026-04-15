import { FileText, Utensils, Wallet } from "lucide-react";

const Dashboard = () => {
  const recentMeals = [
    { date: "2026-02-24", type: "Dinner", quantity: 1 },
    { date: "2026-02-24", type: "Lunch", quantity: 1 },
    { date: "2026-02-23", type: "Dinner", quantity: 1 },
    { date: "2026-02-23", type: "Lunch", quantity: 1 },
    { date: "2026-02-22", type: "Dinner", quantity: 1 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Dashboard</h1>
        <p className="text-[#6b7280]">
          Welcome back! Here's your overview for this month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#6b7280] text-sm font-medium">
              Total Meals This Month
            </h3>
            <div className="p-2.5 bg-[#dcfce7] text-[#16a34a] rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#1f2937] mb-2">45</h2>
            <p className="text-[#6b7280] text-sm">meals consumed</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#6b7280] text-sm font-medium">Current Bill</h3>
            <div className="p-2.5 bg-[#ffedd5] text-[#ea580c] rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#1f2937] mb-2">৳3250</h2>
            <p className="text-[#6b7280] text-sm">for this month</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#6b7280] text-sm font-medium">
              Remaining Balance
            </h3>
            <div className="p-2.5 bg-[#dbeafe] text-[#2563eb] rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#1f2937] mb-2">৳1750</h2>
            <p className="text-[#6b7280] text-sm">available balance</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-7">
          <h3 className="text-[17px] font-semibold text-[#1f2937] mb-6">
            Recent Meal Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-4 text-[14px] font-semibold text-[#1f2937] border-b border-gray-100">
                    Date
                  </th>
                  <th className="pb-4 text-[14px] font-semibold text-[#1f2937] border-b border-gray-100">
                    Meal Type
                  </th>
                  <th className="pb-4 text-[14px] font-semibold text-[#1f2937] border-b border-gray-100">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMeals.map((meal, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 text-[15px] text-[#4b5563]">
                      {meal.date}
                    </td>
                    <td className="py-4 text-[15px] text-[#4b5563] flex items-center gap-3">
                      <Utensils className="w-[18px] h-[18px] text-[#9ca3af]" />
                      {meal.type}
                    </td>
                    <td className="py-4 text-[15px] text-[#4b5563]">
                      {meal.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

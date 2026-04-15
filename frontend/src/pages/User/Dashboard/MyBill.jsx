const MyBill = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bill</h1>
        <p className="text-gray-500">View your monthly bill details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Bill Overview - February 2026
          </h2>
          <p className="text-gray-500 text-sm">
            Your complete billing information for this month
          </p>
        </div>

        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Total Meals Consumed</span>
            <span className="font-medium text-gray-900">45 meals</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Cost Per Meal</span>
            <span className="font-medium text-gray-900">৳72.22</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Total Bill</span>
            <span className="font-bold text-gray-900 text-lg">৳3250</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Paid Amount</span>
            <span className="font-medium text-[#16a34a]">৳1500</span>
          </div>
          <div className="flex justify-between items-center py-4 flex-wrap gap-2">
            <span className="text-gray-600">Remaining Amount</span>
            <span className="font-bold text-[#ea580c] text-lg">৳1750</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Bill Breakdown
          </h2>
          <p className="text-gray-500 text-sm">
            Detailed breakdown by meal type
          </p>
        </div>

        <div className="py-4 text-center text-gray-500">
          Breakdown details will appear here
        </div>
      </div>
    </div>
  );
};

export default MyBill;

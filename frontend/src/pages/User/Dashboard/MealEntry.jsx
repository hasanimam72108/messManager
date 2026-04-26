import { useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { addMealByUser, listMealsByUser } from "../../../mock/mockBackend";

const MealEntry = () => {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Lunch");
  const [quantity, setQuantity] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleMealTypeChange = (e) => {
    const selectedMealType = e.target.value;
    setMealType(selectedMealType);
    if (selectedMealType === "Off") {
      setQuantity(0);
    } else if (Number(quantity) === 0) {
      setQuantity(1);
    }
  };

  const meals = useMemo(
    () => listMealsByUser(user?.id),
    [refreshToken, user?.id],
  );

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!date || !user?.id) return;

    addMealByUser({
      userId: user.id,
      date,
      mealType,
      quantity,
    });

    setRefreshToken((prev) => prev + 1);
    setDate("");
    setMealType("Lunch");
    setQuantity(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Entry</h1>
        <p className="text-gray-500">Record your daily meals here</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Add New Meal
          </h2>
          <p className="text-gray-500 text-sm">Enter your meal details below</p>
        </div>

        <form onSubmit={handleAddMeal} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={handleMealTypeChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors appearance-none"
              >
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min={mealType === "Off" ? "0" : "1"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={mealType === "Off"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#16a34a] text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            Add Meal
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Monthly Meal Summary
          </h2>
          <p className="text-gray-500 text-sm">
            Your meal records for this month
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 font-semibold text-gray-900">Date</th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Meal Type
                </th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr
                  key={meal.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="py-4 px-4 text-gray-600">{meal.date}</td>
                  <td className="py-4 px-4 text-gray-600">{meal.mealType}</td>
                  <td className="py-4 px-4 text-gray-600">{meal.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealEntry;

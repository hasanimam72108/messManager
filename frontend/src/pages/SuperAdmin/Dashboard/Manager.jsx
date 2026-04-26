import { useMemo } from "react";
import { listManagers } from "../../../mock/mockBackend";

const Manager = () => {
  const managers = useMemo(() => listManagers(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Details</h1>
        <p className="text-gray-500 mt-1">
          View all approved manager accounts.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Mess Name</th>
              </tr>
            </thead>
            <tbody>
              {managers.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={3}>
                    No manager found.
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      {manager.name}
                    </td>
                    <td className="py-3">{manager.email}</td>
                    <td className="py-3">{manager.messName}</td>
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

export default Manager;

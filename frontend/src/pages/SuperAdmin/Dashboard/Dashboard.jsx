import { useMemo } from "react";
import {
  getSystemReport,
  listManagers,
  listMessesWithDetails,
} from "../../../mock/mockBackend";

const Dashboard = () => {
  const report = useMemo(() => getSystemReport(), []);
  const messes = useMemo(() => listMessesWithDetails(), []);
  const managers = useMemo(() => listManagers(), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor all messes and managers from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card title="Total Messes" value={report.totalMesses} />
        <Card title="Total Managers" value={report.totalManagers} />
        <Card title="Total Users" value={report.totalUsers} />
        <Card title="Pending Requests" value={report.pendingRequests} />
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900">Mess Overview</h2>
        <p className="text-sm text-gray-500 mb-4">
          Mess details and assigned managers.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3">Mess Name</th>
                <th className="py-3">Manager</th>
                <th className="py-3">Manager Email</th>
                <th className="py-3">Members</th>
              </tr>
            </thead>
            <tbody>
              {messes.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    No mess created yet.
                  </td>
                </tr>
              ) : (
                messes.map((mess) => (
                  <tr key={mess.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      {mess.name}
                    </td>
                    <td className="py-3">{mess.managerName}</td>
                    <td className="py-3">{mess.managerEmail}</td>
                    <td className="py-3">{mess.memberCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900">Manager Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          All approved managers and their messes.
        </p>

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
                    No manager approved yet.
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
      </section>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
  </div>
);

export default Dashboard;

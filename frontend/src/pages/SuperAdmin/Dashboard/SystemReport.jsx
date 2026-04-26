import { useMemo } from "react";
import { getSystemReport } from "../../../mock/mockBackend";

const SystemReport = () => {
  const report = useMemo(() => getSystemReport(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Report</h1>
        <p className="text-gray-500 mt-1">Simple platform-wide summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <ReportCard title="Total Mess" value={report.totalMesses} />
        <ReportCard title="Total Manager" value={report.totalManagers} />
        <ReportCard title="Total User" value={report.totalUsers} />
        <ReportCard title="Pending Requests" value={report.pendingRequests} />
      </div>
    </div>
  );
};

const ReportCard = ({ title, value }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
  </div>
);

export default SystemReport;

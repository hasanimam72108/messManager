import { Inbox, RotateCcw, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import {
  useApproveMessRequestMutation,
  useGetMessRequestsQuery,
  useRejectMessRequestMutation,
} from "../../../features/management/managementSlice";

const MessGroup = () => {
  const [lastApproved, setLastApproved] = useState("");
  const { data, isLoading } = useGetMessRequestsQuery("pending");
  const pendingRequests = data?.data || [];
  const [approveMessRequest] = useApproveMessRequestMutation();
  const [rejectMessRequest] = useRejectMessRequestMutation();

  const handleApprove = async (requestId) => {
    try {
      await approveMessRequest(requestId).unwrap();
      setLastApproved("Approved successfully. Manager can now login.");
    } catch (error) {
      setLastApproved(error?.data?.message || "Unable to approve request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectMessRequest(requestId).unwrap();
    } catch (error) {
      setLastApproved(error?.data?.message || "Unable to reject request.");
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-rose-100 p-3 text-rose-600 shadow-sm">
          <Inbox className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Mess Group Requests
          </h1>
          <p className="mt-1 text-slate-500">
            Approve or reject manager mess creation requests.
          </p>
        </div>
      </div>

      {lastApproved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
          <RotateCcw className="h-4 w-4" />
          {lastApproved}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/70 text-slate-600">
                <th className="py-3 px-2">Mess Name</th>
                <th className="py-3 px-2">Manager Name</th>
                <th className="py-3 px-2">Manager Email</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    Loading requests...
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {request.messName}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      {request.managerName || "N/A"}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      {request.managerEmail}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                          onClick={() => handleApprove(request.id)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100"
                          onClick={() => handleReject(request.id)}
                        >
                          <UserX className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
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

export default MessGroup;

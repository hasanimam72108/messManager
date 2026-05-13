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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mess Group Requests
        </h1>
        <p className="text-gray-500 mt-1">
          Approve or reject manager mess creation requests.
        </p>
      </div>

      {lastApproved && (
        <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 text-sm">
          {lastApproved}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3">Mess Name</th>
                <th className="py-3">Manager Name</th>
                <th className="py-3">Manager Email</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    Loading requests...
                  </td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">
                      {request.messName}
                    </td>
                    <td className="py-3">{request.managerName || "N/A"}</td>
                    <td className="py-3">{request.managerEmail}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs"
                          onClick={() => handleReject(request.id)}
                        >
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

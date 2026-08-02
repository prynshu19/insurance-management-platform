import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, AlertCircle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getClaims, updateClaimStatus } from "../../services/api";

const ClaimsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["claims", page, statusFilter],
    queryFn: () => getClaims({ page, limit: 8, status: statusFilter || undefined }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateClaimStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(["claims"]),
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-xs text-gray-400 mt-1">Review and process customer insurance claims</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-card w-fit">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs text-gray-600 outline-none bg-transparent"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="UNDER_REVIEW">Under Review</option>
        </select>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading claims...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No claims found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Claim ID</th>
                  <th className="p-4">Policy</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-mono text-xs font-bold text-gray-800">{claim.claimNumber}</td>
                    <td className="p-4 font-medium">{claim.policy?.policyNumber}</td>
                    <td className="p-4 max-w-xs truncate">{claim.reason}</td>
                    <td className="p-4 font-bold text-gray-900">${claim.claimAmount}</td>
                    <td className="p-4">{new Date(claim.submissionDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          claim.status === "APPROVED"
                            ? "bg-emerald-50 text-brand-green"
                            : claim.status === "REJECTED"
                            ? "bg-red-50 text-brand-red"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {claim.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => statusMutation.mutate({ id: claim.id, status: "APPROVED" })}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-brand-green font-bold rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: claim.id, status: "REJECTED" })}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-brand-red font-bold rounded-lg transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsPage;

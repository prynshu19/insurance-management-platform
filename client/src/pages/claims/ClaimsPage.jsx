import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { getClaims, updateClaimStatus } from "../../services/api";

const ClaimsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["claims", page, statusFilter],
    queryFn: () => getClaims({ page, limit: 8, status: statusFilter || undefined }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateClaimStatus(id, { status }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(["claims"]);
      triggerToast(`Claim marked as ${variables.status}`);
    },
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-brand-green" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Claims Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Review and process customer insurance claims</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-card border border-gray-100 w-fit">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold text-gray-600 outline-none bg-transparent cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="UNDER_REVIEW">Under Review</option>
        </select>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">Loading claims...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">No claims found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
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
              <tbody className="divide-y divide-gray-100 font-medium">
                {data?.data?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-mono text-xs font-bold text-gray-800">{claim.claimNumber}</td>
                    <td className="p-4 font-bold text-gray-700">{claim.policy?.policyNumber || "N/A"}</td>
                    <td className="p-4 max-w-xs truncate text-gray-600">{claim.reason}</td>
                    <td className="p-4 font-extrabold text-gray-900">${claim.claimAmount}</td>
                    <td className="p-4 text-gray-500">{new Date(claim.submissionDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
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
                      {claim.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => statusMutation.mutate({ id: claim.id, status: "APPROVED" })}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green font-bold rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ id: claim.id, status: "REJECTED" })}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-brand-red font-bold rounded-lg transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-[11px] font-semibold italic">Processed</span>
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
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
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

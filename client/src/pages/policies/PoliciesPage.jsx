import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { getPolicies } from "../../services/api";

const PoliciesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["policies", page, search, statusFilter],
    queryFn: () => getPolicies({ page, limit: 8, search, status: statusFilter || undefined }),
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-xs text-gray-400 mt-1">Overview and status of all insurance policies</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition">
          <Plus size={16} /> Create Policy
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white p-3 rounded-2xl shadow-card">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by policy number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-gray-700 outline-none bg-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white p-3 rounded-2xl shadow-card text-xs text-gray-600 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading policies...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No policies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Policy Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Premium Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                      <FileText size={16} className="text-brand-green" />
                      {policy.policyNumber}
                    </td>
                    <td className="p-4 font-medium text-gray-700">{policy.customer?.fullName}</td>
                    <td className="p-4 font-semibold">{policy.policyType}</td>
                    <td className="p-4 font-bold text-gray-900">${policy.premiumAmount}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          policy.status === "ACTIVE"
                            ? "bg-emerald-50 text-brand-green"
                            : policy.status === "EXPIRED"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-brand-red"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(policy.endDate).toLocaleDateString()}</td>
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

export default PoliciesPage;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Filter, FileText, ChevronLeft, ChevronRight, X, CheckCircle2 } from "lucide-react";
import { getPolicies, createPolicy, getCustomers } from "../../services/api";

const PoliciesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    policyType: "AUTO",
    policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
    premiumAmount: "920",
    coverageAmount: "50000",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["policies", page, search, statusFilter],
    queryFn: () => getPolicies({ page, limit: 8, search, status: statusFilter || undefined }),
  });

  const { data: customersData } = useQuery({
    queryKey: ["customersList"],
    queryFn: () => getCustomers({ page: 1, limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      setIsModalOpen(false);
      triggerToast("New insurance policy created successfully!");
    },
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      premiumAmount: Number(formData.premiumAmount),
      coverageAmount: Number(formData.coverageAmount),
    });
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Policy Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Overview and status of all insurance policies</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition"
        >
          <Plus size={16} /> Create Policy
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-card border border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by policy number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium text-gray-700 outline-none bg-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white px-4 py-3 rounded-2xl shadow-card text-xs font-semibold text-gray-600 outline-none border border-gray-100 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading policies...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No policies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
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
              <tbody className="divide-y divide-gray-100 font-medium">
                {data?.data?.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                      <FileText size={16} className="text-brand-green shrink-0" />
                      {policy.policyNumber}
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">{policy.customer?.fullName || "N/A"}</td>
                    <td className="p-4 font-bold text-gray-800">{policy.policyType}</td>
                    <td className="p-4 font-extrabold text-gray-900">${policy.premiumAmount}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
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
                    <td className="p-4 text-gray-500">{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-500">{new Date(policy.endDate).toLocaleDateString()}</td>
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

      {/* Create Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Create New Policy</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Select Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                  required
                >
                  <option value="">-- Choose Customer --</option>
                  {customersData?.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Policy Type</label>
                <select
                  value={formData.policyType}
                  onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                >
                  <option value="AUTO">Auto Insurance</option>
                  <option value="LIFE">Life Insurance</option>
                  <option value="HOME">Home Insurance</option>
                  <option value="HEALTH">Health Insurance</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Premium ($)</label>
                  <input
                    type="number"
                    value={formData.premiumAmount}
                    onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Coverage ($)</label>
                  <input
                    type="number"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliciesPage;

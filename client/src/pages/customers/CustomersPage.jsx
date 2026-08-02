import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Trash2, Edit, Phone, Mail, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";
import { getCustomers, createCustomer, deleteCustomer } from "../../services/api";

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "", dob: "", address: "", userId: "" });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, search],
    queryFn: () => getCustomers({ page, limit: 8, search }),
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setIsModalOpen(false);
      setFormData({ fullName: "", phone: "", dob: "", address: "", userId: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => queryClient.invalidateQueries(["customers"]),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-xs text-gray-400 mt-1">Manage and track customer profiles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search & Controls */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-card">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs text-gray-700 outline-none bg-transparent"
        />
      </div>

      {/* Customer List / Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading customers...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Date of Birth</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center font-bold">
                        {customer.fullName?.charAt(0)}
                      </div>
                      {customer.fullName}
                    </td>
                    <td className="p-4">{customer.phone}</td>
                    <td className="p-4 truncate max-w-xs">{customer.address}</td>
                    <td className="p-4">{new Date(customer.dob).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(customer.id)}
                        className="p-1.5 text-gray-400 hover:text-brand-red transition"
                      >
                        <Trash2 size={16} />
                      </button>
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Add New Customer</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                required
              />
              <input
                type="text"
                placeholder="Phone (+123456789)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                required
              />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                required
              />
              <input
                type="text"
                placeholder="Linked User CUID"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                required
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-green text-white font-semibold rounded-xl"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

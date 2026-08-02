import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Trash2, Edit, Phone, Mail, MapPin, User, ChevronLeft, ChevronRight, X, CheckCircle2 } from "lucide-react";
import { getCustomers, createCustomer, deleteCustomer } from "../../services/api";

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
      triggerToast("Customer profile added successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      triggerToast("Customer deleted from database");
    },
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Manage and track customer profiles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search & Controls */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-card border border-gray-100">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs font-medium text-gray-700 outline-none bg-transparent"
        />
      </div>

      {/* Customer List / Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">Loading customers...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Date of Birth</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {data?.data?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center font-bold text-sm shrink-0">
                        {customer.fullName?.charAt(0)}
                      </div>
                      {customer.fullName}
                    </td>
                    <td className="p-4 text-gray-700">{customer.phone}</td>
                    <td className="p-4 truncate max-w-xs text-gray-600">{customer.address}</td>
                    <td className="p-4 text-gray-500">{new Date(customer.dob).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(customer.id)}
                        className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition"
                        title="Delete Customer"
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Phone (+123456789)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                required
              />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Linked User CUID"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 font-semibold"
                required
              />
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

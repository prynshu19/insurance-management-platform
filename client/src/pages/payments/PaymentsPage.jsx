import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { getOverduePayments, updatePaymentStatus } from "../../services/api";

const PaymentsPage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["overduePayments"],
    queryFn: () => getOverduePayments({ page: 1, limit: 10 }),
  });

  const payMutation = useMutation({
    mutationFn: (id) => updatePaymentStatus(id, { paymentStatus: "PAID" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["overduePayments"]);
      triggerToast("Premium payment recorded successfully!");
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payments & Premium Tracking</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Monitor upcoming and overdue premium payments</p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries(["overduePayments"])}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm transition"
        >
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2.5">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <h2 className="font-bold text-sm text-gray-800 tracking-wide uppercase">Overdue & Upcoming Payments</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">Loading payments...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">No overdue payments found 🎉</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Policy</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {data?.data?.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-bold text-gray-800">{p.policy?.policyNumber || "N/A"}</td>
                    <td className="p-4 font-bold text-gray-700">{p.policy?.customer?.fullName || "N/A"}</td>
                    <td className="p-4 font-extrabold text-brand-red">${p.amount}</td>
                    <td className="p-4 text-gray-500">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-red-50 text-brand-red">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => payMutation.mutate(p.id)}
                        className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green font-extrabold rounded-lg transition"
                      >
                        Mark Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

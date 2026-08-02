import { useQuery } from "@tanstack/react-query";
import { DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { getOverduePayments } from "../../services/api";

const PaymentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["overduePayments"],
    queryFn: () => getOverduePayments({ page: 1, limit: 10 }),
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Premium Tracking</h1>
        <p className="text-xs text-gray-400 mt-1">Monitor upcoming and overdue premium payments</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          <h2 className="font-bold text-sm text-gray-800">Overdue Payments</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading payments...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No overdue payments found 🎉</div>
        ) : (
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Policy</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-800">{p.policy?.policyNumber}</td>
                  <td className="p-4">{p.policy?.customer?.fullName}</td>
                  <td className="p-4 font-bold text-brand-red">${p.amount}</td>
                  <td className="p-4">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-brand-red">
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

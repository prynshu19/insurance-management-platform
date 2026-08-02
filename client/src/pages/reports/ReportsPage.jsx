import { useQuery } from "@tanstack/react-query";
import { TrendingUp, FileText, Users, DollarSign } from "lucide-react";
import { getPremiumReport, getClaimsReport, getCustomerGrowthReport } from "../../services/api";

const ReportsPage = () => {
  const { data: premiumReport } = useQuery({ queryKey: ["premiumReport"], queryFn: getPremiumReport });
  const { data: claimsReport } = useQuery({ queryKey: ["claimsReport"], queryFn: getClaimsReport });
  const { data: customerGrowth } = useQuery({ queryKey: ["customerGrowth"], queryFn: getCustomerGrowthReport });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Statistics</h1>
        <p className="text-xs text-gray-400 mt-1">Platform performance and financial metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Premium Collected</p>
            <p className="text-2xl font-bold text-brand-green mt-1">${premiumReport?.totalCollected || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Claims Processed</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{claimsReport?.total || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Customer Count</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{customerGrowth?.total || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

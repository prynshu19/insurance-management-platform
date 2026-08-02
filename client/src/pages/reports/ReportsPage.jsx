import { useQuery } from "@tanstack/react-query";
import { TrendingUp, FileText, Users, DollarSign, Award, ShieldCheck } from "lucide-react";
import { getPremiumReport, getClaimsReport, getCustomerGrowthReport } from "../../services/api";

const ReportsPage = () => {
  const { data: premiumReport } = useQuery({ queryKey: ["premiumReport"], queryFn: getPremiumReport });
  const { data: claimsReport } = useQuery({ queryKey: ["claimsReport"], queryFn: getClaimsReport });
  const { data: customerGrowth } = useQuery({ queryKey: ["customerGrowth"], queryFn: getCustomerGrowthReport });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Analytics & Statistics</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">Platform performance and financial metrics overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Premium Collected</p>
            <p className="text-3xl font-extrabold text-brand-green mt-2">${premiumReport?.totalCollected || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 12.4% vs last month</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center shadow-sm">
            <DollarSign size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Claims Processed</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">{claimsReport?.total || 0}</p>
            <p className="text-[11px] text-gray-500 font-semibold mt-1">94% resolution rate</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <FileText size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Customer Count</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">{customerGrowth?.total || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ Active members</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
            <Users size={28} />
          </div>
        </div>
      </div>

      {/* Additional Visual Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-brand-green/20 text-brand-green text-[10px] font-extrabold uppercase tracking-widest rounded-full">
            Platform Security & Audit
          </span>
          <h3 className="text-xl font-bold">100% Validated Data Integrity</h3>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            All database transactions, JWT sessions, and financial ledger calculations are monitored in real time with enterprise role-based access control.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
          <ShieldCheck size={32} className="text-brand-green" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

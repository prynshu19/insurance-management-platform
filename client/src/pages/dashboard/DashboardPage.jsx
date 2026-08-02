import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Car, Heart, Home, Plus, SlidersHorizontal, CheckCircle2, ShieldCheck,
  CreditCard as CreditCardIcon, ChevronLeft, ChevronRight, Edit, ArrowRightLeft
} from "lucide-react";
import { getDashboardStats, getRecentActivities, getMonthlyRevenue } from "../../services/api";

const DashboardPage = () => {
  const [activeCoverageType, setActiveCoverageType] = useState("Auto Insurance");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: activities } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: getRecentActivities,
  });

  const { data: revenue } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: getMonthlyRevenue,
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F7FFFE]">
      {/* ── Main Dashboard Content ──────────────────────────────────── */}
      <div className="flex-1 p-6 lg:p-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">check and maintain your insurance status</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-800 transition">
              <SlidersHorizontal size={14} /> Sort
            </button>
            <button className="flex items-center gap-1 hover:text-gray-800 transition">
              <CheckCircle2 size={14} className="text-brand-green" /> All widgets
            </button>
            <button className="flex items-center gap-1 hover:text-gray-800 transition">
              <SlidersHorizontal size={14} /> Settings
            </button>
          </div>
        </div>

        {/* Section: Your Insurances */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Your Insurances</h2>
            <button className="text-gray-400 hover:text-gray-600">...</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Auto Insurance */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between h-36">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600">
                  <Car size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">Auto Insurance</h3>
                </div>
              </div>
              <div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-brand-green h-full w-[70%]" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-green">$ 920.2 <span className="font-normal text-gray-400 text-[10px]">left</span></span>
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                </div>
              </div>
            </div>

            {/* Life Insurance */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between h-36">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">Life Insurance</h3>
                </div>
              </div>
              <div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-pink-400 h-full w-[45%]" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-500">$ 1081 <span className="font-normal text-gray-400 text-[10px]">left</span></span>
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                </div>
              </div>
            </div>

            {/* Home Insurance */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between h-36">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500">
                  <Home size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">Home Insurance</h3>
                </div>
              </div>
              <div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-brand-green h-full w-[85%]" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-600">$ 1362 <span className="font-normal text-gray-400 text-[10px]">left</span></span>
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                </div>
              </div>
            </div>

            {/* Add New Plan Button */}
            <div className="bg-[#FF4B4B] rounded-2xl p-5 shadow-card text-white flex items-center justify-center cursor-pointer hover:bg-[#E63939] transition h-36">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                <Plus size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Family Insurance */}
        <div className="bg-white rounded-2xl p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2">Family Insurance</h2>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold">A</div>
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold">B</div>
                <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold">C</div>
              </div>
              <button className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-xs">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-base font-bold text-brand-green">$ 2.294.00</span>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ArrowRightLeft size={16} />
            </button>
            <button className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-xl shadow-sm transition">
              Top Up
            </button>
          </div>
        </div>

        {/* Section: Last requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Last requests</h2>
            <select className="text-xs text-gray-400 bg-transparent border-0 outline-none">
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
              <p className="text-xs font-semibold text-gray-400">colonoscopy</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Screening done and colonoscopy (examination of the inside of the large intestine with a flexible viewing ...<span className="text-brand-red font-semibold cursor-pointer">more</span>
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">Files</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="text-xs font-medium text-gray-600">accepted</span>
                  <span className="text-xs font-bold text-brand-green bg-emerald-50 px-2 py-0.5 rounded-md">60%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
              <p className="text-xs font-semibold text-gray-400">blood test</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                The test shows that the person has very few red blood cells (anemia). The same test is repeated after treatment ...<span className="text-brand-red font-semibold cursor-pointer">more</span>
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">Files</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="text-xs font-medium text-gray-600">accepted</span>
                  <span className="text-xs font-bold text-brand-green bg-emerald-50 px-2 py-0.5 rounded-md">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Statistic (preview) */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">Statistic <span className="text-xs font-normal text-gray-400">(preview)</span></h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span> Income</span>
              <span className="flex items-center gap-1 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span> Outcome</span>
            </div>
          </div>

          {/* Simple CSS Bar Chart representing monthly statistics */}
          <div className="h-44 flex items-end justify-between px-2 pt-4 border-b border-gray-100">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => (
              <div key={m} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-2.5 bg-brand-green rounded-full" style={{ height: `${30 + (idx % 5) * 12}px` }}></div>
                <div className="w-2.5 bg-brand-red rounded-full" style={{ height: `${15 + (idx % 3) * 10}px` }}></div>
                <span className="text-[10px] text-gray-400 mt-2">{m}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Right Panel Sidebar (Details & Payment) ──────────────────── */}
      <div className="w-full lg:w-[320px] bg-white border-l border-gray-100 p-6 flex flex-col gap-6 shadow-sm">
        
        {/* Cover details header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</span>
          <h3 className="font-bold text-base text-gray-900">{activeCoverageType}</h3>
        </div>

        {/* Coverage Type List */}
        <div className="space-y-3">
          <p className="text-xs text-gray-400">Type:</p>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-center justify-between">
              <span>Medical payments coverage</span>
              <CheckCircle2 size={16} className="text-brand-green" />
            </li>
            <li className="flex items-center justify-between">
              <span>Collision coverage</span>
              <CheckCircle2 size={16} className="text-brand-green" />
            </li>
            <li className="flex items-center justify-between text-gray-400">
              <span>Comprehensive coverage</span>
              <span className="w-4 h-4 rounded-full border border-gray-300"></span>
            </li>
            <li className="flex items-center justify-between text-gray-400">
              <span>Liability Coverage</span>
              <span className="w-4 h-4 rounded-full border border-gray-300"></span>
            </li>
            <li className="flex items-center justify-between text-gray-400">
              <span>underinsured motorist coverage</span>
              <span className="w-4 h-4 rounded-full border border-gray-300"></span>
            </li>
          </ul>
        </div>

        {/* Payment Method */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">Payment Method:</span>
            <select className="text-xs text-gray-400 bg-transparent border-0 outline-none">
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-full w-fit mx-auto">
            <button className="px-4 py-1 text-xs font-bold rounded-full bg-white text-gray-800 shadow-sm flex items-center gap-1">
              Credit <span className="bg-brand-green text-white text-[9px] px-1 rounded-full">3</span>
            </button>
            <button className="px-4 py-1 text-xs font-medium text-gray-400 rounded-full">Debit</button>
          </div>

          {/* Virtual Credit Card Display */}
          <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl p-5 shadow-lg h-40 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm italic">VISA</span>
              <CreditCardIcon size={20} className="text-white/80" />
            </div>
            <div>
              <p className="text-xs tracking-widest font-mono">4766 1901 **** 2751</p>
              <p className="text-[10px] text-white/70 mt-1">$ 24,235.2 <span className="text-[8px]">(USD)</span></p>
            </div>
            <div className="flex justify-between items-end text-[10px]">
              <span className="font-semibold uppercase">Stave Cruz</span>
              <span className="text-white/70">EXPIRES 05/26</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-brand-green font-semibold pt-1">
            <button className="flex items-center gap-1 hover:underline"><Edit size={12} /> Edit Card</button>
            <button className="flex items-center gap-1 hover:underline">+ Add Card</button>
          </div>
        </div>

        {/* Deposit Quick Actions */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="135" className="w-20 px-3 py-2 bg-gray-100 text-xs font-bold text-gray-800 rounded-lg outline-none" />
            <span className="text-[10px] text-gray-400">USD</span>
            <button className="flex-1 py-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg transition">
              Deposite
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-600">
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 50</div>
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 100</div>
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 150</div>
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 200</div>
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 250</div>
            <div className="bg-emerald-50 text-brand-green py-1.5 rounded-lg cursor-pointer">$ 300</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;

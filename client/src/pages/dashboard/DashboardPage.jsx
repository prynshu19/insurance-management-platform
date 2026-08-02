import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Car, Heart, Home, Plus, SlidersHorizontal, CheckCircle2, ShieldCheck,
  CreditCard as CreditCardIcon, ChevronLeft, ChevronRight, Edit, ArrowRightLeft,
  X, Check, DollarSign, Sparkles
} from "lucide-react";
import { getDashboardStats, getRecentActivities, getMonthlyRevenue } from "../../services/api";

const DashboardPage = () => {
  const [activeCoverageType, setActiveCoverageType] = useState("Auto Insurance");
  const [depositAmount, setDepositAmount] = useState("135");
  const [paymentMethod, setPaymentMethod] = useState("Credit");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Interactive coverage checklist states
  const [coverageItems, setCoverageItems] = useState([
    { id: 1, label: "Medical payments coverage", checked: true },
    { id: 2, label: "Collision coverage", checked: true },
    { id: 3, label: "Comprehensive coverage", checked: false },
    { id: 4, label: "Liability Coverage", checked: false },
    { id: 5, label: "underinsured motorist coverage", checked: false },
  ]);

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

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleCoverage = (id) => {
    setCoverageItems((items) =>
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeposit = () => {
    if (!depositAmount || isNaN(depositAmount)) return;
    triggerToast(`Successfully deposited $${depositAmount} USD to your account!`);
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-[#F7FFFE] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-brand-green" />
          {toastMessage}
        </div>
      )}

      {/* ── Main Dashboard Content ──────────────────────────────────── */}
      <div className="flex-1 min-w-0 p-6 lg:p-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">check and maintain your insurance status</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <button
              onClick={() => triggerToast("Sorting options opened")}
              className="flex items-center gap-1.5 hover:text-gray-900 transition"
            >
              <SlidersHorizontal size={14} /> Sort
            </button>
            <button
              onClick={() => triggerToast("Showing all active widgets")}
              className="flex items-center gap-1.5 text-gray-900 transition"
            >
              <CheckCircle2 size={14} className="text-brand-green" /> All widgets
            </button>
            <button
              onClick={() => triggerToast("Settings dialog coming soon")}
              className="flex items-center gap-1.5 hover:text-gray-900 transition"
            >
              <SlidersHorizontal size={14} /> Settings
            </button>
          </div>
        </div>

        {/* Section: Your Insurances */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Your Insurances</h2>
            <button onClick={() => triggerToast("Manage plans")} className="text-gray-400 hover:text-gray-600 font-bold">•••</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Auto Insurance */}
            <div
              onClick={() => setActiveCoverageType("Auto Insurance")}
              className={`bg-white rounded-2xl p-5 shadow-card border transition cursor-pointer flex flex-col justify-between h-36 ${
                activeCoverageType === "Auto Insurance" ? "border-brand-green/40 ring-2 ring-brand-green/20" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600 shadow-sm">
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
            <div
              onClick={() => setActiveCoverageType("Life Insurance")}
              className={`bg-white rounded-2xl p-5 shadow-card border transition cursor-pointer flex flex-col justify-between h-36 ${
                activeCoverageType === "Life Insurance" ? "border-pink-400/40 ring-2 ring-pink-400/20" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">Life Insurance</h3>
                </div>
              </div>
              <div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-pink-500 h-full w-[45%]" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-500">$ 1081 <span className="font-normal text-gray-400 text-[10px]">left</span></span>
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                </div>
              </div>
            </div>

            {/* Home Insurance */}
            <div
              onClick={() => setActiveCoverageType("Home Insurance")}
              className={`bg-white rounded-2xl p-5 shadow-card border transition cursor-pointer flex flex-col justify-between h-36 ${
                activeCoverageType === "Home Insurance" ? "border-indigo-400/40 ring-2 ring-indigo-400/20" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
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
            <div
              onClick={() => setShowAddPlanModal(true)}
              className="bg-[#FF4B4B] rounded-2xl p-5 shadow-card text-white flex items-center justify-center cursor-pointer hover:bg-[#E63939] transition h-36 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition">
                <Plus size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Family Insurance */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2">Family Insurance</h2>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold text-red-700">A</div>
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold text-blue-700">B</div>
                <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white overflow-hidden text-xs flex items-center justify-center font-bold text-green-700">C</div>
              </div>
              <button
                onClick={() => triggerToast("Invite family member")}
                className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-xs hover:bg-brand-red-dark transition"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg font-extrabold text-brand-green">$ 2,294.00</span>
            <button
              onClick={() => triggerToast("Transfer funds between accounts")}
              className="p-2 text-gray-400 hover:text-gray-600 transition"
            >
              <ArrowRightLeft size={17} />
            </button>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Top Up
            </button>
          </div>
        </div>

        {/* Section: Last requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Last requests</h2>
            <select className="text-xs font-semibold text-gray-500 bg-transparent border-0 outline-none cursor-pointer">
              <option>7 days</option>
              <option>30 days</option>
              <option>All time</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">colonoscopy</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Screening done and colonoscopy (examination of the inside of the large intestine with a flexible viewing ...<span onClick={() => triggerToast("Colonoscopy screening full report PDF downloaded")} className="text-brand-red font-semibold cursor-pointer hover:underline">more</span>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[11px] text-gray-400 font-medium">21 Files attached</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="text-xs font-medium text-gray-600">accepted</span>
                  <span className="text-xs font-bold text-brand-green bg-emerald-50 px-2 py-0.5 rounded-md">60%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">blood test</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                The test shows that the person has very few red blood cells (anemia). The same test is repeated after treatment ...<span onClick={() => triggerToast("Blood test complete lab results opened")} className="text-brand-red font-semibold cursor-pointer hover:underline">more</span>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[11px] text-gray-400 font-medium">5 Files attached</span>
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
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Statistic <span className="text-xs font-normal text-gray-400">(preview)</span></h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span> Income</span>
              <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span> Outcome</span>
            </div>
          </div>

          {/* Clean, well-proportioned CSS Bar Chart representing monthly statistics */}
          <div className="h-44 flex items-end justify-between px-2 pt-4 border-b border-gray-100">
            {[
              { month: "Jan", in: 60, out: 25 },
              { month: "Feb", in: 75, out: 40 },
              { month: "Mar", in: 90, out: 30 },
              { month: "Apr", in: 65, out: 20 },
              { month: "May", in: 85, out: 35 },
              { month: "Jun", in: 95, out: 25 },
              { month: "Jul", in: 70, out: 50 },
              { month: "Aug", in: 80, out: 30 },
              { month: "Sep", in: 75, out: 20 },
              { month: "Oct", in: 85, out: 45 },
              { month: "Nov", in: 90, out: 25 },
              { month: "Dec", in: 100, out: 35 },
            ].map((d) => (
              <div key={d.month} className="flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
                <div className="flex items-end gap-1 h-32">
                  <div
                    className="w-2.5 sm:w-3 bg-brand-green rounded-full group-hover:brightness-110 transition-all duration-300"
                    style={{ height: `${d.in}%` }}
                    title={`Income: $${d.in * 100}`}
                  />
                  <div
                    className="w-2.5 sm:w-3 bg-brand-red rounded-full group-hover:brightness-110 transition-all duration-300"
                    style={{ height: `${d.out}%` }}
                    title={`Outcome: $${d.out * 100}`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-2">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Right Panel Sidebar (Details & Payment) ──────────────────── */}
      <div className="w-full xl:w-[330px] shrink-0 bg-white border-l border-gray-100 p-6 flex flex-col justify-between shadow-sm space-y-6">
        
        <div>
          {/* Cover details header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h3 className="font-bold text-base text-gray-900">{activeCoverageType}</h3>
            <span
              onClick={() => triggerToast("Coverage panel collapsed")}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              ✕
            </span>
          </div>

          {/* Coverage Type List (Interactive Checkboxes) */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type:</p>
            <ul className="space-y-2.5 text-xs text-gray-700">
              {coverageItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => toggleCoverage(item.id)}
                  className="flex items-center justify-between cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 transition select-none"
                >
                  <span className={item.checked ? "font-semibold text-gray-800" : "text-gray-500"}>
                    {item.label}
                  </span>
                  {item.checked ? (
                    <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0"></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Payment Method:</span>
            <select className="text-xs font-semibold text-gray-500 bg-transparent border-0 outline-none cursor-pointer">
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div className="flex justify-center gap-1 bg-gray-100 p-1 rounded-full w-fit mx-auto">
            <button
              onClick={() => setPaymentMethod("Credit")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition flex items-center gap-1.5 ${
                paymentMethod === "Credit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Credit <span className="bg-brand-green text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">3</span>
            </button>
            <button
              onClick={() => setPaymentMethod("Debit")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition ${
                paymentMethod === "Debit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Debit
            </button>
          </div>

          {/* Virtual Credit Card Display */}
          <div className="relative bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-500 text-white rounded-2xl p-5 shadow-lg h-44 flex flex-col justify-between overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-base italic tracking-widest">VISA</span>
              <CreditCardIcon size={20} className="text-white/80" />
            </div>
            <div>
              <p className="text-sm tracking-widest font-mono font-bold">4766 1901 **** 2751</p>
              <p className="text-[11px] text-white/80 font-medium mt-1">$ 24,235.2 <span className="text-[9px] text-white/60">(USD)</span></p>
            </div>
            <div className="flex justify-between items-end text-[10px]">
              <span className="font-bold uppercase tracking-wider">Stave Cruz</span>
              <span className="text-white/80 font-mono">EXPIRES 05/26</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-brand-green font-bold pt-1">
            <button
              onClick={() => triggerToast("Edit virtual card details")}
              className="flex items-center gap-1 hover:underline"
            >
              <Edit size={13} /> Edit Card
            </button>
            <button
              onClick={() => triggerToast("Add new credit/debit card modal")}
              className="flex items-center gap-1 hover:underline"
            >
              + Add Card
            </button>
          </div>
        </div>

        {/* Deposit Quick Actions */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-20 px-3 py-2.5 bg-gray-100 text-xs font-bold text-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-red transition"
            />
            <span className="text-xs text-gray-500 font-semibold">USD</span>
            <button
              onClick={handleDeposit}
              className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              Deposite
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            {["50", "100", "150", "200", "250", "300"].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(amt)}
                className={`py-2 rounded-xl transition ${
                  depositAmount === amt
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-emerald-50 text-brand-green hover:bg-emerald-100"
                }`}
              >
                $ {amt}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="text-brand-green" size={20} /> Top Up Family Benefit
              </h3>
              <button onClick={() => setShowTopUpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Select or enter an amount to top up your Family Insurance Benefit Pool.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              {["500", "1000", "2500"].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    triggerToast(`Family pool topped up by $${val}.00!`);
                    setShowTopUpModal(false);
                  }}
                  className="py-3 bg-emerald-50 text-brand-green hover:bg-emerald-100 rounded-xl transition"
                >
                  + ${val}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTopUpModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add New Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add New Insurance Plan</h3>
              <button onClick={() => setShowAddPlanModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Explore our customized insurance packages with instant quote calculation.
            </p>
            <div className="space-y-2 text-xs">
              <div
                onClick={() => {
                  triggerToast("Travel Insurance coverage added to your wishlist");
                  setShowAddPlanModal(false);
                }}
                className="p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl cursor-pointer font-semibold flex justify-between items-center transition"
              >
                <span>✈️ Travel Protection Plan</span>
                <span className="text-brand-green">$25 / mo</span>
              </div>
              <div
                onClick={() => {
                  triggerToast("Business Comprehensive plan selected");
                  setShowAddPlanModal(false);
                }}
                className="p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl cursor-pointer font-semibold flex justify-between items-center transition"
              >
                <span>🏢 Business Comprehensive</span>
                <span className="text-brand-green">$120 / mo</span>
              </div>
            </div>
            <button
              onClick={() => setShowAddPlanModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

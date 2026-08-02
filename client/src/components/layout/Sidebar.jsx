import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, DollarSign, BarChart2,
  MessageSquare, LogOut, Shield, Users, FileText, AlertCircle, Sparkles, X, CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/policies", label: "Policies", icon: FileText },
  { to: "/claims", label: "Claims", icon: AlertCircle },
  { to: "/payments", label: "Payments", icon: DollarSign },
  { to: "/reports", label: "Statistic", icon: BarChart2 },
  { to: "/messages", label: "Messages", icon: MessageSquare },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("Personal");
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    triggerToast(`Searching system for "${searchQuery}"...`);
    setSearchQuery("");
  };

  return (
    <aside className="w-[240px] shrink-0 min-h-screen bg-white flex flex-col justify-between border-r border-gray-100 shadow-sm z-10 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-brand-green" />
          {toastMessage}
        </div>
      )}

      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center shadow-sm">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-tight">InsurCo</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF4B4B] flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Hi,</p>
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name || "Member"}</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="px-5 py-4">
          <div className="flex items-center gap-2.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl px-3.5 py-2.5 border border-gray-100 transition">
            <svg className="text-gray-400 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword..."
              className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder-gray-400"
            />
          </div>
        </form>

        {/* Navigation */}
        <nav className="px-4 py-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-3 mb-2">Menu</p>
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#E8FFF7] text-brand-green font-bold shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-brand-green" : "text-gray-400"} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        {/* Type Toggle */}
        <div className="px-6 pb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Type:</p>
          <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setAccountType("Personal");
                triggerToast("Switched to Personal workspace");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                accountType === "Personal"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountType("Business");
                triggerToast("Switched to Business workspace");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                accountType === "Business"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Business
            </button>
          </div>
        </div>

        {/* Family Insurance Promo Card */}
        <div className="mx-5 mb-5 p-4 bg-[#E8FFF7] rounded-2xl text-center border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-gray-800 leading-tight mb-1">Ideal Plan For Family Insurance</p>
          <button
            onClick={() => setShowPromoModal(true)}
            className="mt-1.5 text-xs text-brand-green font-bold hover:underline inline-flex items-center gap-1"
          >
            <Sparkles size={13} /> Learn More
          </button>
        </div>

        {/* Logout */}
        <div className="px-5 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-brand-red transition duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Promo Learn More Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Shield className="text-brand-green" size={20} /> Family Comprehensive Protection
              </h3>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our Family Insurance Plan covers medical payments, collision coverage, comprehensive property protection, and liability coverage for up to 6 family members with zero deductible on preventive checkups.
            </p>
            <div className="bg-emerald-50 p-4 rounded-xl text-xs text-brand-green font-semibold">
              ✨ Currently active on your account with $2,294.00 remaining annual benefit limit.
            </div>
            <button
              onClick={() => setShowPromoModal(false)}
              className="w-full py-3 bg-brand-green text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

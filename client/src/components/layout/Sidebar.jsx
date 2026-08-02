import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, DollarSign,
  BarChart2, MessageSquare, LogOut, Shield, Users, FileText, AlertCircle
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[220px] min-h-screen bg-white flex flex-col border-r border-gray-100 shadow-sm">

      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-[#00C48C] rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-800 text-base">InsurCo</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF4B4B] flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Hi,</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <svg className="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search keyword" className="bg-transparent text-xs text-gray-500 outline-none w-full placeholder-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest px-2 mb-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#E8FFF7] text-[#00C48C] font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className={isActive ? "text-[#00C48C]" : "text-gray-400"} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Type Toggle */}
      <div className="px-6 pb-4">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2">Type:</p>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-white text-gray-800 shadow-sm">Personal</button>
          <button className="flex-1 py-1.5 text-xs font-medium rounded-md text-gray-400 hover:bg-white/50 transition">Business</button>
        </div>
      </div>

      {/* Family Insurance Promo Card */}
      <div className="mx-4 mb-4 p-4 bg-[#E8FFF7] rounded-2xl text-center">
        <p className="text-xs font-semibold text-gray-700 leading-tight mb-1">Ideal Plan For Family Insurance</p>
        <button className="mt-2 text-xs text-[#00C48C] font-semibold underline">Learn More</button>
      </div>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-[#FF4B4B] transition"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const user = await login(data);
      navigate(user.role === "ADMIN" || user.role === "AGENT" ? "/dashboard" : "/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] px-4">
      <div className="w-full max-w-[820px] bg-white rounded-[2rem] shadow-modal flex overflow-hidden min-h-[480px]">

        {/* ── Left — Sign In Form ───────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sign in</h1>

          {apiError && (
            <div className="w-full mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[300px] space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-brand-green transition"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-brand-green transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-brand-red transition">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FF4B4B] hover:bg-[#E63939] text-white text-sm font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Sign In
            </button>
          </form>
        </div>

        {/* ── Right — Welcome Panel ─────────────────────── */}
        <div className="w-[340px] bg-gradient-to-br from-[#FF6B6B] to-[#FF4B4B] rounded-[2rem] flex flex-col items-center justify-center px-10 py-12 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">Hello, Friend!</h2>
          <p className="text-sm text-white/80 text-center leading-relaxed mb-8">
            Register with your personal details to use all of site features
          </p>
          <Link
            to="/register"
            className="px-8 py-3 border-2 border-white text-white text-sm font-bold rounded-lg uppercase tracking-wider hover:bg-white hover:text-[#FF4B4B] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

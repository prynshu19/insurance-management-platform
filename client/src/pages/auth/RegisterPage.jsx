import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      setApiError("");
      await registerUser(data);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] p-4 sm:p-6">
      <div className="w-full max-w-[860px] bg-white rounded-[2.5rem] shadow-modal flex flex-col md:flex-row overflow-hidden min-h-[520px]">

        {/* ── Left — Welcome Panel ──────────────────────── */}
        <div className="w-full md:w-[380px] bg-gradient-to-br from-[#FF6B6B] to-[#FF4B4B] rounded-[2.5rem] flex flex-col items-center justify-center p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-4 text-center tracking-tight">Welcome Back!</h2>
          <p className="text-sm text-white/90 text-center leading-relaxed mb-8 max-w-[260px] font-medium">
            Already have an account? Sign in to continue using all features.
          </p>
          <Link
            to="/login"
            className="px-9 py-3.5 border-2 border-white text-white text-sm font-extrabold rounded-xl uppercase tracking-wider hover:bg-white hover:text-brand-red shadow-sm transition duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* ── Right — Register Form ─────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Create Account</h1>

          {apiError && (
            <div className="w-full max-w-[320px] mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[320px] space-y-4">
            <div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
                  <User size={18} />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-100/90 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent outline-none focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition duration-200"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.name.message}</p>}
            </div>

            <div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
                  <Mail size={18} />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-100/90 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent outline-none focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition duration-200"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
                  <Lock size={18} />
                </span>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-100/90 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent outline-none focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-extrabold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition duration-200 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              Sign Up
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

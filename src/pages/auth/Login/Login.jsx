import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import SocialLogin from "../../../components/shared/Buttons/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import Logo from "../../../components/shared/Logo/Logo";

const Login = () => {
  const { emailPasswordLogin, loading, setLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    try {
      const result = await emailPasswordLogin(data.email, data.password);
      if (result?.user) {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-12 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 ring-1 ring-slate-200/50">
            <div className="card-body p-8 space-y-6">
                
                <h2 className="text-2xl font-bold text-center text-slate-900">Login</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input */}
                    <div className="form-control space-y-2">
                        <label className="label-text font-semibold text-slate-900 text-sm">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`input input-bordered w-full pl-11 h-12 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.email ? 'input-error' : ''}`}
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <span className="text-error text-xs mt-1 ml-1">{errors.email.message}</span>}
                    </div>

                    {/* Password Input */}
                    <div className="form-control space-y-2">
                         <div className="flex justify-between items-center">
                            <label className="label-text font-semibold text-slate-900 text-sm">
                                Password
                            </label>
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <FaLock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`input input-bordered w-full pl-11 pr-11 h-12 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.password ? 'input-error' : ''}`}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                             <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                        </div>
                        {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/30 border-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
                    </button>
                </form>

                <div className="divider text-sm text-slate-500">Or continue with</div>

                {/* Google Login (Using existing component logic, or wrapped for style) */}
                 <div className="w-full">
                    {/* Assuming SocialLogin renders a button, we might want to wrap or style it. 
                        If SocialLogin is custom, ideally we pass classNames. 
                        For now, let's wrap it in a container that forces full width if needed  */}
                    <div className="w-full [&_button]:w-full [&_button]:btn-outline [&_button]:h-12 [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-transparent [&_button]:hover:bg-slate-50">
                        <SocialLogin />
                    </div>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
             By signing in, you agree to our{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
};

export default Login;

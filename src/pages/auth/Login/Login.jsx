import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import SocialLogin from "../../../components/shared/Buttons/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import Logo from "../../../components/shared/Logo/Logo";
import SEO from "../../../components/SEO";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      <SEO title="Login" description="Sign in to your CoinTasker account to start earning." />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <div className="card glass-panel p-1">
            <div className="card-body p-8 space-y-6">
                
                <h2 className="text-2xl font-bold text-center text-slate-900">Sign In</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input */}
                    <div className="form-control space-y-2">
                        <label className="label-text font-medium text-slate-700">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`input input-bordered w-full pl-11 h-12 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.email ? 'input-error' : ''}`}
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
                            <label className="label-text font-medium text-slate-700">
                                Password
                            </label>
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary-focus hover:underline transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                <FaLock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`input input-bordered w-full pl-11 pr-11 h-12 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.password ? 'input-error' : ''}`}
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
                        className="btn btn-primary w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 border-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
                    </button>
                </form>

                <div className="divider text-sm text-slate-400 font-medium">Or continue with</div>

                {/* Google Login */}
                 <div className="w-full">
                    <div className="w-full [&_button]:w-full [&_button]:btn-outline [&_button]:h-12 [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-white [&_button]:hover:bg-slate-50 [&_button]:text-slate-700 [&_button]:hover:border-slate-300 [&_button]:transition-all">
                        <SocialLogin />
                    </div>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-primary hover:text-primary-focus hover:underline transition-colors">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
             By signing in, you agree to our{" "}
            <a href="#" className="font-medium text-slate-700 hover:text-primary hover:underline transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="font-medium text-slate-700 hover:text-primary hover:underline transition-colors">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
};

export default Login;

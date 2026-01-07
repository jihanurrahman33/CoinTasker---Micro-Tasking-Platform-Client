import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaImage, FaLock, FaSpinner } from "react-icons/fa";
import SocialLogin from "../../../components/shared/Buttons/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";
import useAxios from "../../../hooks/useAxios";
import Logo from "../../../components/shared/Logo/Logo";
import { useQueryClient } from "@tanstack/react-query";
import SEO from "../../../components/SEO";

const Register = () => {
    const queryClient = useQueryClient();
  const { loading, setLoading, createUser } = useAuth();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch("password", "");

  const getPasswordStrength = (pass) => {
    if (!pass) return null;
    if (pass.length < 6) return "weak";
    if (pass.length < 10) return "medium";
    return "strong";
  };
  
  const passwordStrength = getPasswordStrength(password);

  const getPasswordStrengthColor = () => {
     if (passwordStrength === "weak") return "bg-error";
     if (passwordStrength === "medium") return "bg-warning";
     return "bg-success";
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await createUser(data.email, data.password);
      
      if (result?.user) {
        await updateProfile(auth.currentUser, {
          displayName: data.name,
          photoURL: data.photoURL,
        });

        const userInfo = {
            name: data.name,
            email: data.email,
            photoURL: data.photoURL,
            role: data.role,
            
        };

        await axiosInstance.post("/users", userInfo);
        
        toast.success("Registration successful!");
        queryClient.invalidateQueries({
            queryKey: ["coinBalance"],
          }); 
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-8">
      <SEO title="Create Account" description="Join CoinTasker today and start earning rewards." />

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        {/* Header */}
         <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-secondary mb-2">Create Account</h1>
            <p className="text-slate-500">Start earning or managing tasks today</p>
        </div>

        {/* Register Card */}
        <div className="card glass-panel p-1">
            <div className="card-body p-8 space-y-4">
                 
                 <h2 className="text-2xl font-bold text-center text-secondary mb-2">Register</h2>

                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Name */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-medium text-slate-700">Full Name <span className="text-error">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"><FaUser /></div>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.name ? 'input-error' : ''}`}
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>
                        {errors.name && <span className="text-error text-xs mt-1 ml-1">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-medium text-slate-700">Email Address <span className="text-error">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"><FaEnvelope /></div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.email ? 'input-error' : ''}`}
                                aria-invalid={errors.email ? "true" : "false"}
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

                    {/* Profile Picture */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-medium text-slate-700">Profile Picture URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"><FaImage /></div>
                            <input
                                type="url"
                                placeholder="https://example.com/profile.jpg"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.photoURL ? 'input-error' : ''}`}
                                aria-invalid={errors.photoURL ? "true" : "false"}
                                {...register("photoURL", { required: "Profile picture URL is required" })}
                            />
                        </div>
                        {errors.photoURL && <span className="text-error text-xs mt-1 ml-1">{errors.photoURL.message}</span>}
                    </div>

                    {/* Role Selection */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-medium text-slate-700">Select Role <span className="text-error">*</span></label>
                        <select
                            className={`select select-bordered w-full h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.role ? 'select-error' : ''}`}
                            defaultValue=""
                            aria-invalid={errors.role ? "true" : "false"}
                            {...register("role", { required: "Please select a role" })}
                        >
                            <option value="" disabled>Choose your role</option>
                            <option value="worker">Worker (Earn Coins)</option>
                            <option value="buyer">Buyer (Create Tasks)</option>
                        </select>
                        {errors.role && <span className="text-error text-xs mt-1 ml-1">{errors.role.message}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-control space-y-1">
                         <label className="label-text font-medium text-slate-700">Password <span className="text-error">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"><FaLock /></div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className={`input input-bordered w-full pl-11 pr-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.password ? 'input-error' : ''}`}
                                aria-invalid={errors.password ? "true" : "false"}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min 6 chars" },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                                        message: "Must contain uppercase, lowercase, number, special char"
                                    }
                                })}
                            />
                             <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                        </div>
                        {/* Strength Indicator */}
                        {passwordStrength && (
                            <div className="flex gap-1 mt-1 h-1 w-full opacity-80">
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-slate-200'}`}></div>
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-slate-200'}`}></div>
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-slate-200'}`}></div>
                            </div>
                        )}
                        {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
                    </div>
                    
                    {/* Confirm Password */}
                    <div className="form-control space-y-1">
                         <label className="label-text font-medium text-slate-700">Confirm Password <span className="text-error">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"><FaLock /></div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className={`input input-bordered w-full pl-11 pr-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.confirmPassword ? 'input-error' : ''}`}
                                aria-invalid={errors.confirmPassword ? "true" : "false"}
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: (val) => {
                                        if (watch("password") != val) {
                                            return "Your passwords do not match";
                                        }
                                    } 
                                })}
                            />
                             <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                        </div>
                         {errors.confirmPassword && <span className="text-error text-xs mt-1 ml-1">{errors.confirmPassword.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary-gradient w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/40 border-none mt-2 transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : "Create Account"}
                    </button>

                 </form>

                <div className="divider text-sm text-slate-400 font-medium my-4">Or continue with</div>

                <div className="w-full [&_button]:w-full [&_button]:btn-outline [&_button]:h-12 [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-white [&_button]:hover:bg-slate-50 [&_button]:text-slate-700 [&_button]:hover:border-slate-300 [&_button]:transition-all">
                    <SocialLogin />
                </div>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary-focus hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
        
         <p className="mt-8 text-center text-sm text-slate-500">
             By creating an account, you agree to our{" "}
            <a href="#" className="font-medium text-slate-700 hover:text-primary hover:underline transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="font-medium text-slate-700 hover:text-primary hover:underline transition-colors">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
};

export default Register;

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-12 relative overflow-hidden">
        
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        {/* Header */}
         <div className="text-center mb-8">
             <div className="flex justify-center mb-6">
                <Logo />
             </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Start earning or managing tasks today</p>
        </div>

        {/* Register Card */}
        <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 ring-1 ring-slate-200/50">
            <div className="card-body p-8 space-y-4">
                 
                 <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Register</h2>

                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Name */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-semibold text-slate-900 text-sm">Full Name <span className="text-error">*</span></label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><FaUser /></div>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.name ? 'input-error' : ''}`}
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>
                        {errors.name && <span className="text-error text-xs mt-1 ml-1">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-semibold text-slate-900 text-sm">Email Address <span className="text-error">*</span></label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><FaEnvelope /></div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.email ? 'input-error' : ''}`}
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
                        <label className="label-text font-semibold text-slate-900 text-sm">Profile Picture URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><FaImage /></div>
                            <input
                                type="url"
                                placeholder="https://example.com/profile.jpg"
                                className={`input input-bordered w-full pl-11 h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.photoURL ? 'input-error' : ''}`}
                                {...register("photoURL", { required: "Profile picture URL is required" })}
                            />
                        </div>
                        {errors.photoURL && <span className="text-error text-xs mt-1 ml-1">{errors.photoURL.message}</span>}
                    </div>

                    {/* Role Selection */}
                    <div className="form-control space-y-1">
                        <label className="label-text font-semibold text-slate-900 text-sm">Select Role <span className="text-error">*</span></label>
                        <select
                            className={`select select-bordered w-full h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.role ? 'select-error' : ''}`}
                            defaultValue=""
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
                         <label className="label-text font-semibold text-slate-900 text-sm">Password <span className="text-error">*</span></label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><FaLock /></div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className={`input input-bordered w-full pl-11 pr-11 h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.password ? 'input-error' : ''}`}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min 6 chars" },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                                        message: "Must contain uppercase, lowercase, number, special char"
                                    }
                                })}
                            />
                             <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                        </div>
                        {/* Strength Indicator */}
                        {passwordStrength && (
                            <div className="flex gap-1 mt-1 h-1 w-full">
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-base-200'}`}></div>
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-base-200'}`}></div>
                                <div className={`h-full rounded-full transition-all duration-300 w-1/3 ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-base-200'}`}></div>
                            </div>
                        )}
                        {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
                    </div>
                    
                    {/* Confirm Password */}
                    <div className="form-control space-y-1">
                         <label className="label-text font-semibold text-slate-900 text-sm">Confirm Password <span className="text-error">*</span></label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><FaLock /></div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className={`input input-bordered w-full pl-11 pr-11 h-11 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${errors.confirmPassword ? 'input-error' : ''}`}
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: (val) => {
                                        if (watch("password") != val) {
                                            return "Your passwords do not match";
                                        }
                                    } 
                                })}
                            />
                             <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                        </div>
                         {errors.confirmPassword && <span className="text-error text-xs mt-1 ml-1">{errors.confirmPassword.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/30 border-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white mt-2"
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : "Create Account"}
                    </button>

                 </form>

                <div className="divider text-sm text-slate-500 my-4">Or continue with</div>

                <div className="w-full [&_button]:w-full [&_button]:btn-outline [&_button]:h-12 [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-transparent [&_button]:hover:bg-slate-50">
                    <SocialLogin />
                </div>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
        
         <p className="mt-8 text-center text-sm text-slate-500">
             By creating an account, you agree to our{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
};

export default Register;

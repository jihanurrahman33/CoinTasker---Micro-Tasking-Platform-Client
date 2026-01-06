import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";
import { 
  FaCoins, 
  FaDollarSign, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaCreditCard, 
  FaWallet, 
  FaSpinner,
  FaMoneyCheckAlt
} from "react-icons/fa";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [coinsToWithdraw, setCoinsToWithdraw] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch Worker Stats to get current Coin Balance
  const { data: stats = { totalCoins: 0 }, isLoading: statsLoading, refetch } = useQuery({
    queryKey: ["workerStatsForWithdrawal", user?.email],
    queryFn: async () => {
        // Reusing the worker stats endpoint logic
      const res = await axiosSecure.get(`/worker/stats?email=${user.email}`);
      // Mapping the response to ensure we have the correct coin field. 
      // Based on WorkerHome, totalEarnings seems to be the total accumulated, 
      // but typically withdrawals depend on currently *available* coins.
      // Assuming the API returns the user object or stats with a 'coins' or 'available_coins' field.
      // If the stats endpoint returns totalEarnings, we might need a specific user endpoint for *current balance*.
      // Let's check /users typically returns user data including coin balance.
      // Let's fetch user data specifically for balance to be safe.
      const userRes = await axiosSecure.get(`/users/${user.email}`);
      return { totalCoins: userRes.data.coin }; 
    },
    enabled: !!user?.email,
  });

  const userCoins = stats.totalCoins || 0;
  const withdrawalAmountInDollars = userCoins / 20;
  const hasMinimumCoins = userCoins >= 200;

  // Calculate withdrawal amount when coins change
  useEffect(() => {
    const coins = parseFloat(coinsToWithdraw) || 0;
    setWithdrawAmount(coins / 20); // 20 coins = 1 dollar
  }, [coinsToWithdraw]);

  const validateForm = () => {
    const newErrors = {};

    if (!coinsToWithdraw || parseFloat(coinsToWithdraw) <= 0) {
      newErrors.coinsToWithdraw = "Please enter a valid amount";
    } else if (parseFloat(coinsToWithdraw) > userCoins) {
      newErrors.coinsToWithdraw = "Cannot exceed your available coins";
    } else if (parseFloat(coinsToWithdraw) < 200) {
      newErrors.coinsToWithdraw = "Minimum withdrawal is 200 coins ($10)";
    }

    if (!paymentSystem) {
      newErrors.paymentSystem = "Please select a payment system";
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter your account number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const withdrawalData = {
      worker_email: user.email,
      worker_name: user.displayName,
      withdrawal_coin: parseFloat(coinsToWithdraw),
      withdrawal_amount: withdrawAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
    };

    try {
        const res = await axiosSecure.post("/withdrawals", withdrawalData);
        if (res.data.insertedId) {
          queryClient.invalidateQueries({
            queryKey: ["workerStatsForWithdrawal", user?.email],
          }); 
          queryClient.invalidateQueries({
            queryKey: ["coinBalance", user?.email],
          }); 
            setShowSuccess(true);
            setCoinsToWithdraw("");
            setPaymentSystem("");
            setAccountNumber("");
            setErrors({});
            // Optional: Refetch stats to update balance if immediate, but usually balance updates on approval.
            // But if we want to prevent double withdrawal, frontend state won't update until backend processes it?
            // Usually balance is deducted upon approval (AdminHome logic), so balance stays same for now.
             Swal.fire({
                position: "center",
                icon: "success",
                title: "Request Submitted!",
                text: "Your withdrawal request is pending approval.",
                showConfirmButton: false,
                timer: 2000
            });
            setTimeout(() => setShowSuccess(false), 5000);
        }
    } catch (error) {
        console.error("Withdrawal failed", error);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error.response?.data?.message || 'Something went wrong!',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (statsLoading) {
     return (
        <div className="flex justify-center items-center h-screen bg-indigo-50/30">
            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Withdraw Earnings
          </h1>
          <p className="text-gray-600 text-lg">Convert your coins to real money</p>
        </div>

        {/* Success Message Banner */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
            <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-bold">Withdrawal Request Submitted!</p>
              <p className="text-green-600 text-sm">
                Your request is pending admin approval. You'll be notified once processed.
              </p>
            </div>
          </div>
        )}

        {/* User Total Earnings Cards */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-50 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaWallet className="text-indigo-600" /> Your Balance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Coins */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                  <FaCoins className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Available Coins</p>
                  <p className="text-4xl font-bold">{userCoins}</p>
                </div>
              </div>
              <div className="h-px bg-white/20 my-4"></div>
              <p className="text-indigo-100 text-xs font-medium">Total earnings available for withdrawal</p>
            </div>

            {/* Withdrawal Amount in Dollars */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                  <FaDollarSign className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">Dollar Equivalent</p>
                  <p className="text-4xl font-bold">${withdrawalAmountInDollars.toFixed(2)}</p>
                </div>
              </div>
              <div className="h-px bg-white/20 my-4"></div>
              <p className="text-green-100 text-xs font-medium">20 coins = $1 (Current Rate)</p>
            </div>
          </div>

          {/* Minimum Withdrawal Info */}
          <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
            <FaExclamationCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-indigo-900 font-bold text-sm">Minimum Withdrawal Requirement</p>
              <p className="text-indigo-700 text-sm mt-1">
                You need at least <span className="font-bold">200 coins</span> (equivalent to $10) to make a withdrawal request.
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form Section */}
        {hasMinimumCoins ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6 animate-fade-in-up delay-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaMoneyCheckAlt className="text-indigo-600" /> Withdrawal Request
            </h2>

            {/* Coins to Withdraw */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Coins to Withdraw <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <FaCoins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={coinsToWithdraw}
                  onChange={(e) => setCoinsToWithdraw(e.target.value)}
                  placeholder="Enter amount (min 200)"
                  className={`input input-bordered w-full pl-12 h-12 text-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.coinsToWithdraw ? "input-error bg-red-50" : "border-gray-300"
                  }`}
                  min="200"
                  max={userCoins}
                />
              </div>
              {errors.coinsToWithdraw && (
                <label className="label">
                    <span className="label-text-alt text-red-600 flex items-center gap-1"><FaExclamationCircle/> {errors.coinsToWithdraw}</span>
                </label>
              )}
              <label className="label">
                 <span className="label-text-alt text-gray-500">Max available: {userCoins} coins</span>
              </label>
            </div>

            {/* Withdrawal Amount in Dollars (Read-only) */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Withdrawal Amount ($)</span>
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={withdrawAmount.toFixed(2)}
                  readOnly
                  className="input input-bordered w-full pl-12 h-12 text-lg font-bold text-green-600 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <label className="label">
                 <span className="label-text-alt text-gray-500">Auto-calculated (20 coins = $1)</span>
              </label>
            </div>

            {/* Payment System Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Select Payment System <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value)}
                  className={`select select-bordered w-full pl-12 h-12 text-base focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.paymentSystem ? "select-error bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>Choose a payment method</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Nagad">Nagad</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              {errors.paymentSystem && (
                <label className="label">
                    <span className="label-text-alt text-red-600 flex items-center gap-1"><FaExclamationCircle/> {errors.paymentSystem}</span>
                </label>
              )}
            </div>

            {/* Account Number */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Account Number <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  className={`input input-bordered w-full pl-12 h-12 text-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.accountNumber ? "input-error bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.accountNumber && (
                <label className="label">
                    <span className="label-text-alt text-red-600 flex items-center gap-1"><FaExclamationCircle/> {errors.accountNumber}</span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-block h-14 bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaDollarSign /> Submit Withdrawal Request
                </span>
              )}
            </button>

            {/* Additional Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <FaExclamationCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-bold text-sm">Processing Time</p>
                <p className="text-amber-800 text-sm mt-1">
                  Withdrawal requests are typically reviewed and processed by admin within 2-3 business days.
                </p>
              </div>
            </div>
          </form>
        ) : (
          <div
            className="bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center animate-fade-in-up"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-50 rounded-full">
                <FaExclamationCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Coins</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need at least <span className="font-bold text-indigo-600">200 coins ($10)</span> to make a withdrawal. You currently have{" "}
              <span className="font-bold text-indigo-600">{userCoins} coins</span>.
            </p>
            
            <Link
              to="/dashboard/task-list"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaCoins className="w-5 h-5" />
              Browse Details Tasks for Earnings
            </Link>
          </div>
        )}

        {/* Business Logic Info */}
        <div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white animate-fade-in-up delay-200 relative overflow-hidden"
        >
             <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-300"/> How Withdrawals Work
          </h3>
          <ul className="space-y-3 text-indigo-100">
            <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md">
              <FaCheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-300" />
              <span>Workers earn coins by completing tasks (paid by buyers at 10 coins = $1)</span>
            </li>
            <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md">
              <FaCheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-300" />
              <span>Workers can withdraw at a rate of <strong>20 coins = $1</strong></span>
            </li>
            <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md">
              <FaCheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-300" />
              <span>Minimum withdrawal threshold is <strong>200 coins ($10)</strong></span>
            </li>
            <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md">
              <FaCheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-300" />
              <span>All withdrawals are processed securely by admin within 2-3 business days</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Withdrawals;

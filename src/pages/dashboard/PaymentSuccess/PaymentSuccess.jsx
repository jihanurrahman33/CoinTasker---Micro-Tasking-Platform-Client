import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCheckCircle, FaExclamationTriangle, FaHome, FaSpinner, FaCoins } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const PaymentSuccess = () => {
    const {user}=useAuth();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
                if (res.data.success) {
                    setPaymentData(res.data);
                    setStatus("success");
                    queryClient.invalidateQueries({
                        queryKey: ["coinBalance", user?.email],
                      }); 
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error("Payment verification failed", error);
                // If it's already processed, the backend might return success=true or specific message
                // Based on provided backend code: if(alreadyPaid) returns success: true, message: "Payment already processed"
                if (error.response?.data?.transactionId) {
                     setPaymentData(error.response.data); // Or handle "already processed" as success
                     setStatus("success");
                } else {
                    setStatus("error");
                }
            }
        };

        verifyPayment();
    }, [sessionId, axiosSecure]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="card glass-panel p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
                 {/* Background decoration */}
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-primary"></div>

                {status === "loading" && (
                    <div className="py-12 flex flex-col items-center">
                        <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
                        <p className="text-secondary font-medium">Verifying your payment...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-fade-in-up">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                            <FaCheckCircle className="text-5xl text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-secondary mb-2">Payment Successful!</h2>
                        <p className="text-slate-500 mb-8">
                            Thank you for your purchase. Your account has been credited.
                        </p>

                         {paymentData && (
                            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 shadow-inner">
                                <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Transaction ID</p>
                                <p className="font-mono text-xs text-slate-600 break-all bg-white p-3 rounded-lg border border-slate-200 shadow-sm mb-4">
                                    {paymentData.transactionId}
                                </p>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-slate-600 font-medium">Coins Added</span>
                                    <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
                                        <FaCoins className="text-amber-500 text-xl" />
                                        +{paymentData.coinAdded}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Link 
                            to="/dashboard" 
                            className="btn btn-primary-gradient w-full text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all border-none text-lg h-12"
                        >
                            <FaHome className="mr-2" /> Return to Dashboard
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-fade-in-up">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                            <FaExclamationTriangle className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-secondary mb-2">Payment Failed</h2>
                        <p className="text-slate-500 mb-8">
                            We couldn't verify your payment. Please contact support if you believe this is an error.
                        </p>
                        <Link to="/dashboard/purchase-coin" className="btn btn-outline btn-error w-full h-12">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;

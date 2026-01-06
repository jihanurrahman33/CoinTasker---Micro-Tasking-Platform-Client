import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCheckCircle, FaExclamationTriangle, FaHome, FaSpinner } from "react-icons/fa";

const PaymentSuccess = () => {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
                 {/* Background decoration */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

                {status === "loading" && (
                    <div className="py-12 flex flex-col items-center">
                        <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Verifying your payment...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <FaCheckCircle className="text-5xl text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-8">
                            Thank you for your purchase. Your account has been credited.
                        </p>

                         {paymentData && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                                <p className="font-mono text-xs text-gray-800 break-all bg-white p-2 rounded border border-gray-200">
                                    {paymentData.transactionId}
                                </p>
                                <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-3">
                                    <span className="text-gray-600 font-medium">Coins Added</span>
                                    <span className="text-xl font-bold text-indigo-600">+{paymentData.coinAdded}</span>
                                </div>
                            </div>
                        )}

                        <Link 
                            to="/dashboard" 
                            className="btn btn-primary w-full shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                        >
                            <FaHome className="mr-2" /> Return to Dashboard
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-fade-in-up">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaExclamationTriangle className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
                        <p className="text-gray-500 mb-8">
                            We couldn't verify your payment. Please contact support if you believe this is an error.
                        </p>
                        <Link to="/dashboard/purchase-coin" className="btn btn-outline w-full">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;

import React from "react";
import { Link } from "react-router";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
             <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
                 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle className="text-5xl text-red-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
                 <p className="text-gray-500 mb-8">
                     You have cancelled the payment process. No charges were made to your account.
                 </p>
                 <Link 
                    to="/dashboard/purchase-coin" 
                    className="btn btn-primary w-full"
                >
                    <FaArrowLeft className="mr-2" /> Return to Purchase
                </Link>
             </div>
        </div>
    );
};

export default PaymentCancelled;

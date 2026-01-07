import React from "react";
import { Link } from "react-router";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
             <div className="card glass-panel p-8 max-w-md w-full text-center shadow-xl">
                 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 animate-fade-in-down">
                    <FaTimesCircle className="text-5xl text-red-500" />
                 </div>
                 <h2 className="text-3xl font-bold font-heading text-secondary mb-2">Payment Cancelled</h2>
                 <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                     You have cancelled the payment process. No charges were made to your account.
                 </p>
                 <Link 
                    to="/dashboard/purchase-coin" 
                    className="btn btn-primary-gradient w-full text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all border-none text-lg h-12"
                >
                    <FaArrowLeft className="mr-2" /> Return to Purchase
                </Link>
             </div>
        </div>
    );
};

export default PaymentCancelled;

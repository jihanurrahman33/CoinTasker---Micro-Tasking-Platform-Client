import React, { useState } from "react";
import { FaCoins, FaShoppingCart, FaShieldAlt, FaBolt, FaCheck } from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const PurchaseCoin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loadingId, setLoadingId] = useState(null);

  const purchaseOptions = [
    { coins: 10, price: 1, id: 1, name: "Starter Pack", color: "from-slate-400 to-slate-600", badge: "bg-slate-100 text-slate-700" },
    { coins: 150, price: 10, id: 2, name: "Value Pack", color: "from-emerald-400 to-emerald-600", badge: "bg-emerald-100 text-emerald-700", recommended: true },
    { coins: 500, price: 20, id: 3, name: "Pro Pack", color: "from-amber-400 to-amber-600", badge: "bg-amber-100 text-amber-700" },
    { coins: 1000, price: 35, id: 4, name: "Elite Pack", color: "from-primary to-indigo-600", badge: "bg-primary/10 text-primary" },
  ];

  const handleBuy = async (option) => {
    setLoadingId(option.id);
    const purchaseData = {
      cost: option.price,
      packageName: option.name,
      buyerEmail: user?.email,
      coinAmount: option.coins,
    };

    try {
      const { data } = await axiosSecure.post(
        "/create-checkout-session",
        purchaseData
      );
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      // You might want to show a toast here
    } finally {
        setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in-down">
          <h2 className="text-4xl font-bold font-heading text-secondary mb-4">
            Purchase Coins
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Boost your account functionality by purchasing coins. Secure payment via Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {purchaseOptions.map((option, index) => (
            <div
              key={option.id}
              className={`group relative card glass-panel overflow-hidden transition-all duration-500 hover:-translate-y-2 border-slate-200 ${option.recommended ? 'ring-2 ring-emerald-400 shadow-xl scale-105 md:scale-105 z-10' : 'hover:shadow-2xl'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
             {option.recommended && (
                 <div className="absolute top-0 inset-x-0 bg-emerald-500 text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
                     Most Popular
                 </div>
             )}
              
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.color} opacity-10 rounded-bl-full z-0 transition-transform group-hover:scale-110`} />
              
              <div className={`p-8 flex flex-col items-center relative z-10 h-full ${option.recommended ? 'pt-10' : ''}`}>
                <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <FaCoins className="text-3xl" />
                </div>

                <h3 className="text-xl font-bold text-secondary mb-2">{option.name}</h3>
                <div className="text-4xl font-black text-secondary mb-2 tracking-tight flex items-start">
                  <span className="text-2xl mt-1 text-slate-400 font-medium">$</span>{option.price}
                </div>
                <div className={`px-4 py-1.5 rounded-full mb-6 ${option.badge}`}>
                    <span className="font-bold text-sm">{option.coins} Coins</span>
                </div>

                <ul className="text-sm text-slate-500 space-y-3 mb-8 w-full">
                    <li className="flex items-center gap-2">
                        <FaBolt className={`text-xs ${option.recommended ? 'text-emerald-500' : 'text-slate-400'}`} />
                        Instant Crediting
                    </li>
                    <li className="flex items-center gap-2">
                        <FaShieldAlt className={`text-xs ${option.recommended ? 'text-emerald-500' : 'text-slate-400'}`} />
                        Secure Payment
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheck className={`text-xs ${option.recommended ? 'text-emerald-500' : 'text-slate-400'}`} />
                        No Hidden Fees
                    </li>
                </ul>

                <button
                  onClick={() => handleBuy(option)}
                  disabled={loadingId === option.id}
                  className={`w-full mt-auto py-3.5 px-6 rounded-xl text-white font-bold shadow-lg transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 group bg-gradient-to-r ${option.color} hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {loadingId === option.id ? (
                     <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                         <FaShoppingCart className="group-hover:mr-1 transition-all" />
                         Buy Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoin;

import React, { useState } from "react";
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const PurchaseCoin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loadingId, setLoadingId] = useState(null);

  const purchaseOptions = [
    { coins: 10, price: 1, id: 1, name: "Starter Pack" },
    { coins: 150, price: 10, id: 2, name: "Value Pack" },
    { coins: 500, price: 20, id: 3, name: "Pro Pack" },
    { coins: 1000, price: 35, id: 4, name: "Elite Pack" },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in-down">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Purchase Coins
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Boost your account functionality by purchasing coins. Secure payment via Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {purchaseOptions.map((option, index) => (
            <div
              key={option.id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-indigo-50 overflow-hidden hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full z-0 transition-transform group-hover:scale-110" />
              
              <div className="p-8 flex flex-col items-center relative z-10 h-full">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors shadow-sm">
                  <FaCoins className="text-4xl text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{option.name}</h3>
                <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                  <span className="text-2xl align-top text-gray-500 font-medium">$</span>{option.price}
                </div>
                <div className="px-4 py-1.5 bg-indigo-50 rounded-full mb-6">
                    <span className="font-bold text-indigo-700">{option.coins} Coins</span>
                </div>

                <ul className="text-sm text-gray-500 space-y-3 mb-8 w-full">
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Instant Crediting
                    </li>
                    <li className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Secure Transaction
                    </li>
                    <li className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        No Hidden Fees
                    </li>
                </ul>

                <button
                  onClick={() => handleBuy(option)}
                  disabled={loadingId === option.id}
                  className="w-full mt-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
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

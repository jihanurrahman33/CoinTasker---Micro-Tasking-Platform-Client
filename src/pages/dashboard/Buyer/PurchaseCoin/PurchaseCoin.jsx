import React from "react";
import { FaCoins } from "react-icons/fa";

const PurchaseCoin = () => {
  const purchaseOptions = [
    { coins: 10, price: 1, id: 1 },
    { coins: 150, price: 10, id: 2 },
    { coins: 500, price: 20, id: 3 },
    { coins: 1000, price: 35, id: 4 },
  ];

  return (
    <div className="p-4 w-full">
      <h2 className="text-3xl font-bold mb-8 text-center">Purchase Coins</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {purchaseOptions.map((option) => (
          <div key={option.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
            <div className="card-body items-center text-center">
              <div className="p-4 rounded-full bg-primary/10 mb-2">
                 <FaCoins className="text-4xl text-primary" />
              </div>
              <h2 className="card-title text-2xl font-bold">{option.coins} Coins</h2>
              <p className="text-base-content/70">Get {option.coins} coins for just</p>
              <div className="text-3xl font-extrabold text-secondary my-4">
                ${option.price}
              </div>
              <div className="card-actions w-full">
                <button className="btn btn-primary w-full">
                   Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCoin;

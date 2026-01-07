import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-ring loading-xl" role="status" aria-label="Loading"></span>
    </div>
  );
};

export default Loading;

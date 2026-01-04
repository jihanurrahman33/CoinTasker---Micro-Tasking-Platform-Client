import React from "react";
import useRole from "../../hooks/useRole";

const Home = () => {
  const { role } = useRole();
  return <div>Hello From Home Page</div>;
};

export default Home;

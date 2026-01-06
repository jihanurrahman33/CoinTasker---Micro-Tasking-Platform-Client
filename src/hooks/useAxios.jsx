import axios from "axios";
import React from "react";
const instance = axios.create({
  baseURL: "https://coin-tasker-server-rho.vercel.app",
});

const useAxios = () => {
  return instance;
};

export default useAxios;

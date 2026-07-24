import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/v1/auth/signin", {
    username,
    password,
  });

  return response.data;
};

export const verifyOtp = async (code) => {
  const phone = localStorage.getItem("phone");
  const response = await api.post("/v1/auth/verify-otp", {
    type: "phone",
    username: phone,
    code,
  });
  return response.data;
};
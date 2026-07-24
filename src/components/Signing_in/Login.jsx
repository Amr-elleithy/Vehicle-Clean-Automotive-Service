import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api_contents/auth";

function Login() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      localStorage.setItem("phone", response.data.phone);
      navigate("/otp");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {" "}
          Welcome Back{" "}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {" "}
          Sign in to your account{" "}
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            value={username}
            onChange={(e) => setusername(e.target.value)}
            type="text"
            placeholder="username"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition duration-200 shadow-lg"
          >
            {" "}
            Login{" "}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

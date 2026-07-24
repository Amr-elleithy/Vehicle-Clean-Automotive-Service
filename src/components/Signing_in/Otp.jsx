import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { verifyOtp } from "../../api_contents/auth";

function Otp() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [enterOtp, setEnterOtp] = useState(["", "", "", ""]);
  const handleVerify = async (e) => {
    e.preventDefault();
    const code = enterOtp.join("");
    try {
      const response = await verifyOtp(code);
      console.log(response);
      localStorage.setItem("auth_token", response.data.access_token);
      navigate("/home");
    } catch (error) {
      console.log("Full error:", error);
      console.log("Response:", error.response?.data);
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...enterOtp];
    newOtp[index] = value;
    setEnterOtp(newOtp);

    if (value && index < enterOtp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !enterOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          OTP Verification
        </h1>

        <p className="text-center text-gray-500 mb-6">Enter the 4-digit OTP</p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex justify-center gap-3">
            {enterOtp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 border rounded-xl text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Otp;

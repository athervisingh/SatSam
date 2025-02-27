import { useState } from "react";
import { sendPasswordReset } from "../../../utils/firebase/firebase.utils";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordReset(email);
      setMessageType("success");
      setMessage(
        `A password reset link has been sent to ${email}. Please check your email, reset your password, and try again later.`
      );
    } catch (error) {
      setMessageType("error");
      setMessage("Failed to send password reset email. Please try again.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-8 bg-auth-bg rounded-lg shadow-xl mt-28">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-auth-hover-prevBtn"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-auth-head-text flex-grow text-center">
          Reset Password
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-auth-label"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-2 bg-auth-inpBg border border-auth-inpBor rounded-md focus:outline-none focus:ring-2 focus:ring-auth-focRing"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-auth-whiteText bg-auth-SBtn rounded-md hover:bg-auth-hover-focRing focus:outline-none focus:ring-2 focus:ring-auth-focRing"
        >
          Send Reset Email
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-4 text-sm rounded-md ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2" />
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

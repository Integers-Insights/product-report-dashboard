import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useEffect } from "react";

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    if (authToken) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Email Verified
        </h2>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now login to your
          account.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-[#0284C7] text-white py-2 rounded-lg hover:bg-[#0273AE] transition duration-300 font-medium cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;

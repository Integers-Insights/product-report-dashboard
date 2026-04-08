import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const FailedVerification = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <RxCross1 className="text-red-500 w-14 h-14 font-bold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Email verification failed
                </h2>
                <p className="text-gray-600 mb-6">
                    Your email verification link has been expired.
                </p>
                <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-[#0284C7] text-white py-2 rounded-lg hover:bg-[#0273AE] transition duration-300 font-medium cursor-pointer"
                >
                    Signup again
                </button>
            </div>
        </div>
    );
};

export default FailedVerification;

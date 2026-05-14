import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-[120px] font-bold text-gray-400 leading-none">404</h1>

      <h2 className="text-3xl font-semibold mt-4 text-gray-400">
        Page Not Found
      </h2>

      <p className="text-slate-400 mt-2 text-center max-w-md">
        Oops! The page you're looking for doesn’t exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-[#0284C7] text-white font-medium rounded-lg 
                   hover:bg-[#1392d2] transition duration-300 cursor-pointer shadow-lg"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default Error;

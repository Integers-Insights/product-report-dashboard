import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="min-h-[calc(100vh-84px)] flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-8xl font-extrabold text-primary">
        404
      </h1>
      <p className="mt-4 text-xl font-semibold text-primary">
        Page Not Found
      </p>
      <p className="mt-2 text-center text-primary max-w-md">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <Link
        to={"/"}
        className="mt-6 inline-block rounded-lg bg-green-500 px-6 py-3 text-white font-medium shadow-md hover:bg-green-600 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;

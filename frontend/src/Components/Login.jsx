import { LuChevronDown } from "react-icons/lu";
import Int_Logo from "../assets/Int_Logo_Main_Fav.png";
import login_img from "../assets/login.jpg";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { base_url1 } from "../URL";
import toast from "react-hot-toast";

const UserLogin = () => {
  const navigate = useNavigate();

  const [eyeButton, setEyeButton] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError(true);
      toast.error("Email and password are required");
      return;
    }

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("White space is not allowed");
      return;
    }

    setError(false);
    setLoading(true);

    const payload = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    try {
      const response = await fetch(`${base_url1}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // if (!response.ok) {
      //     toast.error(data.detail || "Login failed");
      //     return;
      // }

      // console.log(data);

      if (data.success) {
        toast.success(data.message || "Login successful");
        localStorage.setItem("VZyHRIoNN3m)OXhGwCtC", data.access_token);
        localStorage.setItem("CtKoIC)iR1SP)5mr&R4d", JSON.stringify(data.user));
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.error(data.detail || "Invalid credentials");
      }

      // if (data.success) {
      //     toast.success(data.message || "Login successful");
      //     if (data.token) {
      //         localStorage.setItem("token", data.token);
      //     }
      //     setFormData({
      //         email: "",
      //         password: ""
      //     });

      //     navigate("/dashboard");
      // } else {
      //     toast.error(data.detail || "Invalid credentials");
      // }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full m-auto">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img alt="Int_Logo" src={Int_Logo} className="h-10 w-auto" />
              <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-0.5">
                <div className="h-23">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email address <sup>*</sup>
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 
  ${
    error && !formData.email
      ? "outline-red-500 focus:outline-red-500"
      : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
  }
  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                  </div>
                  {error && !formData.email && (
                    <p className="text-red-500 text-sm text-right">
                      Enter Email
                    </p>
                  )}
                </div>
                <div className="h-23">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Password <sup>*</sup>
                  </label>
                  <div className="mt-2 relative">
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-20"
                      onClick={() => setEyeButton(!eyeButton)}
                    >
                      {eyeButton ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </button>
                    <input
                      id="password"
                      name="password"
                      type={eyeButton ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 
  ${
    error && !formData.password
      ? "outline-red-500 focus:outline-red-500"
      : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
  } 
  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                  </div>
                  {error && !formData.password && (
                    <p className="text-red-500 text-sm text-right">
                      Enter Password
                    </p>
                  )}
                </div>
                {/* <div className="h-23">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Password <sup>*</sup>
                                    </label>

                                    <div className="relative mt-2">
                                        <button type="button" className="absolute right-2 top-2.5 text-20" onClick={() => setEyeButton(!eyeButton)}>{eyeButton ? <IoEyeOutline /> : <IoEyeOffOutline />}</button>

                                        <input
                                            name="password"
                                            type={eyeButton ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-md px-3 py-2 outline border"
                                        />
                                    </div>

                                    {error && !formData.password &&
                                        <p className="text-red-500 text-sm">Enter Password</p>
                                    }
                                </div> */}

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-brand1 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[var(--color-brand-primary1-hover)] cursor-pointer disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                {/* <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button> */}
              </form>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1">
          <img src={login_img} className="h-full w-full object-cover" alt="" />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

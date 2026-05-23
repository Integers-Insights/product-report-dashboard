import { LuChevronDown } from "react-icons/lu";
import Int_Logo from "../assets/logo.svg";
import signup_img from "../assets/signup.png";
import { useEffect, useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
];

const Signup = () => {
  const [eyeButton, setEyeButton] = useState(false);

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "+91",
    phone: "",
    company: "",
    password: "",
  });

  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, company, password, country, phone } = formData;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedCompany || !trimmedPassword) {
      setError(true);
      toast.error("All required fields must be filled");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setError(false);
    setLoading(true);

    const payload = {
      full_name: trimmedName,
      email: trimmedEmail,
      company_name: trimmedCompany,
      password: trimmedPassword,
      phone: `${country}${phone || ""}`,
      // gdpr_consent: true,
      // marketing_consent: true,
      gdpr_consent: formData.gdpr_consent ?? true, // this is new payload
    };

    try {
      const response = await fetch(`${base_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.detail?.message || "Signup failed"); // this is new (data.detail.message)
        return;
      }

      if (data?.success) {
        toast.success(data?.message || "Signup successful. Verify your email.");
        setFormData({
          name: "",
          email: "",
          company: "",
          password: "",
          country: "+91",
          phone: "",
        });
      } else {
        toast.error(data?.detail || "Signup failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    if (authToken) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen">
      <div className="flex min-h-full m-auto">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img alt="Int_Logo" src={Int_Logo} className="h-10 w-auto cursor-pointer" onClick={()=>navigate("/")} />
              <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign Up to your account
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-0.5">
                  <div className="h-23">
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Name <sup>*</sup>
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 
  ${
    error && !formData.name
      ? "outline-red-500 focus:outline-red-500"
      : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
  }
  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                      />
                    </div>
                    {error && !formData.name && (
                      <p className="text-red-500 text-sm text-right">
                        Enter name
                      </p>
                    )}
                  </div>

                  <div className="h-23">
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
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

                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Phone number
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[var(--color-brand-primary1)]">
                        <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            autoComplete="country"
                            aria-label="Country"
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                          >
                            {countries.map((country, index) => (
                              <option key={index} value={country.code}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <LuChevronDown
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          />
                        </div>
                        <input
                          id="phone-number"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="123-456-7890"
                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <p className="invisible">Enter Phone</p>
                  </div>

                  <div className="h-23">
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Company <sup>*</sup>
                    </label>
                    <div className="mt-2">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        autoComplete="company"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 
  ${
    error && !formData.company
      ? "outline-red-500 focus:outline-red-500"
      : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
  }
  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                      />
                    </div>
                    {error && !formData.company && (
                      <p className="text-red-500 text-sm text-right">
                        Enter company name
                      </p>
                    )}
                  </div>

                  <div className="h-23">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
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
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-brand1 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[var(--color-brand-primary1-hover)] cursor-pointer disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "Sign Up"}
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center mt-3 text-sm font-medium text-gray-500">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  Login here
                </Link>
              </p>

              <div className="mt-10">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="flex justify-center">
                    <GoogleAuthButton />
                  </div>

                  {/* <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="size-5 fill-[#24292F]"
                    >
                      <path
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">GitHub</span>
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            alt=""
            src={signup_img}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default Signup;

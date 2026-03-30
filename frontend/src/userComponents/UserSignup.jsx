import { LuChevronDown } from "react-icons/lu";
import Int_Logo from '../assets/Int_Logo_Main_Fav.png';
import { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

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
    { name: "Mexico", code: "+52", flag: "🇲🇽" }
];


const UserSignup = () => {

    const [eyeButton, setEyeButton] = useState(false);

    const [error, setError] = useState(false);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: "+91",
        phone: "",
        company: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // const nameRegex = /^[A-Za-z ]{2,50}$/;
        // Allow: uppercase letters (A-Z), lowercase letters (a-z), space
        // Length: minimum 2 characters, maximum 50 characters
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Allow: any characters except space before @
        // Structure: text + @ + domain + . + extension
        // Example valid: "test@gmail.com", "user123@mail.co"
        // const phoneRegex = /^[0-9]{7,15}$/;
        // Allow: only digits (0-9)
        // Length: minimum 7 digits, maximum 15 digits
        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        // Allow: letters (A-Z, a-z) and numbers (0-9)
        // Must contain: at least 1 letter and 1 number
        // Length: minimum 6 characters
        // Example valid: "pass123", "abc123"
        // const companyRegex = /^[A-Za-z0-9 .&-]{2,100}$/;
        // Allow: letters (A-Z, a-z), numbers (0-9), space
        // Special characters allowed: .  &  -
        // Length: minimum 2 characters, maximum 100 characters
        // Example valid: "AI Integers", "Tata Ltd.", "Reliance Industries"

        if (!formData.name || !formData.email || !formData.company || !formData.password) {
            setError(true);
            return;
        }
        else if (formData.password.length < 6) {
            alert("Please enter minimum 6 characters")
        }
        else if (formData.name.trim() && formData.email.trim() && formData.company.trim() && formData.password.trim()) {
            setError(false);
            const payload = {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                password: formData.password,
                phone: `${formData.country}${formData.phone}`
            };

            console.log("Form Data:", payload);
        }
        else {
            alert("white space is not allowed.");
        }
    };

    return (
        <div className="h-screen">
            <div className="flex min-h-full m-auto">
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <img
                                alt="Int_Logo"
                                src={Int_Logo}
                                className="h-10 w-auto"
                            />
                            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                                Sign Up to your account
                            </h2>
                        </div>

                        <div className="mt-10">
                            <div>
                                <form onSubmit={handleSubmit} className="space-y-0.5">

                                    <div className="h-23">
                                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
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
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                                            />
                                        </div>
                                        {error && !formData.name &&
                                            <p className="text-red-500 text-sm">Enter name</p>
                                        }
                                    </div>

                                    <div className="h-23">
                                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
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
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                                            />
                                        </div>
                                        {error && !formData.email &&
                                            <p className="text-red-500 text-sm">Enter Email</p>
                                        }
                                    </div>

                                    <div>
                                        <label htmlFor="phone-number" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
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
                                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
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
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                                            />
                                        </div>
                                        {error && !formData.company &&
                                            <p className="text-red-500 text-sm">Enter company name</p>
                                        }
                                    </div>

                                    <div className="h-23">
                                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                                            Password <sup>*</sup>
                                        </label>
                                        <div className="mt-2 relative">
                                            <button type="button" className="absolute right-2 top-2 text-20" onClick={() => setEyeButton(!eyeButton)}>{eyeButton ? <IoEyeOutline /> : <IoEyeOffOutline />}</button>
                                            <input
                                                id="password"
                                                name="password"
                                                type={eyeButton ? "text" : "password"}
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="current-password"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                                            />
                                        </div>
                                        {error && !formData.password &&
                                            <p className="text-red-500 text-sm">Enter Password</p>
                                        }
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-brand1 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[var(--color-brand-primary1-hover)] cursor-pointer"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-10">
                                <div className="relative">
                                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm/6 font-medium">
                                        <span className="bg-white px-6 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                            <path
                                                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                                fill="#EA4335"
                                            />
                                            <path
                                                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                                fill="#34A853"
                                            />
                                        </svg>
                                        <span className="text-sm/6 font-semibold">Google</span>
                                    </a>

                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
                                    >
                                        <svg
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                            className="size-5 fill-[#24292F] dark:fill-white"
                                        >
                                            <path
                                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm/6 font-semibold">GitHub</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative hidden w-0 flex-1 lg:block">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                        className="absolute inset-0 size-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}
export default UserSignup;
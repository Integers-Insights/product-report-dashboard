import { LuChevronDown } from "react-icons/lu";
import Int_Logo from '../assets/Int_Logo_Main_Fav.png';
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
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
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
            password: trimmedPassword
        };

        try {
            const response = await fetch(`${base_url1}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
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
                    password: ""
                });
                navigate("/overview");
            }
            else {
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Email address <sup>*</sup>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-md px-3 py-2 outline border"
                                    />
                                    {error && !formData.email &&
                                        <p className="text-red-500 text-sm">Enter Email</p>
                                    }
                                </div>


                                <div>
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
                                </div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block flex-1">
                    <img
                        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e"
                        className="h-full w-full object-cover"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
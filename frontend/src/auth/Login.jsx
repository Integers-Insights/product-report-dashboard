import { RiLoader4Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { base_url } from "../URL";
import toast from 'react-hot-toast';

const Login = () => {

    const [inputValue, setInputValue] = useState({
        username: "",
        password: ""
    });

    const [showPass, setShowPass] = useState(true);
    const [error, setError] = useState(false);

    const [loader2, setLoader2] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.username.trim() || !inputValue.password.trim()) {
            setError(true);
            return;
        }

        try {
            setLoader2(true);
            const result = await fetch(`${base_url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(inputValue)
            });

            const data = await result.json();

            if (data.success) {
                localStorage.setItem("n@xIIktKQXeorj.W*XF5tFrKl", JSON.stringify(data));
                navigate("/dash");
                toast.success(data.message);
            }
            else {
                toast.error(data.detail);
            }

        } catch (err) {
            toast.error(err.message);
            console.error("Something went wrong:", err.message);
        } finally {
            setLoader2(false);
        }
    };

    useEffect(() => {
        let authUser = localStorage.getItem("n@xIIktKQXeorj.W*XF5tFrKl");
        if (authUser) {
            navigate("/dash");
        }
    }, []);


    return (
        <div className="h-[90vh] flex justify-center items-center bg-gray-100">
            <div className="w-80 sm:w-90 m-auto px-3 py-2 pb-6 rounded-xl bg-surface shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <h1 className="text-24 font-medium text-center py-4">Login here</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="" className="font-medium">Username Id:</label><br />
                        <input type="email" name="username" value={inputValue.username} onChange={handleChange} className="border w-full h-9 rounded px-1" />
                        {error && !inputValue.username && <p className="text-red-500">Please Enter Username Id</p>}
                    </div>
                    <div className="relative">
                        <label htmlFor="" className="font-medium">Password:</label><br />
                        <input type={showPass ? "password" : "text"} name="password" value={inputValue.password} onChange={handleChange} className="border w-full h-9 rounded px-1" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="cursor-pointer absolute right-3 top-8 text-xl">{showPass ? <span><FaRegEye /></span> : <span><FaRegEyeSlash /></span>}</button>
                        {error && !inputValue.password && <p className="text-red-500">Please Enter Password</p>}
                    </div>
                    <div className="border rounded">
                        <button
                            type="submit"
                            className="py-1 w-full font-medium cursor-pointer rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={loader2}
                        >
                            {loader2 ? (
                                <span className="flex justify-center items-center gap-2">
                                    Logging in
                                    <RiLoader4Fill className="text-20 animate-spin" />
                                </span>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;

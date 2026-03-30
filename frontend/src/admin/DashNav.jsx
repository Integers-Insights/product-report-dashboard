import { useEffect, useState } from 'react';
import logo from '../assets/Logo-Integers.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { base_url } from "../URL";
import toast from 'react-hot-toast';

const DashNav = () => {

    const [openPopup, setOpenPopup] = useState(false);
     const navigate = useNavigate();

    const handleClick = (e) => {
        e.stopPropagation();
        setOpenPopup(!openPopup);
    };

    useEffect(() => {
        const closeMenu = () => setOpenPopup(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);


    const handleLogout = async () => {
        // setOpenPopup(false);
        try {
            const result = await fetch(`${base_url}/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const data = await result.json();

            if (data.success) {
                localStorage.removeItem("n@xIIktKQXeorj.W*XF5tFrKl");
                navigate("/login");
                toast.success(data.message);
            }
            else {
                toast.error("Logout Failed");
            }
        } catch (err) {
            toast.error(err.message);
            console.error("Something went wrong:", err.message);
        }
    }

    let isAuth = localStorage.getItem("n@xIIktKQXeorj.W*XF5tFrKl");
    let userName = isAuth ? JSON.parse(isAuth) : "";
    let uname = userName?.full_name?.slice(0, 1) || "";

    return (
        <div className="h-21 w-full bg-surface flex justify-around items-center sticky top-0 left-0 z-10">
            <div className="w-55 h-11"><img src={logo} alt="logo" className='h-full w-full' /></div>
            <div>
                <ul className='flex gap-9'>
                    <li><NavLink to={"/dash"}>Home</NavLink></li>
                    <li><NavLink to={"/all"}>All Reports</NavLink></li>
                    <li className='opacity-50'>Section Library</li>
                    <li className='opacity-50'>Pricing Rules</li>
                    <li className='opacity-50'>Orders</li>
                </ul>
            </div>
            {isAuth &&
                <div>
                    <div className="relative inline-block">
                        <button
                            onClick={handleClick}
                            className="border border-green-500 bg-brand rounded-full h-9 w-9 text-20 font-medium transition-all cursor-pointer hover:bg-[var(--color-brand-primary-hover)] capitalize"
                        >
                            {uname}
                        </button>
                        {openPopup && (
                            <div className="absolute top-full z-10 mt-2 rounded shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="bg-brand w-full rounded py-2 px-3 text-15 text-primary font-medium cursor-pointer hover:bg-[var(--color-brand-primary-hover)]"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};
export default DashNav;
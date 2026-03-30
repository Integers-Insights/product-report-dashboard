import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from 'react';
import logo from '../assets/Logo-Integers.svg';
import { RxCross2 } from "react-icons/rx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoSmall from '../assets/Logo-Integers1.svg';
import { FiChevronDown } from "react-icons/fi";
import { FiChevronUp } from "react-icons/fi";

const Navbar = () => {

    const [menu, setMenu] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    // const [openPopup, setOpenPopup] = useState(false);

    const navigate = useNavigate();

    // Mega Menu Data
    const megaMenus = {
        industries: {
            title: "Industries",
            sections: [
                {
                    title: "Consumer Goods", link: "consumer-goods",
                    items: [
                        { name: "Food & Drink", link: "food-drink" },
                        { name: "Beauty & Personal Care", link: "beauty-personal-care" },
                        { name: "Household", link: "household" },
                    ]
                },
                {
                    title: "Health & Wellness", link: "health-wellness",
                    items: [
                        { name: "Pharmaceuticals", link: "pharmaceuticals" },
                        { name: "Nutraceuticals", link: "nutraceuticals" },
                        { name: "Medical Nutrition", link: "medical-nutrition" },
                    ]
                },
                {
                    title: "Ingredients & Materials", link: "ingredients-materials",
                    items: [
                        { name: "Vitamins & Minerals", link: "vitamins-minerals" },
                        { name: "Amino Acids", link: "amino-acids" },
                        { name: "Herbal Extracts", link: "herbal-extracts" },
                        { name: "Functional Ingredients", link: "functional-ingredients" },
                    ]
                },
                {
                    title: "Future Updates", link: "future-updates",
                    items: [
                        { name: "Chemicals", link: "chemicals" },
                        { name: "Agriculture", link: "agriculture" },
                    ]
                }
            ]
        },
        reports: {
            title: "Reports",
            sections: [
                {
                    title: "Reports Types",
                    items: [
                        { name: "Market Intelligence Reports", link: "market-intelligence-reports" },
                        { name: "Market Size & Forecast", link: "market-size-forecast" },
                        { name: "Competitive Landscape", link: "competitive-landscape" },
                        { name: "Pricing & Cost Analysis", link: "pricing-cost-analysis" },
                    ]
                },
                {
                    title: "",
                    items: [
                        { name: "Consumer / Usage Insights", link: "consumer-usage-insights" },
                        { name: "Import / Export & Trade", link: "import-export-trade" },
                        { name: "Regulatory Environment", link: "regulatory-environment" },
                        { name: "Innovation & Trends", link: "innovation-trends" },
                    ]
                }
            ]
        },
        useCases: {
            title: "Use Cases",
            items: [
                { name: "New Product Launch", link: "new-product-launch" },
                { name: "Market Entry (Country)", link: "market-entry-country" },
                { name: "Competitor Benchmarking", link: "competitor-benchmarking" },
                { name: "Investor/Board Presentations", link: "investor-board-presentations" },
                { name: "Pricing Strategy", link: "pricing-strategy" },
            ]
        }
    };

    const handleMobileMenuToggle = (menuName) => {
        if (activeMegaMenu === menuName) {
            setActiveMegaMenu(null);
        } else {
            setActiveMegaMenu(menuName);
        }
    };

    // const handleClick = (e) => {
    //     e.stopPropagation();
    //     setOpenPopup(!openPopup);
    // };

    // useEffect(() => {
    //     const closeMenu = () => setOpenPopup(false);
    //     window.addEventListener("click", closeMenu);
    //     return () => window.removeEventListener("click", closeMenu);
    // }, []);

    // const handleLogout = async () => {
    //     // setOpenPopup(false);
    //     try {
    //         const result = await fetch(`${base_url}/logout`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             credentials: "include"
    //         });

    //         const data = await result.json();

    //         if (data.success) {
    //             setMenu(false);
    //             localStorage.removeItem("n@xIIktKQXeorj.W*XF5tFrKl");
    //             navigate("/login");
    //             toast.success(data.message);
    //         }
    //         else {
    //             toast.error("Logout Failed");
    //         }
    //     } catch (err) {
    //         toast.error(err.message);
    //         console.error("Something went wrong:", err.message);
    //     }
    // }

    // let isAuth = localStorage.getItem("n@xIIktKQXeorj.W*XF5tFrKl");
    // let userName = isAuth ? JSON.parse(isAuth) : "";
    // let uname = userName?.full_name?.slice(0, 1) || "";

    return (
        <>
            <div className="bg-surface h-21 flex justify-around items-center sticky top-0 left-0 z-10">
                <div className="w-55 h-11 hidden sm:block cursor-pointer" onClick={()=>navigate("/")}><img src={logo} alt="logo" className='h-full w-full' /></div>
                <div className="w-11 h-11 sm:hidden cursor-pointer" onClick={()=>navigate("/")}><img src={logoSmall} alt="logo" className='h-full w-full' /></div>
                <div className="lg:hidden">
                    <div className="h-9 border-brand-primary w-45 sm:w-58 flex py-1 sm:py-2 px-2 sm:px-4 items-center">
                        <input type="search" className='h-full text-16 outline-0 w-full' placeholder='Search report...' />
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M16.4197 16.4197C16.7126 16.1268 17.1874 16.1268 17.4803 16.4197L21.5301 20.4695C21.823 20.7624 21.823 21.2372 21.5301 21.5301C21.2372 21.823 20.7624 21.823 20.4695 21.5301L16.4197 17.4803C16.1268 17.1874 16.1268 16.7126 16.4197 16.4197Z" fill="#3CD690" />
                            <path d="M18.4502 11.0996C18.45 7.0405 15.1588 3.75 11.0996 3.75C7.04063 3.75021 3.75021 7.04063 3.75 11.0996C3.75 15.1588 7.0405 18.45 11.0996 18.4502C15.1589 18.4502 18.4502 15.1589 18.4502 11.0996ZM19.9502 11.0996C19.9502 15.9873 15.9873 19.9502 11.0996 19.9502C6.21207 19.95 2.25 15.9872 2.25 11.0996C2.25021 6.2122 6.2122 2.25021 11.0996 2.25C15.9872 2.25 19.95 6.21207 19.9502 11.0996Z" fill="#3CD690" />
                        </svg>
                    </div>
                </div>
                <button className='lg:hidden text-2xl' onClick={() => setMenu(!menu)}>
                    {menu ? <RxCross2 /> : <RxHamburgerMenu />}
                </button>
                <div className="hidden lg:block relative">
                    <ul className="flex items-center space-x-8">
                        <li className="block lg:inline-block">
                            <NavLink to={'/'}>Home</NavLink>
                        </li>
                        {/* <li className="block lg:inline-block">
                            <NavLink to={'/about'}>About Us</NavLink>
                        </li> */}
                        <li className="relative group">
                            <div className="flex items-center space-x-1 py-2 text-primary cursor-pointer">
                                <span>Industries</span>
                                <FiChevronDown className="group-hover:rotate-180 transition-transform duration-200" />
                            </div>
                            <div className="absolute -left-[100%] top-full mt-2 w-[750px] xl:w-[800px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 p-6 
                                opacity-0 invisible 
                                group-hover:opacity-100 group-hover:visible 
                                transition-all duration-300 ease-in-out 
                                transform translate-y-2 group-hover:translate-y-0">
                                <div className="grid grid-cols-4 gap-8">
                                    {megaMenus.industries.sections.map((section, index) => (
                                        <div key={index}>
                                            <h3 className="font-semibold text-lg mb-3 text-gray-900">
                                                {/* <Link
                                                    to={`/industry/${encodeURIComponent(section.title)}`}
                                                    className="text-primary hover:underline"
                                                    onClick={() => setActiveMegaMenu(null)}
                                                >
                                                    {section.title}
                                                </Link> */}

                                                <Link
                                                    to={`/industry/${section.link}`}
                                                    className="text-primary hover:underline"
                                                    onClick={() => setActiveMegaMenu(null)}
                                                >
                                                    {section.title}
                                                </Link>

                                            </h3>
                                            <ul className="space-y-2">
                                                {section.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {/* <Link
                                                            to={`/industry/${encodeURIComponent(item.link)}`}
                                                            className="text-primary block py-1"
                                                            onClick={() => setActiveMegaMenu(null)}
                                                        >
                                                            {item.name}
                                                        </Link> */}

                                                        <Link
                                                            to={`/industry/${item.link}`}
                                                            className="text-primary block py-1"
                                                            onClick={() => setActiveMegaMenu(null)}
                                                        >
                                                            {item.name}
                                                        </Link>

                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <p className="font-medium"><NavLink to={'/report'}>See All Reports</NavLink></p>
                                </div>
                            </div>
                        </li>
                        <li className="relative group">
                            <div className="flex items-center space-x-1 py-2 text-primary cursor-pointer">
                                <span>Report Types</span>
                                <FiChevronDown className="group-hover:rotate-180 transition-transform duration-200" />
                            </div>
                            <div className="absolute -left-[100%] top-full mt-2 w-[550px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 p-6 
                                opacity-0 invisible 
                                group-hover:opacity-100 group-hover:visible 
                                transition-all duration-300 ease-in-out 
                                transform translate-y-2 group-hover:translate-y-0">
                                <div className="grid grid-cols-2 gap-8">
                                    {megaMenus.reports.sections.map((section, index) => (
                                        <div key={index}>
                                            <h3 className="font-semibold text-lg mb-3 text-gray-900">
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {section.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {/* <Link
                                                            to={`/report-type/${encodeURIComponent(item.link)}`}
                                                            className="text-primary transition-colors block py-1"
                                                            onClick={() => setActiveMegaMenu(null)}
                                                        >
                                                            {item.name}
                                                        </Link> */}

                                                        <Link
                                                            to={`/report-type/${item.link}`}
                                                            className="text-primary transition-colors block py-1"
                                                            onClick={() => setActiveMegaMenu(null)}
                                                        >
                                                            {item.name}
                                                        </Link>

                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                        <li className="relative group">
                            <div className="flex items-center space-x-1 py-2 text-primary cursor-pointer">
                                <span>Use Cases</span>
                                <FiChevronDown className="group-hover:rotate-180 transition-transform duration-200" />
                            </div>
                            <div className="absolute -left-[100%] top-full mt-2 w-[300px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 p-6 
                                opacity-0 invisible 
                                group-hover:opacity-100 group-hover:visible 
                                transition-all duration-300 ease-in-out 
                                transform translate-y-2 group-hover:translate-y-0">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                                    Use Cases
                                </h3>
                                <ul className="space-y-2">
                                    {megaMenus.useCases.items.map((item, idx) => (
                                        <li key={idx}>
                                            {/* <Link
                                                to={`/usecase/${encodeURIComponent(item.link)}`}
                                                className="text-primary block py-2"
                                                onClick={() => setActiveMegaMenu(null)}
                                            >
                                                {item.name}
                                            </Link> */}

                                            <Link
                                                to={`/usecase/${item.link}`}
                                                className="text-primary block py-2"
                                                onClick={() => setActiveMegaMenu(null)}
                                            >
                                                {item.name}
                                            </Link>


                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                        <li className="block lg:inline-block">
                            <NavLink to={"/contact"}>Contact Us</NavLink>
                        </li>
                    </ul>
                </div>
                <div className={`fixed top-21 right-0 w-full h-[calc(100vh-84px)] bg-surface overflow-y-auto transition-all duration-300 transform ${menu ? "translate-x-0" : "translate-x-full"} lg:hidden z-40`}>
                    <div className="p-4 space-y-1">
                        <div className="mb-2">
                            <NavLink
                                to={'/'}
                                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-200"
                                onClick={() => setMenu(false)}
                            >
                                Home
                            </NavLink>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() => handleMobileMenuToggle('industries')}
                                className="flex items-center justify-between w-full text-left py-2 px-4 rounded-lg text-primary hover:bg-gray-200"
                            >
                                <span>Industries</span>
                                <span className="text-primary">
                                    {activeMegaMenu === 'industries' ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeMegaMenu === 'industries' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-4 pb-4 space-y-4">
                                    {megaMenus.industries.sections.map((section, index) => (
                                        <div key={index} className="space-y-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                {/* <Link
                                                    to={`/industry/${encodeURIComponent(section.title)}`}
                                                    className="text-primary hover:underline"
                                                    onClick={() => {
                                                        setActiveMegaMenu(null);
                                                        setMenu(false);
                                                    }}
                                                >
                                                    {section.title}
                                                </Link> */}

                                                <Link
                                                    to={`/industry/${section.link}`}
                                                    className="text-primary hover:underline"
                                                    onClick={() => {
                                                        setActiveMegaMenu(null);
                                                        setMenu(false);
                                                    }}
                                                >
                                                    {section.title}
                                                </Link>

                                            </h3>
                                            <ul className="space-y-1">
                                                {section.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {/* <Link
                                                            to={`/industry/${encodeURIComponent(item.link)}`}
                                                            className="text-primary block py-2 pl-2 text-sm"
                                                            onClick={() => {
                                                                setActiveMegaMenu(null);
                                                                setMenu(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Link> */}

                                                        <Link
                                                            to={`/industry/${item.link}`}
                                                            className="text-primary block py-2 pl-2 text-sm"
                                                            onClick={() => {
                                                                setActiveMegaMenu(null);
                                                                setMenu(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}

                                    <p><NavLink to={'/report'} onClick={() => setMenu(false)}>See All Reports</NavLink></p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() => handleMobileMenuToggle('reports')}
                                className="flex items-center justify-between w-full text-left py-2 px-4 rounded-lg text-primary hover:bg-gray-200"
                            >
                                <span>Report Types</span>
                                <span className="text-primary">
                                    {activeMegaMenu === 'reports' ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeMegaMenu === 'reports' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-4 pb-4 space-y-4">
                                    {megaMenus.reports.sections.map((section, index) => (
                                        <div key={index} className="space-y-2">
                                            <h3 className="font-semibold text-primary text-sm">
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-1">
                                                {section.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {/* <Link
                                                            to={`/report-type/${encodeURIComponent(item.link)}`}
                                                            className="text-primary block py-2 pl-2 text-sm"
                                                            onClick={() => {
                                                                setActiveMegaMenu(null);
                                                                setMenu(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Link> */}

                                                        <Link
                                                            to={`/report-type/${item.link}`}
                                                            className="text-primary block py-2 pl-2 text-sm"
                                                            onClick={() => {
                                                                setActiveMegaMenu(null);
                                                                setMenu(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() => handleMobileMenuToggle('useCases')}
                                className="flex items-center justify-between w-full text-left py-2 px-4 rounded-lg text-primary hover:bg-gray-200"
                            >
                                <span>Use Cases</span>
                                <span className="text-primary">
                                    {activeMegaMenu === 'useCases' ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeMegaMenu === 'useCases' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-4 pb-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-primary text-sm mb-3">
                                            Use Cases
                                        </h3>
                                        <ul className="space-y-1">
                                            {megaMenus.useCases.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {/* <Link
                                                        to={`/usecase/${encodeURIComponent(item.link)}`}
                                                        className="text-primary block py-2"
                                                        onClick={() => {
                                                            setActiveMegaMenu(null);
                                                            setMenu(false);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Link> */}

                                                    <Link
                                                        to={`/usecase/${item.link}`}
                                                        className="text-primary block py-2"
                                                        onClick={() => {
                                                            setActiveMegaMenu(null);
                                                            setMenu(false);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <NavLink
                                to={"/contact"}
                                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-200"
                                onClick={() => setMenu(false)}
                            >
                                Contact Us
                            </NavLink>
                        </div>
                        {/* {isAuth &&
                            <div className="lg:hidden px-4">
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
                        } */}
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="h-9 border-brand-primary w-58 flex py-2 px-4 items-center">
                        <input type="search" className='h-full text-16 outline-0 w-full' placeholder='Search report...' />
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M16.4197 16.4197C16.7126 16.1268 17.1874 16.1268 17.4803 16.4197L21.5301 20.4695C21.823 20.7624 21.823 21.2372 21.5301 21.5301C21.2372 21.823 20.7624 21.823 20.4695 21.5301L16.4197 17.4803C16.1268 17.1874 16.1268 16.7126 16.4197 16.4197Z" fill="#3CD690" />
                            <path d="M18.4502 11.0996C18.45 7.0405 15.1588 3.75 11.0996 3.75C7.04063 3.75021 3.75021 7.04063 3.75 11.0996C3.75 15.1588 7.0405 18.45 11.0996 18.4502C15.1589 18.4502 18.4502 15.1589 18.4502 11.0996ZM19.9502 11.0996C19.9502 15.9873 15.9873 19.9502 11.0996 19.9502C6.21207 19.95 2.25 15.9872 2.25 11.0996C2.25021 6.2122 6.2122 2.25021 11.0996 2.25C15.9872 2.25 19.95 6.21207 19.9502 11.0996Z" fill="#3CD690" />
                        </svg>
                    </div>
                </div>
                {/* {isAuth &&
                    <div className="hidden lg:block">
                        <div className="relative inline-block">
                            <button
                                onClick={handleClick}
                                className="border border-green-500 bg-brand rounded-full h-9 w-9 text-20 font-medium transition-all cursor-pointer hover:bg-[var(--color-brand-primary-hover)] capitalize"
                            >
                                {uname}
                            </button>
                            {openPopup && (
                                <div className="absolute right-0 top-full z-10 mt-2 rounded shadow-lg">
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
                } */}
            </div>
        </>
    );
};

export default Navbar;

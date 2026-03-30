import { useState, useRef, useEffect } from "react";
import { countries, roles } from "./Data";
import { RiLoader4Fill } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import { base_url } from "../URL";
// import Breadcrumbs from "./BreadCrumbs";
import toast from 'react-hot-toast';
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const ContactUs = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [message, setMessage] = useState("");
    const [loader3, setLoader3] = useState(false);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryOpen, setCountryopen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roleOpen, setRoleOpen] = useState(false);

    const dropdownRef = useRef(null);
    const roleRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCountryopen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter((country) =>
        country.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (roleRef.current && !roleRef.current.contains(e.target)) {
                setRoleOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const phoneRegex = /^\+?\d{7,15}$/;
        if (!name.trim() || !email.trim() || !contact.trim() || !companyName.trim()) {
            setError(true);
            return;
        }
        if (!phoneRegex.test(contact)) {
            toast.error("Please enter valid Contact No.");
            return;
        }
        try {
            setLoader3(true);
            let payload = {
                full_name: name,
                business_email_address: email,
                contact_number: contact,
                company_name: companyName,
                role: selectedRole,
                location: selectedCountry,
                message: message
            }

            let emailResult = await fetch(`${base_url}/contact/submit`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                },
                // credentials: "include"
            });

            let emailData = await emailResult.json();

            if (emailData.success) {
                setName("");
                setEmail("");
                setContact("");
                setCompanyName("");
                setSelectedRole("");
                setSelectedCountry("");
                setMessage("");
                setError(false);
                toast.success(emailData.message || "Your message has been sent.");
            } else {
                toast.error(emailData.message || "Your message has not been sent.");
            }
        }
        catch (err) {
            toast.error("something went wrong...");
            console.log("something went wrong...", err.message);
        } finally {
            setLoader3(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 py-5">
                {/* <div className="w-80 sm:w-155 md:w-180 m-auto py-2">
                    <Breadcrumbs />
                </div> */}
                {/* <div className="border w-80 sm:w-155 md:w-180 m-auto py-2 flex gap-2 text-primary text-16 font-regular">
                    <span><Link to={"/"}>Home</Link></span>
                    <span>&gt;</span>
                    <span>Contact Us</span>
                </div> */}

                <div className="w-80 sm:w-155 md:w-180 m-auto py-2 flex gap-2 text-primary text-16 font-regular">
                    <span><Link to={"/"}>Home</Link></span>
                    <span>&gt;</span>
                    <span className="font-medium underline">Contact Us</span>
                </div>

                <div className={`border border-gray-200 rounded w-80 sm:w-155 md:w-180 m-auto p-6 bg-surface`}>
                    <div className="mt-4">
                        <h1 className="text-primary text-24 font-regular">Contact With Us</h1>
                        <p className="text-primary text-16 font-regular">Have a question about a report or need custom research? Our team will respond within 1–2 business days.</p>
                        {/* <p className="text-primary text-24 font-regular">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis saepe commodi ut quod</p> */}
                    </div>
                    <div className="mt-7">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullName" className="font-medium">Full Name <sup>*</sup></label>
                                <input type="text" id="fullName" className="h-9 w-full border border-gray-200 bg-surface px-1" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                {error && !name && <p className="text-15 text-red-500">Please Enter Full Name</p>}
                            </div>
                            <div>
                                <label htmlFor="userEmail" className="font-medium">Business Email Address <sup>*</sup></label>
                                <input type="email" id="userEmail" className="h-9 w-full border border-gray-200 bg-surface px-1" placeholder="john@yourdomain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {error && !email && <p className="text-15 text-red-500">Please Enter Email</p>}
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="font-medium">Contact Number <sup>*</sup></label>
                                <input type="text" id="contactNumber" className="h-9 w-full border border-gray-200 bg-surface px-1" placeholder="+1123456789" value={contact}
                                    onChange={(e) => setContact(e.target.value.replace(/[^\d+]/g, ""))}
                                />
                                {error && !contact && <p className="text-15 text-red-500">Please Enter Contact Number</p>}
                            </div>
                            <div>
                                <label htmlFor="companyName" className="font-medium">Company Name <sup>*</sup></label>
                                <input type="text" id="companyName" className="h-9 w-full border border-gray-200 bg-surface px-1" placeholder="ABC Limited" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                {error && !companyName && <p className="text-15 text-red-500">Please Enter Company Name</p>}
                            </div>
                            <div ref={roleRef} className="relative w-full">
                                <label className="block mb-1 font-medium">
                                    Role
                                </label>
                                <div
                                    onClick={() => setRoleOpen(!roleOpen)}
                                    className="border border-gray-200 bg-white px-3 py-1.5 cursor-pointer select-none flex items-center justify-between">
                                    <span>
                                        {selectedRole || (
                                            <span className="text-gray-500">---Select Role---</span>
                                        )}
                                    </span>
                                    <IoChevronDown
                                        className={`transition-transform duration-300 ease-in-out text-gray-500 ${roleOpen ? "rotate-180" : ""}`}
                                    />
                                </div>
                                {roleOpen && (
                                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 shadow-md">
                                        {roles.map((role, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    setRoleOpen(false);
                                                }}
                                                className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
                                            >
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div ref={dropdownRef} className="relative w-full">
                                <label className="block mb-1 font-medium">
                                    Location:
                                </label>
                                <div
                                    onClick={() => setCountryopen(!countryOpen)}
                                    className="border border-gray-200 bg-white px-3 py-1.5 cursor-pointer select-none flex items-center justify-between">
                                    <span>
                                        {selectedCountry || (
                                            <span className="text-gray-500">---Select Country---</span>
                                        )}
                                    </span>
                                    <IoChevronDown
                                        className={`transition-transform duration-300 ease-in-out text-gray-500 ${countryOpen ? "rotate-180" : "rotate-0"}`}
                                    />
                                </div>
                                {countryOpen && (
                                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 shadow-md">
                                        <input
                                            type="text"
                                            placeholder="Search country..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full px-3 py-2 border-b"
                                        />
                                        <div className="max-h-40 overflow-y-auto">
                                            {filteredCountries.length > 0 ? (
                                                filteredCountries.map((country, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setCountryopen(false);
                                                            setSearch("");
                                                        }}
                                                        className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
                                                    >
                                                        {country}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-400 text-sm">
                                                    No country found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="messageInput" className="font-medium">Message</label>
                                <textarea name="" id="messageInput" className="border border-gray-200  w-full h-20 resize-none bg-surface p-1" placeholder="What you want to say?" value={message} onChange={(e) => setMessage(e.target.value)} ></textarea>
                            </div>
                            <p>By submitting this form, you agree to be contacted regarding your inquiry. We respect your privacy and do not share your information.</p>
                            <button
                                type="submit"
                                className="py-2 w-35 border border-gray-300 font-medium cursor-pointer  bg-surface hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={loader3}
                            >
                                {loader3 ? (
                                    <span className="flex justify-center items-center gap-2">
                                        Submit in...
                                        <RiLoader4Fill className="text-20 animate-spin" />
                                    </span>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default ContactUs;

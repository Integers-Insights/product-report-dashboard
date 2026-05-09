import {
  CalendarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import {
  SparklesIcon,
  CubeTransparentIcon,
  BanknotesIcon,
  WalletIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChartPieIcon,
  BoltIcon,
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import Int_Logo_Main_Horz from "../assets/Int_Logo_Main_Horz.png";
import Ellipse_11 from "../assets/Ellipse_11.svg";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { base_url1 } from "../URL";

const navigation = [
  {
    name: "Overview",
    href: "/overview",
    icon: CubeTransparentIcon,
    current: true,
  },
  // { name: "Opportunity Hub", href: "#", icon: BanknotesIcon, current: false },
  { name: "My Product", href: "/product", icon: WalletIcon, current: false },
  {
    name: "Market Glance",
    href: "/market",
    icon: ChartBarIcon,
    count: "5",
    current: false,
  },
  { name: "Buyer List", href: "/buyer", icon: UserGroupIcon, current: false },
  {
    name: "Reports",
    href: "/intelligence-reports",
    icon: ChartPieIcon,
    count: "5",
    current: false,
  },
];
const teams = [
  // {
  //   id: 1,
  //   name: "Settings",
  //   href: "/setting",
  //   initial: "H",
  //   current: false,
  //   icon: Cog6ToothIcon,
  // },
  {
    id: 2,
    name: "Help & Support",
    href: "/help",
    initial: "T",
    current: false,
    icon: QuestionMarkCircleIcon,
  },
  // {
  //   id: 3,
  //   name: "Log out",
  //   href: "/logout",
  //   initial: "W",
  //   current: false,
  //   icon: ArrowLeftStartOnRectangleIcon,
  // },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SideBar = () => {
  const [open_profile, setOpen_profile] = useState(false);

  // user data state
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [industry, setIndustry] = useState("");
  const [business_type, setBusiness_Type] = useState("");
  const [business_type_data, setBusiness_Type_Data] = useState("");

  //password
  const [current_password, setCurrent_password] = useState("");
  const [new_password, setNew_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [passError, setPassError] = useState(false);

  // score data
  const [usage_data1, setUserData1] = useState(0);
  const [usage_data2, setUserData2] = useState(0);
  const [usage_date, setUsage_date] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    // try {
    //   localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
    //   localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
    //   navigate("/login");
    // } catch (err) {
    //   console.log("Something went wrong");
    // }

    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();

      if (data?.success) {
        alert(data?.message || "Logged out successfully");
        localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
        localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
        navigate("/login");
      }
    } catch (err) {
      console.log("Something went wrong.", err);
    }
  };

  const getProfileData = async () => {
    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();

      if (data?.success) {
        // console.log("proile: ", data);
        setFullName(data?.data?.full_name);
        setEmail(data?.data?.email);
        setPhone(data?.data?.phone);
        setCountry(data?.data?.country);
        setCompany_name(data?.data?.company_name);
        setIndustry(data?.data?.industry);
        setBusiness_Type(data?.data?.business_type);
        setBusiness_Type_Data(data?.data?.business_type);
      }
    } catch (err) {
      console.log("Something went wrong.", err);
    }
  };

  const handleProfile1 = async () => {
    // alert("api called for update profile");
    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/update-profile`, {
        method: "PUT",
        body: JSON.stringify({ full_name, email, phone }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();
      // console.log("updated data: ", data);
      if (data.force_logout) {
        alert(data.message || "Please verify your email and login again");
        localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
        localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
        navigate("/login");
      } else {
        alert(data.message || "Profile updated successfully");
      }
    } catch (err) {
      console.log("something went wrong.", err);
    }
  };

  const handleProfile2 = async () => {
    setPassError(false);

    if (!current_password || !new_password || !confirm_password) {
      setPassError(true);
      return;
    }

    if (new_password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (new_password !== confirm_password) {
      alert("Passwords do not match");
      return;
    }

    // console.log("all pass: ", current_password, new_password, confirm_password);

    let payload = { current_password, new_password, confirm_password };

    console.log("paylod: ", payload);

    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/change-password`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      let data = await response.json();
      console.log("data: ", data);
      if (data.force_logout) {
        alert(
          data.message || "Password updated successfully. Please login again.",
        );
        localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
        localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
        navigate("/login");
      }

      // console.log("updated data: ", data);
      // if (data.force_logout) {
      //   alert(data.message || "Email changed. Please login again.");
      //   localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
      //   localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
      //   navigate("/login");
      // } else {
      //   alert(data.message || "Profile updated successfully");
      // }
    } catch (err) {
      alert("something went wrong.");
      console.log("something went wrong.", err);
    }
  };

  const handleProfile3 = async () => {
    // alert("api called for update profile");
    // console.log(company_name,industry,business_type);
    let payload = { company_name, industry, business_type };
    console.log(payload);
    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/profile/company`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();
      // console.log("updated ind: ", data);
      if (data.success) {
        alert(data.message || "Company profile updated successfully");
      } else {
        alert(data.message || "");
      }
    } catch (err) {
      console.log("something went wrong.", err);
    }
  };

  const getScoutPlan = async () => {
    // let payload = { company_name, industry, business_type };
    // console.log(payload);
    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      let response = await fetch(`${base_url1}/billing/usage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();
      console.log("billing data: ", data);
      if (data?.success) {
        setUsage_date(data?.end_date);

        if (data?.billing_cycle === "monthly") {
          setUserData1(data?.usage?.monthly_limit || 0);
          setUserData2(data?.usage?.monthly_remaining || 0);
        } else if (data?.billing_cycle === "yearly") {
          setUserData1(data?.usage?.yearly_limit || 0);
          setUserData2(data?.usage?.yearly_remaining || 0);
        } else {
          setUserData1(data?.usage?.daily_limit || 0);
          setUserData2(data?.usage?.free_remaining || 0);
        }
      }
    } catch (err) {
      console.log("something went wrong.", err);
    }
  };

  useEffect(() => {
    getScoutPlan();
    getProfileData();
  }, []);

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");
  let name = "";
  try {
    const parsed = userProfile ? JSON.parse(userProfile) : null;
    name = parsed?.name || "";
  } catch (e) {
    console.log("Invalid localStorage data");
  }

  const total = usage_data1;
  const remaining = usage_data2;
  const used = total - remaining;

  const percentage = total
    ? Math.min(100, Math.max(0, (used / total) * 100))
    : 0;

  return (
    // <div className="sticky top-0 left-0 flex grow flex-col gap-y-3 overflow-y-auto bg-[#FFF] px-6 w-62 h-screen">
    <>
      <div className="sidebar sticky top-0 left-0 flex flex-col gap-y-3 bg-[#FFF] px-6 w-64 min-h-screen">
        <div className="flex h-12 mt-2 shrink-0 items-center">
          <img
            alt="Int-Logo"
            src={Int_Logo_Main_Horz}
            className="h-10 w-auto"
          />
        </div>
        <div className="py-3 rounded-lg bg-gradient-to-r from-[#0284c7] via-[#29a5e9] to-[#0980c3] cursor-pointer flex justify-center items-center gap-2 font-medium text-white transition-all duration-300 hover:scale-[1.03]" onClick={()=>navigate("/discover")}>
          {/* <button className="border h-full w-full flex justify-center items-center gap-2 font-medium text-white cursor-pointer"> */}
            <span>
              <SparklesIcon className="w-6 h-6" />
            </span>
            <span>New Intelligence</span>
          {/* </button> */}
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={classNames(
                        // item.current
                        //   ? "bg-[#E0F5FF] text-[#0284C7] font-medium"
                        //   : "text-black hover:bg-gray-100",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-regular hover:bg-[#F0F9FF] hover:text-[#0284C7]",
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          // item.current ? 'text-black' : 'text-indigo-200 group-hover:text-white',
                          "size-6 shrink-0",
                        )}
                      />
                      {item.name}
                      {item.count ? (
                        <span
                          aria-hidden="true"
                          className="ml-auto w-9 min-w-max rounded-full bg-[#E0F5FF] px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-[#0284C7] outline-1 -outline-offset-1 outline-[#E0F5FF]"
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-2">
              <div className="text-xs/6 font-semibold text-black">ACCOUNT</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {teams.map((team) => (
                  <li key={team.name}>
                    <NavLink
                      // style={{ textDecoration: "none" }}
                      to={team.href}
                      className={classNames(
                        // team.current
                        //   ? "bg-[#E0F5FF] text-[#0284C7] font-medium"
                        //   : "text-black hover:bg-gray-100 hover:text-black",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-regular hover:bg-[#F0F9FF] hover:text-[#0284C7]",
                      )}
                    >
                      {/* <span className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium text-black">
                      {team.initial}
                    </span> */}
                      <team.icon
                        aria-hidden="true"
                        className={classNames(
                          // item.current ? 'text-black' : 'text-indigo-200 group-hover:text-white',
                          "size-6 shrink-0",
                        )}
                      />
                      <span className="truncate">{team.name}</span>
                    </NavLink>
                  </li>
                ))}

                <div
                  className="flex gap-x-3 rounded-md p-2 text-sm/6 font-regular cursor-pointer hover:bg-[#F0F9FF] hover:text-[#0284C7]"
                  onClick={handleLogout}
                >
                  <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
                  logout
                </div>
              </ul>
            </li>

            <li className="-mx-6 mt-auto">
              <div className="mb-3 py-3 px-6">
                <div className="p-2 rounded-lg bg-[linear-gradient(102deg,rgba(2,132,199,0.10)_-8.81%,rgba(1,99,224,0.05)_103.39%)]">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span>
                        <BoltIcon className="h-5 w-5 text-yellow-500" />
                      </span>
                      <span className="text-[13px]">Scout Plan</span>
                    </div>
                    <div>
                      <span className="text-xl font-semibold">{used}</span>
                      <span className="text-[#5F6368] text-[14px]">
                        /{total}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 my-2 bg-[#A9B3B1] rounded">
                    <div
                      className="h-full bg-[#0284C7] rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p>
                    <span className="text-[#5F6368] text-[11px]">
                      {used} queries used: Resets in{" "}
                    </span>
                    <span className="text-[14px] font-medium text-[#0284C7]">
                      {!usage_date || isNaN(new Date(usage_date).getTime())
                        ? ""
                        : (() => {
                            const now = new Date();
                            const target = new Date(usage_date);

                            const days = Math.ceil(
                              (target - now) / (1000 * 60 * 60 * 24),
                            );

                            if (days <= 0) return "Expired";
                            if (days === 0) return "Today";
                            return `${days} days`;
                          })()}
                    </span>
                  </p>

                  <div className="bg-[#0284C7] hover:bg-[#0369A1] rounded mt-2 transition-all duration-300">
                    <button className="flex justify-center gap-2.5 items-center h-full w-full py-1.5 text-white rounded cursor-pointer" onClick={()=>navigate("/pricing")}>
                      <span>
                        <ArrowUpCircleIcon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px]">Upgrade</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-x-4 px-6 py-1 text-sm/6 font-regular text-white cursor-pointer"
                onClick={() => setOpen_profile(true)}
              >
                <img
                  alt="user"
                  src={Ellipse_11}
                  className="size-9 rounded-full outline -outline-offset-1 outline-white/10"
                />
                <span>
                  <span aria-hidden="true" className="text-black">
                    {name || ""}
                  </span>
                  <br />
                  <span
                    aria-hidden="true"
                    className="block -mt-2 text-[#5F6368] text-[11px]"
                  >
                    Premium Account
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {open_profile && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen_profile(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl">
            <Profile
              setOpen_profile={setOpen_profile}
              full_name={full_name}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              country={country}
              setCountry={setCountry}
              company_name={company_name}
              setCompany_name={setCompany_name}
              industry={industry}
              setIndustry={setIndustry}
              business_type={business_type}
              business_type_data={business_type_data}
              setBusiness_Type={setBusiness_Type}
              handleProfile1={handleProfile1}
              current_password={current_password}
              setCurrent_password={setCurrent_password}
              new_password={new_password}
              setNew_password={setNew_password}
              confirm_password={confirm_password}
              setConfirm_password={setConfirm_password}
              handleProfile2={handleProfile2}
              passError={passError}
              handleProfile3={handleProfile3}
            />
          </div>
        </>
      )}
    </>
  );
};
export default SideBar;

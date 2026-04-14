import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
const Profile = ({ setOpen_profile,profil_data }) => {
  const [active_tab, setActive_tab] = useState("Personal Info");

  const [active_com, setActive_com] = useState("Manufacturer");

  const tab_btn = [
    "Personal Info",
    "Security",
    "Business Profile",
    "Plan & Billing",
  ];

  return (
    <>
      <div
        className="w-175 m-auto bg-white rounded-lg h-144"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5">
          <p className="text-xl font-medium">Account Profile</p>
          <button
            className="border border-gray-700 p-1 rounded cursor-pointer"
            onClick={() => setOpen_profile(false)}
          >
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="h-20 w-full bg-[#0284C7] relative">
          <div className="border-3 h-17 w-17 rounded-full uppercase font-bold text-3xl flex justify-center items-center absolute left-15 -bottom-8 text-white bg-[#0284C7]">
            AS
          </div>
        </div>

        <p className="mt-12 px-4 text-xl">Arjun Shah</p>

        <p className="px-4 flex gap-3 text-sm font-regular text-[#5F6368] text-sm mt-2">
          <span>arjun@greenleaf.in</span>
          <span className="text-[#0284C7] bg-[#E0F5FF] rounded-2xl px-2 py-0.5 font-medium">
            Scout Plan
          </span>
          <span>Member since March 2026</span>
        </p>

        <div className="mt-4 flex gap-8 text-[#5F6368] px-4">
          {tab_btn?.map((itm, i) => {
            return (
              <div
                className={`py-2 px-1 cursor-pointer ${active_tab === itm ? "text-[#0284C7] border-b-2 border-[#0284C7] font-medium" : ""}`}
                onClick={() => setActive_tab(itm)}
                key={i}
              >
                {itm}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4">
          {active_tab === "Personal Info" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="full name"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="tel"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Phone no
                </label>
                <div className="mt-1">
                  <input
                    id="tel"
                    name="tel"
                    type="number"
                    placeholder="+91 9876543210"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Country
                </label>
                <div className="mt-1">
                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="country name"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <button className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer">
                  save changes
                </button>
              </div>
            </div>
          )}

          {active_tab === "Security" && (
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                >
                  Current Password <sup>*</sup>
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="h-21">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    New Password <sup>*</sup>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="h-21">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Confirm Password <sup>*</sup>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {active_tab === "Business Profile" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="company name"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Industry
                </label>
                <div className="mt-1">
                  <input
                    id="industry"
                    name="industry"
                    type="text"
                    placeholder="Industry"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm/6 font-medium text-gray-900">
                  Business Type
                </p>
                <div className="text-sm font-medium flex gap-3 mt-1">
                  <button
                    className={`border  px-4 py-1.5 rounded-2xl ${active_com === "Manufacturer" ? "bg-[#E0F5FF] text-[#0284C7]" : "text-[#5F6368] bg-gray-200"}`}
                  >
                    Manufacturer
                  </button>
                  <button
                    className={`border  px-4 py-1.5 rounded-2xl ${active_com === "Distributor" ? "bg-[#E0F5FF] text-[#0284C7]" : "text-[#5F6368] bg-gray-200"}`}
                  >
                    Distributor
                  </button>
                  <button
                    className={`border  px-4 py-1.5 rounded-2xl ${active_com === "Brand" ? "bg-[#E0F5FF] text-[#0284C7]" : "text-[#5F6368] bg-gray-200"}`}
                  >
                    Brand
                  </button>
                </div>
              </div>
              <div></div>

              <div className="mt-3">
                <button className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer">
                  save changes
                </button>
              </div>
            </div>
          )}
          {active_tab === "Plan & Billing" && (
            <div>
              <div className="border p-3 bg-[#E0F5FF] border-[#0284C7] rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#000000]">Scout Plan</p>
                  <p className="text-sm font-regular text-[#5F6368]">
                    $49/month · 100 queries · 2 modules
                  </p>
                </div>
                <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                  Upgrade →
                </button>
              </div>
              <p className="text-sm font-regular text-[#5F6368] mt-4">
                Next billing: April 1, 2026 · Cancel anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Profile;

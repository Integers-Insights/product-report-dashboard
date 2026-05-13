import { XMarkIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = ({
  setOpen_profile,
  full_name,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  country,
  company_name,
  setCompany_name,
  industry,
  setIndustry,
  business_type,
  setBusiness_Type,
  business_type_data,
  handleProfile1,
  current_password,
  setCurrent_password,
  new_password,
  setNew_password,
  confirm_password,
  setConfirm_password,
  handleProfile2,
  passError,
  handleProfile3,
}) => {
  const [active_tab, setActive_tab] = useState("Personal Info");
  const [editBussinessType, setEditBussinessType] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const tab_btn = [
    "Personal Info",
    "Security",
    "Business Profile",
    "Plan & Billing",
  ];

  const handleDeleteProfile = async () => {
    let confirmDelete = confirm("Are you sure?");
    if (confirmDelete) {
      try {
        setDeleting(true);
        let user_data = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");
        const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

        if (!user_data) {
          alert("No user data found");
          return;
        }

        const parsedData = JSON.parse(user_data);

        const userId = parsedData?.user_id;

        if (!userId) {
          alert("User ID not found");
          return;
        }

        const response = await fetch(`${base_url}/account/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          localStorage.removeItem("CtKoIC)iR1SP)5mr&R4d");
          localStorage.removeItem("VZyHRIoNN3m)OXhGwCtC");
          navigate("/signup");
          alert("Profile deleted successfully");
        }
      } catch (error) {
        alert("Failed to delete profile");
      } finally {
        setDeleting(false);
      }
    } else {
      alert("Profile not delete.");
    }
  };

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
            {typeof full_name === "string"
              ? full_name
                  .trim()
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word[0]?.toUpperCase() || "")
                  .join("")
              : ""}
          </div>
        </div>

        <p className="mt-12 px-4 text-xl">{full_name}</p>

        <div className="px-4 flex justify-between items-center text-sm font-regular text-[#5F6368] mt-2">
          <p className="flex gap-3 items-center">
            <span>{email}</span>
            <span className="text-[#0284C7] bg-[#E0F5FF] rounded-2xl px-2 py-0.5 font-medium">
              Scout Plan
            </span>
            <span>Member since March 2026</span>
          </p>
          <button
            className="border ml-10 px-3 py-1 rounded-lg cursor-pointer disabled:cursor-not-allowed text-white font-medium bg-red-500 hover:bg-red-600"
            onClick={handleDeleteProfile}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>

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
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    value={country}
                    readOnly
                    placeholder="country name"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <button
                  className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer"
                  onClick={handleProfile1}
                >
                  save changes
                </button>
              </div>
            </div>
          )}

          {active_tab === "Security" && (
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="currentpassword"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                >
                  Current Password <sup>*</sup>
                </label>
                <div className="mt-1">
                  <input
                    id="currentpassword"
                    name="current_password"
                    type="password"
                    value={current_password}
                    onChange={(e) => setCurrent_password(e.target.value)}
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                      passError && !current_password
                        ? "outline-red-500 border-red-500 focus:outline-red-500"
                        : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
                    }`}
                  />

                  {passError && !current_password && (
                    <p className="text-red-500 text-sm text-right mt-1">
                      Enter current password
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="h-21">
                  <label
                    htmlFor="newpassword"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    New Password <sup>*</sup>
                  </label>

                  <div className="mt-1">
                    <input
                      id="newpassword"
                      name="new_password"
                      type="password"
                      value={new_password}
                      onChange={(e) => setNew_password(e.target.value)}
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                        passError && !new_password
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
                      }`}
                    />

                    {passError && !new_password && (
                      <p className="text-red-500 text-sm text-right mt-1">
                        Enter new password
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-21">
                  <label
                    htmlFor="confirmpassword"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Confirm Password <sup>*</sup>
                  </label>

                  <div className="mt-1">
                    <input
                      id="confirmpassword"
                      name="confirm_password"
                      type="password"
                      value={confirm_password}
                      onChange={(e) => setConfirm_password(e.target.value)}
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                        (passError && !confirm_password) ||
                        (confirm_password && new_password !== confirm_password)
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-[var(--color-brand-primary1)]"
                      }`}
                    />
                    {passError && !confirm_password && (
                      <p className="text-red-500 text-sm text-right mt-1">
                        Enter confirm password
                      </p>
                    )}
                    {confirm_password && new_password !== confirm_password && (
                      <p className="text-red-500 text-sm text-right mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer"
                  onClick={handleProfile2}
                >
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
                    value={company_name}
                    onChange={(e) => setCompany_name(e.target.value)}
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
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry"
                    className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm/6 font-medium text-gray-900">
                  Business Type
                </p>

                <div className="flex justify-between items-center">
                  <button className="text-sm font-medium flex gap-3 mt-1 px-4 py-1.5 rounded-2xl bg-[#E0F5FF] text-[#0284C7]">
                    {business_type_data}
                  </button>
                  <button
                    className="cursor-pointer"
                    onClick={() => setEditBussinessType(!editBussinessType)}
                  >
                    <PencilSquareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div>
                {editBussinessType && (
                  <div className="mt-5.5">
                    <input
                      id="BussinessType"
                      name="BussinessType"
                      type="text"
                      value={business_type}
                      onChange={(e) => setBusiness_Type(e.target.value)}
                      placeholder="Bussiness type"
                      className="block w-full rounded-md bg-white px-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                    />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button
                  className="bg-[#0284C7]  text-white font-medium px-3 py-1 rounded-lg cursor-pointer"
                  onClick={handleProfile3}
                >
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
                <button
                  className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white"
                  onClick={() => alert("hii")}
                >
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

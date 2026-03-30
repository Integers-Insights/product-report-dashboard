import { IoEyeOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../URL";
import toast from 'react-hot-toast';
import DashNav from "./DashNav";

const AllReports = () => {

    const [reportsData, setReportsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState([]);
    const [filterIndustry, setFilterIndustry] = useState([]);
    const [filterCountry, setFilterCountry] = useState([]);
    const [filterType, setFilterType] = useState([]);
    const [allReports, setAllReports] = useState([]);
    const [search, setSearch] = useState("");

    // for filter
    const [filters, setFilters] = useState({
        industries: [],
        status: [],
        report_types: [],
        regions: [],
        countries: [],
        min_price: 0,
        max_price: 0,
        sort: ""
    });

    const navigate = useNavigate();

    const getAllReportData = async () => {
        try {
            setLoading(true);
            let result = await fetch(`${base_url}/reports/list`, {
                method: "GET",
                credentials: "include"
            });

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();

            if (Array.isArray(data?.reports)) {
                setAllReports(data.reports);
                setReportsData(data.reports);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("something went wrong...");
        } finally {
            setLoading(false);
        }
    }

    const getFilterData = async () => {
        try {
            let fResult = await fetch(`${base_url}/filters`, {
                method: "GET",
                credentials: "include"
            });

            if (!fResult.ok) {
                throw new Error(`HTTP error! status: ${fResult.status}`);
            }

            let fData = await fResult.json();

            if (fData) {
                setFilterStatus(fData?.status);
                setFilterIndustry(fData?.industries);
                setFilterCountry(fData?.countries);
                setFilterType(fData?.report_types);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("something went wrong...", err.message);
        }
    }

    useEffect(() => {
        getAllReportData();
        getFilterData();
    }, []);

    const handleReportDataDelete = async (index) => {
        var confirmation = confirm("Are you sure...");
        if (confirmation) {
            try {
                let data = await fetch(`${base_url}/reports/${index}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (!data.ok) {
                    throw new Error(`HTTP error! status: ${data.status}`);
                }

                let result = await data.json();

                if (result.success) {
                    toast.success("Report delete Successfully");
                    getAllReportData();
                }
            }
            catch (err) {
                toast.error(err.message);
                console.log("something went wrong...");
            }
        }
        else {
            toast.error("Data not delete...");
        }
    }

    const handleSelectChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value ? [value] : []
        }));
    };

    const handleSortChange = (value) => {
        setFilters((prev) => ({
            ...prev,
            sort: value
        }));
    };

    useEffect(() => {
        const hasAnyFilter =
            filters.industries.length ||
            filters.status.length ||
            filters.report_types.length ||
            filters.countries.length ||
            filters.sort;

        if (!hasAnyFilter) {
            setReportsData(allReports);
            return;
        }

        const applyFilters = async () => {
            try {
                setLoading(true);
                const payload = {
                    ...filters,
                    regions: []
                };

                const res = await fetch(`${base_url}/reports/filter`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                
                if (Array.isArray(data.items)) {
                    setReportsData(data?.items)
                }
            } catch (err) {
                toast.error(err.message);
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };

        applyFilters();
    }, [filters, allReports]);


    useEffect(() => {
        if (!search.trim()) {
            setReportsData(allReports);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${base_url}/reports/search?q=${encodeURIComponent(search)}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (Array.isArray(data.items)) {
                    setReportsData(data.items);
                }
            } catch (err) {
                toast.error(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search, allReports]);

    return (
        <>
        <DashNav/>
        <div className=" bg-gray-100">
            <div className=" w-285 m-auto py-5">
                <h1 className="text-primary text-24 font-semibold">All Reports</h1>
                <div className=" h-9 mt-3">
                    <input type="search" className="border border-gray-200 h-full w-full px-2 bg-surface" placeholder="Search..." value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                </div>
                <h2 className="text-primary text-16 font-semibold mt-8">Filters</h2>
                <div className=" h-9 mt-3 flex gap-3">
                    <div className=" w-50">
                        <select name="" id="" className="w-full h-full bg-surface border border-gray-200" onChange={(e) => handleSelectChange("status", e.target.value)}>
                            <option value="">--- Select status ---</option>
                            {filterStatus.map((st, i) => {
                                return (
                                    <option key={i} value={st.name}>{st.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-50">
                        <select name="" id="" className="w-full h-full bg-surface border border-gray-200" onChange={(e) => handleSelectChange("industries", e.target.value)}>
                            <option value="">--- Select Industry ---</option>
                            {filterIndustry.map((ind, i) => {
                                return (
                                    <option key={ind.id} value={ind.name}>{ind.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-50">
                        <select name="" id="" className="w-full h-full bg-surface border border-gray-200" onChange={(e) => handleSelectChange("countries", e.target.value)}>
                            <option value="">--- Select Country ---</option>
                            {filterCountry.map((cun, i) => {
                                return (
                                    <option key={cun.id} value={cun.name}>{cun.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-50">
                        <select name="" id="" className="w-full h-full bg-surface border border-gray-200" onChange={(e) => handleSelectChange("report_types", e.target.value)}>
                            <option value="">--- Select Report Type ---</option>
                            {filterType.map((typ, i) => {
                                return (
                                    <option key={typ.id} value={typ.name}>{typ.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-50">
                        <select name="" id="" className="w-full h-full bg-surface  border border-gray-200" onChange={(e) => handleSortChange(e.target.value)}>
                            <option value="">--- Sort ---</option>
                            <option value="updated_recent">updated_recent</option>
                            <option value="updated_oldest">updated_oldest</option>
                            <option value="price_high_low">price_high_low</option>
                            <option value="price_low_high">price_low_high</option>
                        </select>
                    </div>
                </div>

                <div className="mt-10 mx-auto w-[1140px] border flex font-medium">
                    <div className="table-row w-[320px]">Title</div>
                    <div className="table-row w-[220px]">Industry</div>
                    <div className="table-row w-[140px]">Country</div>
                    <div className="table-row w-[120px]">Status</div>
                    <div className="table-row w-[90px]">Version</div>
                    <div className="table-row w-[120px]">Full Price</div>
                    <div className="table-row w-[120px]">Updated</div>
                    <div className="table-row w-[120px]">Active</div>
                </div>

                {/* data1 */}
                {loading ? <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div> :
                    <>
                        {reportsData?.map((itm, i) => {
                            return (
                                <div className="mx-auto w-[1140px] border border-gray-500 flex items-stretch text-16 table-bg" key={itm.report_id}>
                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[320px] break-words whitespace-normal">
                                        {itm?.title}
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[220px] break-words whitespace-normal">
                                        {itm?.industry}
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[140px] break-words whitespace-normal">
                                        {itm?.country}
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[120px] break-words">
                                        {itm?.status}
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[90px]">
                                        {itm?.version}
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[120px] break-words">
                                        {itm?.full_price?.toString().length > 5
                                            ? itm?.full_price?.toString().slice(0, 5) + ".."
                                            : itm?.full_price}

                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[120px]">
                                        {
                                            itm?.updated_at &&
                                            new Date(itm.updated_at).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })
                                        }
                                    </div>

                                    <div className="border border-gray-500 border-t-0 px-2 py-2 w-[120px] flex justify-center items-center gap-3">
                                        <button className="cursor-pointer hover:text-gray-700" onClick={() => navigate(`/single-report/${itm.report_id}`)}><IoEyeOutline className="text-20" /></button>
                                        <button className="cursor-pointer hover:text-gray-700" onClick={() => navigate(`/add/${itm.report_id}`)}><BiEditAlt className="text-20" /></button>
                                        <button className="cursor-pointer hover:text-gray-700" onClick={() => handleReportDataDelete(itm.report_id)}><RiDeleteBin6Line className="text-20" /></button>
                                    </div>
                                </div>
                            )
                        })}
                    </>}
            </div>
        </div>
        </>
    );
};
export default AllReports;

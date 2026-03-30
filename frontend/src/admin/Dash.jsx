import { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { base_url } from "../URL";
import toast from 'react-hot-toast';
import { recentActivity, warningData } from "../components/Data";
import DashNav from "./DashNav";

const Dash = () => {

    const [draftDataCard, setDraftDataCard] = useState([]);
    const [loading1, setLoading1] = useState(true);

    const [published_reports, setPublished_reports] = useState("");
    const [draft_reports, setDraft_reports] = useState("");
    const [purchases_1y, setPurchases_1y] = useState("");
    const [revenue_1y, setRevenue_1y] = useState("");
    const [impressions, setImpressions] = useState("");

    const navigate = useNavigate();

    const getDraftData = async () => {
        try {
            setLoading1(true);
            let result = await fetch(`${base_url}/reports/my-drafts`, {
                method: "GET",
                credentials: "include"
            });

            if (!result.ok) {
                toast.error("Failed to fetch drafts:", result.status);
                setDraftDataCard([]);
                return;
            }

            let data = await result.json();

            if (Array.isArray(data)) {
                setDraftDataCard(data);
            }
            else {
                setDraftDataCard([]);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("Something went wrong...");
        } finally {
            setLoading1(false);
        }
    }

    const getCardData = async () => {
        try {
            let result = await fetch(`${base_url}/dashboard/summary`, {
                method: "GET",
                credentials: "include"
            });

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();

            if (data) {
                setPublished_reports(data?.published_reports ?? 0);
                setDraft_reports(data?.draft_reports ?? 0);
                setPurchases_1y(data?.purchases_1y ?? 0);
                setRevenue_1y(data?.revenue_1y ?? 0);
                setImpressions(data?.impressions ?? 0);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("Something went wrong...");
        }
    }

    useEffect(() => {
        getDraftData();
        getCardData();
    }, []);

    return (
        <>
        <DashNav/>
        <div className=" bg-gray-100">
            <div className=" w-293 m-auto py-11">
                <div className=" grid grid-cols-5 gap-5.5">
                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-primary text-20 font-regular">
                        <p>Published Reports</p>
                        <p>{published_reports || 0}</p>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-primary text-20 font-regular">
                        <p>Draft Reports</p>
                        <p>{draft_reports || 0}</p>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-primary text-20 font-regular">
                        <p>Purchases (1y)</p>
                        <p>{purchases_1y || 0}</p>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-primary text-20 font-regular">
                        <p>Revenue (1y)</p>
                        <p>{revenue_1y || 0}</p>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-primary text-20 font-regular">
                        <p>Impressions</p>
                        <p>{impressions || 0}</p>
                    </div>


                </div>

                {/* button */}
                <div className=" w-174 m-auto grid grid-cols-3 gap-8.5 my-11">
                    <div className=" w-52 h-13 text-center"><button className=" w-full h-full cursor-pointer bg-brand hover:bg-[var(--color-brand-primary-hover)] text-primary text-16 font-medium" onClick={() => navigate("/add")}>Add New Report</button></div>
                    <div className=" w-52 h-13 text-center"><button className=" w-full h-full cursor-pointer bg-brand hover:bg-[var(--color-brand-primary-hover)] text-primary text-16 font-medium" onClick={() => navigate("/all")}>View All Reports</button></div>
                    <div className=" w-52 h-13 text-center"><button className=" w-full h-full cursor-pointer bg-brand hover:bg-[var(--color-brand-primary-hover)] text-primary text-16 font-medium">View Orders</button></div>
                </div>

                {/* draft card */}
                {loading1 ? <div className="flex justify-center items-center h-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div> :
                    <div className=" w-293 m-auto grid grid-cols-3 gap-8.5">
                        {draftDataCard?.map((itm, i) => {
                            return (
                                <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" key={itm.report_id}>
                                    <div className=" borderred-500 h-20 flex gap-2 mb-2">
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 8.27206L8.27206 3H15.7279L21 8.27206V15.7279L15.7279 21H8.27206L3 15.7279V8.27206Z" fill="#F9A925" />
                                            <path d="M12.0088 14.25C12.423 14.25 12.7588 14.5858 12.7588 15C12.7588 15.4142 12.423 15.75 12.0088 15.75H12C11.5858 15.75 11.25 15.4142 11.25 15C11.25 14.5858 11.5858 14.25 12 14.25H12.0088Z" fill="white" />
                                            <path d="M12.7578 8L12.7578 12C12.7578 12.4142 12.422 12.75 12.0078 12.75C11.5936 12.75 11.2578 12.4142 11.2578 12L11.2578 8C11.2578 7.58579 11.5936 7.25 12.0078 7.25C12.422 7.25 12.7578 7.58579 12.7578 8Z" fill="white" />
                                        </svg></span>
                                        <p className="text-primary font-medium text-16">{(itm?.title).length > 80 ? (itm?.title).slice(0, 80) + "..." : itm?.title}</p>
                                    </div>

                                    <div className=" flex justify-between items-center">
                                        <button className="py-2 px-4 bg-brand text-primary font-medium text-15 cursor-pointer hover:bg-[var(--color-brand-primary-hover)]" onClick={() => navigate(`/add/${itm.report_id}`)}>Edit Now</button>
                                        <span><span className="font-medium">Edit on: </span>
                                            {
                                                itm?.updated_at &&
                                                new Date(itm.updated_at).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })
                                            }
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }

                {/* message */}
                <div className=" w-293 m-auto grid grid-cols-2 gap-15 mt-11">
                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <h1 className="text-24 text-primary font-semibold mb-3">Recent Activity</h1>
                        {
                            recentActivity?.map((item, i) => {
                                return (
                                    <p className="text-16 text-primary font-regular" key={i}>- {item}</p>
                                )
                            })
                        }
                    </div>
                    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <h1 className="text-24 text-primary font-semibold mb-3">Alerts/Warning</h1>
                        {
                            warningData?.map((itm, i) => {
                                return (
                                    <p className="text-16 text-primary font-regular flex items-center gap-2" key={i}><IoIosWarning className="text-yellow-500" />{itm}</p>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
export default Dash;

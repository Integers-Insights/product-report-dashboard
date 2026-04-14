import banner1 from "../assets/banner01.svg";
import ellipse_3 from "../assets/Ellipse 3.svg";
import ellipse_8 from "../assets/Ellipse 8.svg";
import ellipse_9 from "../assets/Ellipse 9.svg";
import ellipse_10 from "../assets/Ellipse 10.svg";
import ellipse_4 from "../assets/Ellipse 4.svg";
import ellipse_5 from "../assets/Ellipse 5.svg";
import ellipse_6 from "../assets/Ellipse 6.svg";
import ellipse_7 from "../assets/Ellipse 7.svg";
import Tab from "./Tab";
import { useState } from "react";
import Overview from "./Overview";
import Markets from "./Markets";
import Trade from "./Trade";
import Variants from "./Variants";
import Kpis from "./Kpis";
import Buyer from "./Buyer";
import Competitors from "./Competitors";
import Marketingkit from "./Marketingkit";
import {
    ArrowRightIcon,
    ChartBarSquareIcon,
    BuildingStorefrontIcon,
    HomeIcon,
    ArrowsRightLeftIcon,
    UserGroupIcon,
    BanknotesIcon,
    SwatchIcon,
    BriefcaseIcon,
    MegaphoneIcon,
    TrophyIcon,
} from "@heroicons/react/24/outline";
import PriceAnalysis from "./PriceAnalysis";

const ProductReoport = () => {

    const [activeTab, setActiveTab] = useState("Overview");

    // progress
    const value = 82;
    const size = 81;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const safeValue = Math.min(100, Math.max(0, value || 0));
    const progress = (safeValue / 100) * circumference;


    return (
        <>
            <div className="p-6 flex justify-between rounded-xl text-[#FFFFFF] bg-cover bg-center" style={{ backgroundImage: `url(${banner1})` }}>
                <div>
                    <p className="text-xs font-light"><span>INDIVIDUAL PRODUCT REPORT</span> ・ <span>INDIVIDUAL PRODUCT REPORT</span></p>
                    <h1 className="text-[28px] font-semibold mt-1">Organic Turmeric Powder</h1>
                    <div className="flex gap-9 items-center mt-3">
                        <div className="text-xs font-light">HS 0910.30</div>
                        <div className="flex gap-1.5">
                            <button className="border py-0.5 px-3 rounded-full">GMP</button>
                            <button className="border py-0.5 px-3 rounded-full">USDA Organic</button>
                            <button className="border py-0.5 px-3 rounded-full">ISO</button>
                        </div>
                        <div className="flex gap-1.5 items-center">
                            <div className="h-6 w-6 rounded-full"><img src={ellipse_8} alt="" /></div>
                            <div><ArrowRightIcon className="h-5 w-5" /></div>
                            <div className="flex relative w-20 h-8">
                                <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0"><img src={ellipse_3} alt="" /></div>
                                <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3"><img src={ellipse_4} alt="" /></div>
                                <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6"><img src={ellipse_9} alt="" /></div>
                                <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9"><img src={ellipse_10} alt="" /></div>
                                <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12"><img src={ellipse_7} alt="" /></div>
                            </div>
                        </div>
                        <div className="text-sm font-medium">
                            <span>B2B</span>
                            <span>・</span>
                            <span>Mid-range </span>
                            <span>・</span>
                            <span>$8.50/kg</span>
                        </div>
                    </div>

                    <div className="mt-6 text-[#FFFFFF] grid grid-cols-6 gap-4">
                        <div className="flex justify-between">
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">100+</h2>
                                <p className="text-xs font-light">BUYERS FOUND</p>
                            </div>
                            <div className="w-[0.5px] bg-[#FFFFFF]"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">5</h2>
                                <p className="text-xs font-light">EASY WIN MARKETS</p>
                            </div>
                            <div className="w-[1px] bg-[#FFFFFF]"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">+19%</h2>
                                <p className="text-xs font-light">AVG YOY DEMAND</p>
                            </div>
                            <div className="w-[1px] bg-[#FFFFFF]"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">Q2</h2>
                                <p className="text-xs font-light">BUY WINDOW</p>
                            </div>
                            <div className="w-[1px] bg-[#FFFFFF]"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">3</h2>
                                <p className="text-xs font-light">OPEN RFQS</p>
                            </div>
                            <div className="w-[1px] bg-[#FFFFFF]"></div>
                        </div>
                        <div>
                            <div className="p-0.5">
                                <h2 className="text-xl font-semibold">$8-35</h2>
                                <p className="text-xs font-light">PRICE RANGE</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div>
                    <svg width={size} height={size}>
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="#27C727"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${progress} ${circumference}`}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                        <text
                            x="50%"
                            y="52%"
                            textAnchor="middle"
                            fontSize="28px"
                            fontWeight="600"
                            fill="#FFFFFF"
                        >
                            {safeValue}
                        </text>
                        <text
                            x="50%"
                            y="68%"
                            textAnchor="middle"
                            fontSize="12px"
                            fontWeight="300"
                            fill="#FFFFFF"
                        >
                            Score
                        </text>
                    </svg>
                </div>
            </div>

            {/* <div className="border overflow-hidden w-full max-w-full">
                <div className="border-b border-[#A9B3B1] flex gap-8 pb-0.5 bg-[#FFFFFF] overflow-x-scroll border whitespace-nowrap max-w-[60%]"> */}

            <div className="overflow-hidden w-full">
                <div className="border-b border-[#A9B3B1] bg-white pb-0.5">
                    <div className="flex gap-8 overflow-x-auto whitespace-nowrap w-0 min-w-full">
                        <Tab
                            label="Overview"
                            isActive={activeTab === "Overview"}
                            onClick={() => setActiveTab("Overview")}
                            icon={ChartBarSquareIcon}
                        />
                        <Tab
                            label="Markets"
                            isActive={activeTab === "Markets"}
                            onClick={() => setActiveTab("Markets")}
                            icon={BuildingStorefrontIcon}
                        />
                        <Tab
                            label="Trade"
                            isActive={activeTab === "Trade"}
                            onClick={() => setActiveTab("Trade")}
                            icon={ArrowsRightLeftIcon}
                        />
                        <Tab
                            label="Buyers"
                            isActive={activeTab === "Buyers"}
                            onClick={() => setActiveTab("Buyers")}
                            icon={UserGroupIcon}
                        />
                        <Tab
                            label="Price Analysis"
                            isActive={activeTab === "Price Analysis"}
                            onClick={() => setActiveTab("Price Analysis")}
                            icon={BanknotesIcon}
                        />
                        <Tab
                            label="Variants & Formats"
                            isActive={activeTab === "Variants & Formats"}
                            onClick={() => setActiveTab("Variants & Formats")}
                            icon={SwatchIcon}
                        />
                        <Tab
                            label="Competitors"
                            isActive={activeTab === "Competitors"}
                            onClick={() => setActiveTab("Competitors")}
                            icon={BriefcaseIcon}
                        />
                        <Tab
                            label="Marketing Kit"
                            isActive={activeTab === "Marketing Kit"}
                            onClick={() => setActiveTab("Marketing Kit")}
                            icon={MegaphoneIcon}
                        />
                        <Tab
                            label="Kpis & Actions"
                            isActive={activeTab === "Kpis & Actions"}
                            onClick={() => setActiveTab("Kpis & Actions")}
                            icon={TrophyIcon}
                        />

                        {/*  */}
                        {/* <Tab
                            label="Kpis1"
                            isActive={activeTab === "Kpis1"}
                            onClick={() => setActiveTab("Kpis1")}
                            icon={HomeIcon}
                        />
                        <Tab
                            label="Kpis2"
                            isActive={activeTab === "Kpis2"}
                            onClick={() => setActiveTab("Kpis2")}
                            icon={HomeIcon}
                        />
                        <Tab
                            label="Kpis3"
                            isActive={activeTab === "Kpis3"}
                            onClick={() => setActiveTab("Kpis3")}
                            icon={HomeIcon}
                        />
                        <Tab
                            label="Kpis4"
                            isActive={activeTab === "Kpis4"}
                            onClick={() => setActiveTab("Kpis4")}
                            icon={HomeIcon}
                        /> */}
                    </div>
                </div>
            </div>

            <div className='w-full bg-surface mt-3 border border-[#E6E6E6] p-4 rounded-lg'>
                {activeTab === "Overview" && <Overview />}
                {activeTab === "Markets" && <Markets />}
                {activeTab === "Trade" && <Trade />}
                {activeTab === "Buyers" && <Buyer />}
                {activeTab === "Price Analysis" && <PriceAnalysis /> }
                {activeTab === "Variants & Formats" && <Variants />}
                {activeTab === "Competitors" && <Competitors />}
                {activeTab === "Marketing Kit" && <Marketingkit />}
                {activeTab === "Kpis & Actions" && <Kpis />}
            </div>
        </>
    );
};
export default ProductReoport;
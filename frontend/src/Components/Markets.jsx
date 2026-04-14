import { BuildingStorefrontIcon, SparklesIcon, BoltIcon } from "@heroicons/react/24/outline";
import CircularProgress from "./CircularProgress";
import ellipse_3 from '../assets/Ellipse 3.svg'
import ellipse_4 from '../assets/Ellipse 4.svg'

const cardData = [
    {
        id: 1,
        image: ellipse_3,
        txt1: "United States",
        txt2: "HS 0910.30 — largest importer",
        val: 91,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "None detected",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    },
    {
        id: 2,
        image: ellipse_4,
        txt1: "Germany",
        txt2: "HS 0910.30 — largest importer",
        val: 87,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "SpiceGuru — 8 days ago",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    },
    {
        id: 3,
        image: ellipse_4,
        txt1: "Germany",
        txt2: "HS 0910.30 — largest importer",
        val: 87,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "SpiceGuru — 8 days ago",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    },
    {
        id: 4,
        image: ellipse_3,
        txt1: "United States",
        txt2: "HS 0910.30 — largest importer",
        val: 91,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "None detected",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    },
    {
        id: 5,
        image: ellipse_4,
        txt1: "Germany",
        txt2: "HS 0910.30 — largest importer",
        val: 87,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "SpiceGuru — 8 days ago",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    },
    {
        id: 6,
        image: ellipse_4,
        txt1: "Germany",
        txt2: "HS 0910.30 — largest importer",
        val: 87,
        txt3: "Demand Growth",
        txt4: "↑ 18% YoY",
        txt5: "Import volume 2025",
        txt6: "18,400 MT",
        txt7: "Matched buyers",
        txt8: "120+",
        txt9: "Peak procurement",
        txt10: "Oct-Jan",
        txt11: "Primary channel",
        txt12: "Contract manufacturers",
        txt13: "Cert requirement",
        txt14: "GMP+USDA Organic",
        txt15: "Cert gap",
        txt16: "SpiceGuru — 8 days ago",
        txt17: "Anti-inflammatory megatrend driving supplement demand. Contract manufacturers are the primary buyer segment — they procure 6–12 months ahead. GMP + USDA Organic is a hard requirement for the top 40% of buyers."
    }
]

const Markets = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Market Summary</h2>
                    <p className="text-[#5F6368] text-13 font-regular">Opportunity scores personalised to GMP + USDA Organic · India origin</p>
                </div>
                <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl">4 Easy Win Markets</div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
                {cardData?.map((item) => {
                    return (
                        <div className="border border-[#E6E6E6] p-3 rounded-lg card-hover" key={item.id}>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="h-6 w-6"><img src={item.image} alt="" /></div>
                                    <div>
                                        <h2 className="text-[#000000] text-sm font-medium">{item.txt1}</h2>
                                        <p className="text-[#5F6368] text-xs font-light">{item.txt2}</p>
                                    </div>
                                </div>
                                <div>
                                    <CircularProgress
                                        value={item.val}
                                        progressColor="#22c55e"
                                        textColor="#065f46"
                                        bgColor="#d1fae5"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt3}</p>
                                    <p className="text-[#2E7D32] text-xs font-regular">{item.txt4}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt5}</p>
                                    <p className="text-[#1E1E1E] text-xs font-regular">{item.txt6}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt7}</p>
                                    <p className="text-[#1E1E1E] text-xs font-regular">{item.txt8}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt9}</p>
                                    <p className="text-[#1E1E1E] text-xs font-regular">{item.txt10}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt11}</p>
                                    <p className="text-[#1E1E1E] text-xs font-regular">{item.txt12}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt13}</p>
                                    <p className="text-[#1E1E1E] text-xs font-regular">{item.txt14}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#5F6368] text-xs font-light">{item.txt15}</p>
                                    <p className="text-xs font-regular">
                                        {
                                            item.txt16 === "None detected" ?
                                                <span className="text-[#9FA2A6]">None detected</span>
                                                :
                                                <span className="flex gap-1">
                                                    <span><BoltIcon className="h-4 w-4 text-yellow-600" /></span>
                                                    <span className="text-[#0284C7]">{item.txt16}</span>
                                                </span>
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="border flex gap-2.5 p-3 border-[#A5F7A9] text-[#2E7D32] bg-[#F1FEF2] rounded-lg mt-2.5">
                                <div><SparklesIcon className="h-6 w-6" /></div>
                                <div className="text-13 font-regular">{item.txt17}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
export default Markets;
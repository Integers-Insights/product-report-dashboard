import { FunnelIcon } from "@heroicons/react/24/outline";

const listCardData = [
    {
        txt1: "NH",
        txt2: "Natural Health Distributors Inc.",
        txt3: "Active RFQ",
        txt4: "USA",
        txt5: "Contract Manufacturer",
        txt6: "Annual spend €800K–2M",
        txt7: "Previous supplier lost cert",
        txt8: "Munich, DE",
        txt9: "Search Outsearch",
        txt10: "View Profile",
        txt11: "94",
        txt12: "Match",
        view: false
    },
    {
        txt1: "NH",
        txt2: "Natural Health Distributors Inc.",
        txt3: "Active RFQ",
        txt4: "USA",
        txt5: "Contract Manufacturer",
        txt6: "Annual spend €800K–2M",
        txt7: "Previous supplier lost cert",
        txt8: "Munich, DE",
        txt9: "Search Outsearch",
        txt10: "View Profile",
        txt11: "94",
        txt12: "Match",
        view: false
    },
    {
        txt1: "NH",
        txt2: "Natural Health Distributors Inc.",
        txt3: "Active RFQ",
        txt4: "USA",
        txt5: "Contract Manufacturer",
        txt6: "Annual spend €800K–2M",
        txt7: "Previous supplier lost cert",
        txt8: "Munich, DE",
        txt9: "Search Outsearch",
        txt10: "View Profile",
        txt11: "94",
        txt12: "Match",
        view: false
    },
    {
        txt1: "NH",
        txt2: "Natural Health Distributors Inc.",
        txt3: "Active RFQ",
        txt4: "USA",
        txt5: "Contract Manufacturer",
        txt6: "Annual spend €800K–2M",
        txt7: "Previous supplier lost cert",
        txt8: "Munich, DE",
        txt9: "Search Outsearch",
        txt10: "View Profile",
        txt11: "94",
        txt12: "Match",
        view: true
    },
    {
        txt1: "NH",
        txt2: "Natural Health Distributors Inc.",
        txt3: "Active RFQ",
        txt4: "USA",
        txt5: "Contract Manufacturer",
        txt6: "Annual spend €800K–2M",
        txt7: "Previous supplier lost cert",
        txt8: "Munich, DE",
        txt9: "Search Outsearch",
        txt10: "View Profile",
        txt11: "94",
        txt12: "Match",
        view: true
    }
];

const Buyer = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Target Buyers</h2>
                    <p className="text-[#5F6368] text-13 font-regular">200+ matched companies · Sorted by opportunity score · Contact details on Venture+</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="bg-[#FFF8EE] text-[#A66A07] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5">Contacts need Venture+</div>
                    <div className="border border-gray-300 text-sm font-medium bg-gray-100 flex gap-2 items-center px-4 py-1.5 rounded-lg cursor-pointer">
                        <FunnelIcon className="h-5 w-5" /> Filter
                    </div>
                </div>

            </div>
            <div className="flex flex-col gap-6 mt-6">
                {listCardData?.map((item, i) => {
                    return (
                        <div className="border flex justify-between p-3 border-[#96DBFF] rounded-lg card-hover" key={i}>
                            <div className="flex gap-3 rounded-lg">
                                <div className={`h-10 w-10 bg-[#EDF9FF] text-[#008ACB] text-center content-center rounded-lg uppercase ${item.view && "blur-sm"}`}>{item.txt1}</div>
                                <div className={`flex flex-col gap-2 ${item.view && "blur-sm"}`}>
                                    <div className="flex gap-3">
                                        <p className="text-base font-medium text-[#000000]">{item.txt2}</p>
                                        <button className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">{item.txt3}</button>
                                        <button className="bg-[#EDF9FF] text-[#008ACB] text-xs font-medium px-2 py-0.5 rounded-2xl">{item.txt4}</button>
                                    </div>
                                    <div className="text-xs font-light text-[#5F6368] flex gap-5">
                                        <p>{item.txt5}</p>
                                        <p>{item.txt6}</p>
                                        <p>{item.txt7}</p>
                                        <p>{item.txt8}</p>
                                    </div>
                                    {!item.view && <div className="flex gap-3">
                                        <button className="bg-[#0284C7] text-sm font-medium text-[#FFFFFF] rounded-lg px-2 py-1">{item.txt9}</button>
                                        <button className="border border-[#D9D9D9] text-sm font-medium text-[#000000] rounded-lg px-2 py-1">{item.txt10}</button>
                                    </div>}

                                </div>
                            </div>
                            <div>

                                {item.view ?
                                    <button className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1">🔒 Venture+</button>
                                    :
                                    <>
                                        <h1 className="text-xl font-semibold text-[#2E7D32] text-center">{item.txt11}</h1>
                                        <p className="text-xs font-light text-[#5F6368]">{item.txt12}</p>
                                    </>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border border-[#FFDFAB] bg-[#FFF8EE] p-3 rounded-lg mt-6 flex justify-between items-center">
                <p>🔒 195 more buyers with contact details, procurement emails, LinkedIn profiles and RFQ history — unlock on Venture+</p>
                <button className="bg-[#D48C15] text-white rounded-lg font-medium px-3 py-1">Upgrade to Venture+ →</button>
            </div>
        </>
    );
};
export default Buyer;
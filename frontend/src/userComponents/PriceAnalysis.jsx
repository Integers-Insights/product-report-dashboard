import { CheckIcon, BoltIcon } from "@heroicons/react/24/outline";

const stats = [
    { title: "Non-organic · Commodity", price: "$4–$9", txt1: "Standard export grade · Bulk pallet", txt2: "Your position: Strong value" },
    { title: "Organic certified · Your tier", price: "$8–$16", txt1: "GMP + USDA Organic · Premium", txt2: "Your position: $8.50/kg" },
    { title: "Water-soluble · Gap format", price: "$14–$22", txt1: "No competitors present · High-margin", txt2: "Opportunity gap" },
]

const icons = [
    CheckIcon,
    CheckIcon,
    BoltIcon,
];

const tableData = [
    {
        title: 'Your quoted price',
        price: '$8.50/kg',
        est: '30–45%',
        txt1: 'Competitive — mid of range'
    },
    {
        title: 'Organic cert price uplift',
        price: '$+35–60%',
        est: '50–60%',
        txt1: '✓ Well justified'
    },
    {
        title: 'Estimated gross margin',
        price: '30–45%',
        est: '32–46%',
        txt1: '✓ Strong'
    },
    {
        title: 'Water-soluble variant',
        price: '$14–22/kg',
        est: '35–48%',
        txt1: '⚡ No competitors — margin 50–60%'
    },
    {
        title: 'Minimum order (recommended)',
        price: '500 kg',
        est: '<10%',
        txt1: 'Matches most buyer RFQ sizes'
    }
];

const card = [
    {
        txt1: "+40%",
        txt2: "GMP certified",
        txt3: "vs uncertified avg"
    },
    {
        txt1: "+60%",
        txt2: "USDA Organic",
        txt3: "vs conventional avg"
    },
    {
        txt1: "40%",
        txt2: "of buyers require certs",
        txt3: "as hard filter"
    }
]

const PriceAnalysis = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Price Analysis</h2>
                    <p className="text-[#5F6368] text-13 font-regular">Import price bands · Your competitive position · Margin feasibility per format</p>
                </div>
                <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5">Your position: Strong value</div>
            </div>
            <hr className='my-4 bg-[#E6E6E6] h-[1px] border-0' />

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {stats?.map((item, index) => {

                    const Icon = icons[index];

                    return (
                        <div key={index} className="overflow-hidden rounded-lg bg-white shadow-sm p-3 border border-[#E6E6E6] card-hover">
                            <div className="text-sm font-medium text-[#000000]">{item.title}</div>
                            <div className="text-xl font-semibold text-[#000000] mt-2">{item.price}<span className="text-sm font-regular text-[#5F6368]">/kg</span></div>
                            <div className="text-sm font-regular text-[#5F6368] mt-1">{item.txt1}</div>
                            {/* <button className="border bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5 flex gap-1 mt-2"><Icon className="h-5 w-5" />{item.txt2}</button> */}
                        </div>
                    )
                })}
            </div>

            <div className="mt-6">
                <p className="text-sm text-[#5F6368] font-medium mb-2 uppercase">Margin analysis</p>

                {/*  */}
                <div className="border-t border-[#E6E6E6] grid grid-cols-4 gap-10 hover:bg-gray-100">
                    <div className=" py-3 text-sm font-medium wrap-break-word">Variant</div>
                    <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">Market price</div>
                    <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">Margin est.</div>
                    <div className="py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">Position</div>
                </div>
                {/*  */}

                {tableData?.map((item, index) => {
                    return (
                        <div className="border-t border-[#E6E6E6] grid grid-cols-4 gap-10 hover:bg-gray-100" key={index}>
                            <div className=" py-3 text-sm text-[#5F6368] font-regular wrap-break-word">{item.title}</div>
                            <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">{item.price}</div>
                            <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">{item.est}</div>
                            <div className=" py-3 text-right"><span className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5 wrap-break-word">{item.txt1}</span></div>
                        </div>
                    )
                })}
            </div>

            <div className="p-3 rounded-lg bg-[#F3F3F3] mt-6">
                <p className="text-sm font-medium text-[#5F6368] uppercase mb-3">Why your certifications justify the price</p>
                <div className="grid grid-cols-3 gap-6">
                    {card?.map((itm, i) => {
                        return (
                            <div className="border border-[#D9D9D9] bg-[#FFFFFF] p-3 rounded-lg card-hover" key={i}>
                                <p className="text-center text-xl font-medium text-[#000000]">{itm.txt1}</p>
                                <p className="text-center text-xs text-[#5F6368]">{itm.txt2}</p>
                                <p className="text-center text-xs text-[#5F6368]">{itm.txt3}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
export default PriceAnalysis;
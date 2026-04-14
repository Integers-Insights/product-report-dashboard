import { BuildingStorefrontIcon, SparklesIcon } from "@heroicons/react/24/outline";

const cardData = [
    {
        id: 1,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:9,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    },
    {
        id: 2,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:8,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    },
    {
        id: 3,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:8,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    },
    {
        id: 4,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:9,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    },
    {
        id: 5,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:9,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    },
    {
        id: 6,
        txt1: "Organic Turmeric Powder — Curcumin 95%",
        num:9,
        txt2: "✓ Your product",
        txt3: "Curcuminoids ≥95% · moisture 8% · heavy metals 5 ppm",
        txt4: "$8 - $16 / kg",
        txt5: "500 kg",
        txt6: "High",
        txt7: "120+ · USA, Germany, UK",
        txt8: "14 - 21 days",
        txt9: "Your core product. Strongest match rate in your target markets. GMP + USDA Organic cert is the key differentiator — 40% of buyers require it as a hard filter."
    }
]

const Variants = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Product Variants & Formats</h2>
                    <p className="text-[#5F6368] text-13 font-regular">What buyers are actually sourcing · Your current offering vs market demand</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-[#2E7D32] h-2 w-2 rounded-xs"></div>
                    <p className="text-xs text-[#5F6368] font-regular">Your product</p>
                    <div className="bg-[#008ACB] h-2 w-2 rounded-xs"></div>
                    <p className="text-xs text-[#5F6368] font-regular">Gap</p>
                    <div className="bg-[#A9B3B1] h-2 w-2 rounded-xs"></div>
                    <p className="text-xs text-[#5F6368] font-regular">In market</p>
                    <div className="bg-[#D48C15] h-2 w-2 rounded-xs"></div>
                    <p className="text-xs text-[#5F6368] font-regular">Emerging</p>
                </div>
            </div>

            {/* <hr className="bg-[#E6E6E6] h-[1px] border-0 mt-6" /> */}

            <div className="flex gap-6 bg-[#F3F3F3] p-3 rounded-lg my-6">
                <span className="text-sm font-medium text-[#000000]">Every variant shows:</span>
                <span className="text-sm font-regular text-[#5F6368]">Key spec</span>
                <span className="text-sm font-regular text-[#5F6368]">Price range</span>
                <span className="text-sm font-regular text-[#5F6368]">Min. order qty</span>
                <span className="text-sm font-regular text-[#5F6368]">Buyer demand</span>
                <span className="text-sm font-regular text-[#5F6368]">Matched buyers</span>
                <span className="text-sm font-regular text-[#5F6368]">Lead time</span>
                <span className="text-sm font-regular text-[#5F6368]">Opportunity score</span>
                <span className="text-sm font-regular text-[#5F6368]">Analyst note</span>
            </div>

            {/* <div className="grid grid-cols-2 gap-6 mt-6">
                {cardData?.map((item) => {
                    return (
                        <div className="border border-[#E6E6E6] p-3 rounded-lg card-hover" key={item.id}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-[#000000] text-sm font-medium">{item.txt1}</h2>
                                <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl">
                                    {item.txt2}
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
                            </div>

                            <div className="border flex gap-2.5 p-3 border-[#A5F7A9] text-[#2E7D32] bg-[#F1FEF2] rounded-lg mt-2.5">
                                <div><SparklesIcon className="h-6 w-6" /></div>
                                <div className="text-13 font-regular"><span className="font-semibold">{item.txt13}</span> {item.txt14}</div>
                            </div>
                        </div>
                    );
                })}
            </div> */}

            <div className="flex flex-col gap-6">
                {cardData?.map((item, index) => {
                    return (
                        <div className="border border-l-4 border-[#2E7D32] p-4 rounded-lg card-hover" key={item.id}>
                            {/* 1 */}
                            <div className="flex justify-between">
                                <div className="flex gap-6 items-center">
                                    <div className="text-sm text-[#000000] font-medium">{item.txt1}</div>
                                    <div className="text-sm text-[#2E7D32] font-medium bg-[#CCFFCF] px-3 py-0.5 rounded-2xl">{item.txt2}</div>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#2E7D32] text-center">{item.num}</p>
                                    <p className="text-xs font-medium text-[#5F6368]">OPP.</p>
                                </div>
                            </div>

                            {/* 2 */}
                            <div className="border border-[#E6E6E6] grid grid-cols-3 mt-6 mb-3 rounded-lg">
                                <div className="border border-[#E6E6E6] p-2 rounded-tl-lg">
                                    <p className="text-[#5F6368] font-medium text-sm">Key spec</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt3}</p>
                                </div>
                                <div className="border border-[#E6E6E6] p-2">
                                    <p className="text-[#5F6368] font-medium text-sm">Price range</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt4}</p>
                                </div>
                                <div className="border border-[#E6E6E6] p-2 rounded-tr-lg">
                                    <p className="text-[#5F6368] font-medium text-sm">Min. order qty</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt5}</p>
                                </div>
                                <div className="border border-[#E6E6E6] p-2 rounded-bl-lg">
                                    <p className="text-[#5F6368] font-medium text-sm">Buyer demand</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt6}</p>
                                </div>
                                <div className="border border-[#E6E6E6] p-2">
                                    <p className="text-[#5F6368] font-medium text-sm">Matched buyers</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt7}</p>
                                </div>
                                <div className="border border-[#E6E6E6] p-2 rounded-br-lg">
                                    <p className="text-[#5F6368] font-medium text-sm">Lead time</p>
                                    <p className="text-[#000000] font-regular text-sm">{item.txt8}</p>
                                </div>
                            </div>

                            {/* 3 */}
                            <hr className="bg-[#E6E6E6] h-[1px] border-0 my-3" />

                            {/* 4 */}
                            <p className="text-[#5F6368] font-regular text-sm">{item.txt9}</p>
                        </div>
                    );
                })}
            </div>

        </>
    )
};
export default Variants;

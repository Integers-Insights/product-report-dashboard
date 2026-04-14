import { BoltIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";


const tableData = [
    {
        Competitor_txt1: 'SpiceGuru International',
        Competitor_txt2: '🇮🇳 India — Rajasthan',
        markets: "🇺🇸 🇩🇪 🇬🇧",
        certifications: ["GMP", "USDA Org"],
        price: '$7–14',
        positioning: 'Mid bulk',
        your_edge: 'Cert lapse — their buyers now available',
        threat: '⬇ Reduced'
    },
    {
        Competitor_txt1: 'OrganicIndia Ltd.',
        Competitor_txt2: '🇮🇳 India — Uttar Pradesh',
        markets: "🇺🇸 🇬🇧 🇸🇬",
        certifications: ["GMP", "USDA Org", "Fair Trade"],
        price: '$10–18',
        positioning: 'Premium brand',
        your_edge: 'Price advantage at $8.50 vs $10+',
        threat: 'High'
    },
    {
        Competitor_txt1: 'NatureVit GmbH',
        Competitor_txt2: '🇩🇪 Germany — private label',
        markets: "🇩🇪 🇫🇷",
        certifications: ["EU Organic", "GMP"],
        price: '$13–20',
        positioning: 'EU-origin',
        your_edge: 'Price: 40% cheaper, USDA cert adds credibility',
        threat: 'Medium'
    },
    {
        Competitor_txt1: 'Verdure Sciences',
        Competitor_txt2: '🇺🇸 USA — reformulator',
        markets: "🇺🇸 only",
        certifications: ["USDA Org", "Non-GMO", "Kosher"],
        price: '$15–24',
        positioning: 'Science-backed',
        your_edge: 'Price 45% lower + India origin story',
        threat: 'Medium'
    },
    {
        Competitor_txt1: 'Himalaya Drug Company',
        Competitor_txt2: '🇮🇳 India — branded',
        markets: "Global",
        certifications: ["GMP", "WHO GMP", "USDA"],
        price: '$12–22',
        positioning: 'Consumer brand',
        your_edge: 'Bulk B2B focus vs their retail focus — different buyers',
        threat: 'Low (diff channel)'
    },
]


const Competitors = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Competitor Map</h2>
                    <p className="text-[#5F6368] text-13 font-regular">Direct competitors in your target markets · Certifications, pricing, positioning gaps</p>
                </div>
                <div className="bg-red-100 text-red-500 text-sm font-medium py-0.5 px-3 rounded-2xl">1 cert gap identified — act now</div>
            </div>

            <div className="border flex gap-3 p-3 rounded-lg border-l-3 border-[#0284C7] mt-6">
                <div><BoltIcon className="mt-1 h-5 w-5" /></div>
                <div>
                    <span className="text-sm text-[#0284C7] font-medium">SpiceGuru International lost USDA Organic certification 8 days ago.</span>
                    <span className="text-sm text-[#5F6368] font-regular"> They supply 44 German buyers and ~20 US buyers. Those buyers are now actively re-sourcing. This window typically lasts 60–90 days before a new supplier qualifies. BioHerb GmbH (score 88) confirmed Q2 procurement is open.</span>
                    <span className="text-sm text-[#0284C7] font-medium"> Send Email 1 this week.</span>
                </div>
            </div>

            <div className="mt-6">
                <div className="border-b border-[#E6E6E6] grid grid-cols-7 gap-5 py-1 bg-gray-100">
                    <div className="px-1 uppercase font-medium text-sm py-1">Competitor</div>
                    <div className="text-center px-1 uppercase font-medium text-sm py-1">Markets</div>
                    <div className="px-1 uppercase font-medium text-sm py-1">Certifications</div>
                    <div className="text-center uppercase font-medium text-sm py-1">Price $/kg</div>
                    <div className="uppercase font-medium text-sm py-1">Positioning</div>
                    <div className=" uppercase font-medium text-sm py-1">Your edge</div>
                    <div className="text-center uppercase font-medium text-sm py-1">Threat</div>
                </div>

                {tableData?.map((item, i) => {
                    return (
                        <div className="grid grid-cols-7 gap-5 border-t py-2 border-[#E6E6E6] transition-all duration-300 hover:bg-gray-100" key={i}>
                            <div className="px-1 font-medium text-sm">
                                <p className="font-medium text-[#000000]">{item.Competitor_txt1}</p>
                                <p className="text-xs font-medium text-[#5F6368] mt-1">{item.Competitor_txt2}</p>
                            </div>
                            <div className="text-center font-medium text-sm">{item.markets}</div>
                            <div className="text-center font-medium text-sm px-1 flex flex-wrap gap-2">
                                {item.certifications[0] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-2 py-0.5">{item.certifications[0]}</span>}
                                {item.certifications[1] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-2 py-0.5">{item.certifications[1]}</span>}
                                {item.certifications[2] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-2 py-0.5">{item.certifications[2]}</span>}
                            </div>
                            <div className="text-center font-medium text-sm">{item.price}</div>
                            <div className="px-1 font-medium text-sm">
                                <span className="border px-2 py-0.5 rounded-full">{item.positioning}</span>
                            </div>
                            <div className="px-1 text-sm">{item.your_edge}</div>
                            <div className="text-center font-medium text-sm"><span className="border px-2 py-0.5 rounded-full">{item.threat}</span></div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};
export default Competitors;

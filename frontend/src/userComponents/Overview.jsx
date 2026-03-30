import {
    ArrowRightStartOnRectangleIcon,
    BuildingStorefrontIcon,
    LanguageIcon,
    BriefcaseIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon,
    UserGroupIcon,
    SwatchIcon,
    PuzzlePieceIcon,
    ClockIcon,
    CalendarIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";

const cardData = [
    {
        id: 1,
        title: "MARKET DEMAND",
        txt1: "9/10",
        txt2: "↑18% YoY · Anti-inflammatory trend"
    },
    {
        id: 2,
        title: "Keywords Found",
        txt1: "34",
        txt2: "↑18% YoY · Anti-inflammatory trend"
    },
    {
        id: 3,
        title: "Competition",
        txt1: "6/10",
        txt2: "Cert gap open · 3 direct competitors"
    },
    {
        id: 4,
        title: "Trade Activity",
        txt1: "9/10",
        txt2: "18,400 MT US import · India 64%"
    },
    {
        id: 5,
        title: "PRICE FIT",
        txt1: "8/10",
        txt2: "$8.50 vs $8–16 market · +35% organic"
    },
    {
        id: 6,
        title: "Buyer Availability",
        txt1: "8/10",
        txt2: "200+ matched · 3 RFQs open now"
    },
    {
        id: 7,
        title: "VARIANTS FOUND",
        txt1: "5",
        txt2: "The demand is rising for these variants"
    },
    {
        id: 8,
        title: "RFQs found",
        txt1: "3",
        txt2: "Customers are demanding this product"
    }
];

const icons = [
    BuildingStorefrontIcon,
    LanguageIcon,
    BriefcaseIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon,
    UserGroupIcon,
    SwatchIcon,
    PuzzlePieceIcon
];


const Overview = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Opportunity Summary</h2>
                    <p className="text-[#5F6368] text-13 font-regular">6 intelligence modules run · Personalised to your certifications and pricing</p>
                </div>
                <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl">Score: 82/100</div>
            </div>
            <div className="grid grid-cols-4 gap-6 mt-4">
                {cardData?.map((item, index) => {
                    const Icon = icons[index];
                    return (
                        <div className="border border-[#E6E6E6] p-3 rounded-lg card-hover" key={item.id}>
                            <div className="h-7.5 w-7.5 bg-[#E0F5FF] flex justify-center items-center rounded"><Icon className="w-5 h-5 text-[#0284C7]" /></div>
                            <div className="text-[#000000] font-light text-xs mt-1.5">{item.title}</div>
                            <div className="text-[#2E7D32] font-semibold text-xl">{item.txt1}</div>
                            <div className="text-[#5F6368] font-light text-xs">{item.txt2}</div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2.5 mt-6 p-3 border border-[#ADE0AF] rounded-lg">
                <div>
                    <div className="h-7.5 w-7.5 bg-[#CCFFCF] flex justify-center items-center rounded"><ArrowRightStartOnRectangleIcon className="h-5 w-5 text-[#2E7D32] flex-shrink-0" /></div>
                </div>
                <div className="text-[#5F6368] text-13 font-regular">Urgent opportunity: SpiceGuru International lost USDA Organic certification 8 days ago. BioHerb GmbH Germany (match score 88) and 43 other buyers are now actively re-sourcing. This window typically closes within 60–90 days once a new supplier qualifies. Recommend sending outreach this week.</div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="card-hover border border-[#A5F7A9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F1FEF2]">
                    <div className="flex gap-3 items-center text-[#2E7D32]">
                        <span><ClockIcon className="h-5 w-5" /></span>
                        <span className="text-base font-medium">Do Now</span>
                    </div>
                    <div className="text-[#1E1E1E] text-13 font-regular">Contact BioHerb GmbH Germany — cert gap window open. Use the email sequence in Marketing Kit.</div>
                </div>

                <div className="card-hover border border-[#96DBFF] flex flex-col gap-1.5 rounded-lg p-3 bg-[#EDF9FF]">
                    <div className="flex gap-3 items-center text-[#008ACB]">
                        <span><CalendarIcon className="h-5 w-5" /></span>
                        <span className="text-base font-medium">This month</span>
                    </div>
                    <div className="text-[#1E1E1E] text-13 font-regular">Run 3-step outreach to top 20 US buyers. Q2 sourcing window opens April — pipeline now.</div>
                </div>

                <div className="card-hover border border-[#D9D9D9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F3F3F3]">
                    <div className="flex gap-3 items-center">
                        <span><CalendarDaysIcon className="h-5 w-5" /></span>
                        <span className="text-base font-medium">This quarter</span>
                    </div>
                    <div className="text-[#1E1E1E] text-13 font-regular">Develop water-soluble variant ($14–22/kg). No competitors present. Gap confirmed.</div>
                </div>
            </div>
        </>
    );
};
export default Overview;
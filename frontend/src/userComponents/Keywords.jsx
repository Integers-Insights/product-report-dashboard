import { FireIcon,InformationCircleIcon,DocumentDuplicateIcon } from '@heroicons/react/24/outline'
const Keywords = () => {

    const data1 = [
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: false
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: false
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: false
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: true
        }
    ];


    const data2 = [
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: true
        }
    ];


    const data3 = [
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: false
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Med",
            gap: "Gap ↑",
            view: true
        },
        {
            title: "bulk turmeric supplier",
            time1: "4.2K/mo",
            time2: "Low",
            gap: "Gap ↑",
            view: true
        }
    ];

    return (
        <>
            <div className="mt-6">
                <div className="border border-[#E6E6E6] rounded-t-lg flex justify-between p-3 bg-[#EDF9FF]">
                    <p className="text-[#000000] font-medium text-sm flex items-center gap-2"><FireIcon className="h-5 w-5"/> High-Volume Buyer Intent</p>
                    <p className="text-[#5F6368] font-regular text-sm">8 keywords · use in email subjects and LinkedIn profiles</p>
                </div>
                <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
                    {data1?.map((itm, i) => {
                        return (
                            <div className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium" key={i}>
                                <div className="font-regular">{itm.title}</div>
                                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">{itm.time1}</div>
                                <div className={`rounded-2xl py-0.5 px-1 ${itm.time2=="Med"?"text-[#D48C15] bg-[#FFF8EE]":"text-[#2E7D32] bg-[#F1FEF2]"}`}>{itm.time2}</div>
                                {itm.view && <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">{itm.gap}</div>}
                            </div>
                        )
                    })}

                </div>
            </div>

            <div className="mt-6">
                <div className="border border-[#E6E6E6] rounded-t-lg flex justify-between p-3 bg-[#EDF9FF]">
                    <p className="text-[#000000] font-medium text-sm flex items-center gap-2"><InformationCircleIcon className="h-5 w-5"/> Low-Competition Gaps — competitors not ranking</p>
                    <p className="text-[#5F6368] font-regular text-sm">12 keywords · highest conversion potential</p>
                </div>
                <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
                    {data2?.map((itm, i) => {
                        return (
                            <div className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium" key={i}>
                                <div className="font-regular">{itm.title}</div>
                                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">{itm.time1}</div>
                                <div className={`rounded-2xl py-0.5 px-1 ${itm.time2=="Med"?"text-[#D48C15] bg-[#FFF8EE]":"text-[#2E7D32] bg-[#F1FEF2]"}`}>{itm.time2}</div>
                                {itm.view && <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">{itm.gap}</div>}
                            </div>
                        )
                    })}

                </div>
            </div>


            <div className="mt-6">
                <div className="border border-[#E6E6E6] rounded-t-lg flex justify-between p-3 bg-[#EDF9FF]">
                    <p className="text-[#000000] font-medium text-sm flex items-center gap-2"><DocumentDuplicateIcon className="h-5 w-5"/> Multilingual — German + French</p>
                    <p className="text-[#5F6368] font-regular text-sm">mapped for EU market content</p>
                </div>
                <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
                    {data3?.map((itm, i) => {
                        return (
                            <div className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium" key={i}>
                                <div className="font-regular">{itm.title}</div>
                                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">{itm.time1}</div>
                                <div className={`rounded-2xl py-0.5 px-1 ${itm.time2=="Med"?"text-[#D48C15] bg-[#FFF8EE]":"text-[#2E7D32] bg-[#F1FEF2]"}`}>{itm.time2}</div>
                                {itm.view && <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">{itm.gap}</div>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};
export default Keywords;
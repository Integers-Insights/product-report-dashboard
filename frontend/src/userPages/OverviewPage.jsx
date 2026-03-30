// import Header from "../userComponents/Header";
// import SideBar from "../userComponents/SideBar";

// const OverView = () => {
//     return (
//         <div className="flex">
//             {/* side bar */}
//             <div className="">
//                 <SideBar />
//             </div>
//             <div className="border">
//                 <div className="border flex-1">
//                     <Header />
//                 </div>
//                 <div className="pt-4 pl-6 border">
//                     lorem2000
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default OverView;


import { useEffect, useState } from "react";
import AiGenerated from "../userComponents/AiGenerated";
import PopForm from "../userComponents/Form";
import Header from "../userComponents/Header";
import KpiCards from "../userComponents/KpiCards";
import SideBar from "../userComponents/SideBar";
import Opportunity from "../userComponents/Opportunity";

const OverViewPage = () => {

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setPopupOpen(true);
        }, 1000);

        return () => {
            clearTimeout(timeOut);
        }
    }, []);

    return (
        <>
            <div className="flex bg-[#EFF4F8]">
                {/* Sidebar */}
                <div>
                    <SideBar />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header */}
                    <div className="sticky top-0 z-10">
                        <Header />
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 p-6">
                        {/* Example long content */}
                        <KpiCards />
                        <Opportunity />
                        <AiGenerated />
                    </div>
                </div>
            </div>

            {popupOpen &&
                <>
                    <div className="fixed inset-0 bg-black/40 z-40"></div>
                    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
                        <PopForm setPopupOpen={setPopupOpen} />
                    </div>
                </>
            }


            {/* <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform bg-white shadow-xl rounded-lg p-6">
                <PopForm />
            </div> */}
        </>
    );
};

export default OverViewPage;
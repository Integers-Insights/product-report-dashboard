import { useEffect, useState } from "react";
import AiGenerated from "../userComponents/AiGenerated";
import PopForm from "../userComponents/PopForm";
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
                    <div className="fixed inset-0 bg-black/40 z-10"></div>
                    <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
                        <PopForm setPopupOpen={setPopupOpen} />
                    </div>
                </>
            }
        </>
    );
};

export default OverViewPage;





// import { useEffect, useState } from "react";
// import AiGenerated from "../userComponents/AiGenerated";
// import Header from "../userComponents/Header";
// import KpiCards from "../userComponents/KpiCards";
// import SideBar from "../userComponents/SideBar";
// import Opportunity from "../userComponents/Opportunity";
// import PopForm from "../userComponents/PopForm";

// const OverViewPage = () => {

//     const [popupOpen, setPopupOpen] = useState(false);

//     useEffect(() => {
//         const key = "CtKoIC)iR1SP)5mr&R4d";

//         let storedData = {};

//         try {
//             storedData = JSON.parse(localStorage.getItem(key)) || {};
//         } catch (e) {
//             storedData = {};
//         }

//         if (storedData?.isSubmitted) return;

//         const timeOut = setTimeout(() => {
//             setPopupOpen(true);
//         }, 1000);

//         return () => clearTimeout(timeOut);

//     }, []);

//     return (
//         <>
//             <div className="flex bg-[#EFF4F8]">
//                 {/* Sidebar */}
//                 <div>
//                     <SideBar />
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 flex flex-col min-h-screen">
//                     {/* Header */}
//                     <div className="sticky top-0 z-10">
//                         <Header />
//                     </div>

//                     {/* Scrollable content */}
//                     <div className="flex-1 p-6">
//                         <KpiCards />
//                         <Opportunity />
//                         <AiGenerated />
//                     </div>
//                 </div>
//             </div>

//             {/* Popup */}
//             {popupOpen && (
//                 <>
//                     <div className="fixed inset-0 bg-black/40 z-40"></div>

//                     <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
//                         <PopForm setPopupOpen={setPopupOpen} />
//                     </div>
//                 </>
//             )}
//         </>
//     );
// };

// export default OverViewPage;

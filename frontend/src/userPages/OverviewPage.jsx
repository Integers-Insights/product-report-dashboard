// import { useEffect, useState } from "react";
// import AiGenerated from "../userComponents/AiGenerated";
// import PopForm from "../userComponents/PopForm";
// import Header from "../userComponents/Header";
// import KpiCards from "../userComponents/KpiCards";
// import SideBar from "../userComponents/SideBar";
// import Opportunity from "../userComponents/Opportunity";

// const OverViewPage = () => {

//     const [popupOpen, setPopupOpen] = useState(false);

//     // useEffect(() => {
//     //     let timeOut = setTimeout(() => {
//     //         setPopupOpen(true);
//     //     }, 1000);

//     //     return () => {
//     //         clearTimeout(timeOut);
//     //     }
//     // }, []);

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
//                         {/* Example long content */}
//                         <KpiCards />
//                         <Opportunity />
//                         <AiGenerated />
//                     </div>
//                 </div>
//             </div>

//             {popupOpen &&
//                 <>
//                     <div className="fixed inset-0 bg-black/40 z-10"></div>
//                     <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
//                         <PopForm setPopupOpen={setPopupOpen} />
//                     </div>
//                 </>
//             }
//         </>
//     );
// };

// export default OverViewPage;

import { useEffect, useState } from "react";
import AiGenerated from "../userComponents/AiGenerated";
import Header from "../userComponents/Header";
import KpiCards from "../userComponents/KpiCards";
import SideBar from "../userComponents/SideBar";
import Opportunity from "../userComponents/Opportunity";
import PopForm from "../userComponents/PopForm";
import { base_url1 } from "../URL";

const OverViewPage = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const [statsData, setStatsData] = useState([]);
  const [opportunity_hubData, setOpportunity_hubData] = useState([]);
  const [recent_activityData, setRecent_activityData] = useState([]);
  const [ai_insightsData, setAi_insightsData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const key = "CtKoIC)iR1SP)5mr&R4d";

    let storedData = {};

    try {
      storedData = JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      storedData = {};
    }

    if (storedData?.isSubmitted) return;

    const timeOut = setTimeout(() => {
      setPopupOpen(true);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, []);

  const getOverviewData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url1}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success) {
        console.log("overview Data:", data);
        setStatsData(data?.stats);
        setOpportunity_hubData(data?.opportunity_hub);
        // setRecent_activityData(data?.recent_activity);
        setAi_insightsData(data?.ai_insights);
        setCurrentDate(data?.current_datetime);
        setFullName(data?.full_name);
      }
    } catch (error) {
      console.error("Something went wrong:", error.message);
    }
  };

  const getRecentData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url1}/dashboard/recent-activity`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success) {
        console.log("overview Data1111:", data);
        setRecent_activityData(data?.recent_activity);
      }
    } catch (error) {
      console.error("Something went wrong:", error.message);
    }
  };

  // useEffect(() => {
  //   getOverviewData();
  //   let interval = setInterval(() => {
  //     getRecentData();
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    getOverviewData();

    let isFetching = false;
    getRecentData();

    const interval = setInterval(() => {
      if (isFetching) return;

      isFetching = true;

      getRecentData()
        .catch((err) => console.log("error:", err))
        .finally(() => (isFetching = false));
    }, 10000);

    return () => clearInterval(interval);
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
            <KpiCards
              statsData={statsData}
              currentDate={currentDate}
              fullName={fullName}
            />
            <Opportunity
              opportunity_hubData={opportunity_hubData}
              recent_activityData={recent_activityData}
            />
            <AiGenerated ai_insightsData={ai_insightsData} />
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>

          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
            <PopForm setPopupOpen={setPopupOpen} />
          </div>
        </>
      )}
    </>
  );
};

export default OverViewPage;

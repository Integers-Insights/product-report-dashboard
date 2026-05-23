// import { useEffect, useState } from "react";
// import AiGenerated from "../components/AiGenerated";
// import Header from "../components/Header";
// import KpiCards from "../components/KpiCards";
// import SideBar from "../components/SideBar";
// import Opportunity from "../components/Opportunity";
// import PopForm from "../components/PopForm";
// import NewUserDashboard from "../components/NewUserDashboard";

// const OverViewPage = () => {
//   const [popupOpen, setPopupOpen] = useState(false);

//   const [statsData, setStatsData] = useState([]);
//   const [opportunity_hubData, setOpportunity_hubData] = useState([]);
//   const [recent_activityData, setRecent_activityData] = useState([]);
//   const [ai_insightsData, setAi_insightsData] = useState([]);
//   const [currentDate, setCurrentDate] = useState("");
//   const [fullName, setFullName] = useState("");

//   const [statsLoading, setStatsLoading] = useState(false);

//   // latest
//   const [hasRunIntelligence, setHasRunIntelligence] = useState(null); // null = loading

//   const [recentDataLoading, setRecentDataLoading] = useState(false);

//   const base_url = import.meta.env.VITE_BASE_URL;

//   useEffect(() => {
//     const key = "CtKoIC)iR1SP)5mr&R4d";

//     let storedData = {};

//     try {
//       storedData = JSON.parse(localStorage.getItem(key)) || {};
//     } catch (e) {
//       storedData = {};
//     }

//     if (storedData?.isSubmitted) return;

//     const timeOut = setTimeout(() => {
//       setPopupOpen(true);
//     }, 1000);

//     return () => clearTimeout(timeOut);
//   }, []);

//   const getOverviewData = async () => {
//     try {
//       setStatsLoading(true);
//       const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
//       const response = await fetch(`${base_url}/dashboard`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       // console.log("data: ", data);

//       if (data?.success) {
//         setStatsData(Array.isArray(data?.stats) ? data.stats : []);
//         setOpportunity_hubData(
//           Array.isArray(data?.opportunity_hub) ? data.opportunity_hub : [],
//         );
//         setAi_insightsData(
//           Array.isArray(data?.ai_insights) ? data.ai_insights : [],
//         );

//         //latest
//         setHasRunIntelligence(data.has_run_intelligence ?? false);

//         setCurrentDate(data?.current_datetime || "");
//         setFullName(data?.full_name || "");
//       }
//     } catch (error) {
//       console.error("Something went wrong:", error.message);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   const getRecentData = async () => {
//     try {
//       setRecentDataLoading(true);
//       const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

//       const response = await fetch(`${base_url}/dashboard/recent-activity`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       // console.log(data);

//       if (data?.success) {
//         setRecent_activityData(
//           Array.isArray(data?.recent_activity) ? data?.recent_activity : [],
//         );
//       }
//     } catch (error) {
//       console.log("Something went wrong:", error.message);
//     } finally {
//       setRecentDataLoading(false);
//     }
//   };

//   useEffect(() => {
//     getOverviewData();

//     let isFetching = false;
//     getRecentData();

//     const interval = setInterval(() => {
//       if (isFetching) return;

//       isFetching = true;

//       getRecentData()
//         .catch((err) => console.log("error:", err))
//         .finally(() => (isFetching = false));
//     }, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   if (hasRunIntelligence === null) return <div>Loading...</div>; // or your spinner

//   return (
//     <>
//       <div className="flex bg-[#EFF4F8]">
//         <div>
//           <SideBar />
//         </div>
//         <div className="flex-1 flex flex-col min-h-screen">
//           <div className="sticky top-0 z-10">
//             <Header />
//           </div>
//           <div className="flex-1 p-6">
//             {hasRunIntelligence ? (
//               <>
//                 <KpiCards
//                   statsData={statsData}
//                   currentDate={currentDate}
//                   fullName={fullName}
//                   statsLoading={statsLoading}
//                 />
//                 <Opportunity
//                   opportunity_hubData={opportunity_hubData}
//                   recent_activityData={recent_activityData}
//                   statsLoading={statsLoading}
//                   recentDataLoading={recentDataLoading}
//                 />
//                 <AiGenerated
//                   ai_insightsData={ai_insightsData}
//                   statsLoading={statsLoading}
//                 />
//               </>
//             ) : (
//               <NewUserDashboard /> // your first-time user UI
//             )}

//             {/* <KpiCards
//               statsData={statsData}
//               currentDate={currentDate}
//               fullName={fullName}
//               statsLoading={statsLoading}
//             />
//             <Opportunity
//               opportunity_hubData={opportunity_hubData}
//               recent_activityData={recent_activityData}
//               statsLoading={statsLoading}
//               recentDataLoading={recentDataLoading}
//             />
//             <AiGenerated ai_insightsData={ai_insightsData} statsLoading={statsLoading} /> */}
//           </div>
//         </div>
//       </div>
//       {popupOpen && (
//         <>
//           <div className="fixed inset-0 bg-black/40 z-40"></div>

//           <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
//             <PopForm setPopupOpen={setPopupOpen} />
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default OverViewPage;

import { useEffect, useState } from "react";
import AiGenerated from "../components/AiGenerated";
import Header from "../components/Header";
import KpiCards from "../components/KpiCards";
import SideBar from "../components/SideBar";
import Opportunity from "../components/Opportunity";
import PopForm from "../components/PopForm";
import NewUserDashboard from "../components/NewUserDashboard";

const OverViewPage = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const [statsData, setStatsData] = useState([]);
  const [opportunity_hubData, setOpportunity_hubData] = useState([]);
  const [recent_activityData, setRecent_activityData] = useState([]);
  const [ai_insightsData, setAi_insightsData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [fullName, setFullName] = useState("");

  const [statsLoading, setStatsLoading] = useState(false);

  // latest
  const [hasRunIntelligence, setHasRunIntelligence] = useState(null); // null = loading

  const [recentDataLoading, setRecentDataLoading] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;

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
      setStatsLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      const response = await fetch(`${base_url}/dashboard`, {
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
      // console.log("data: ", data);

      if (data?.success) {
        setStatsData(Array.isArray(data?.stats) ? data.stats : []);
        setOpportunity_hubData(
          Array.isArray(data?.opportunity_hub) ? data.opportunity_hub : [],
        );
        setAi_insightsData(
          Array.isArray(data?.ai_insights) ? data.ai_insights : [],
        );

        //latest
        setHasRunIntelligence(data.has_run_intelligence ?? false);

        setCurrentDate(data?.current_datetime || "");
        setFullName(data?.full_name || "");
      }
    } catch (error) {
      console.error("Something went wrong:", error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const getRecentData = async () => {
    try {
      setRecentDataLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/dashboard/recent-activity`, {
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
      // console.log(data);

      if (data?.success) {
        setRecent_activityData(
          Array.isArray(data?.recent_activity) ? data?.recent_activity : [],
        );
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setRecentDataLoading(false);
    }
  };

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

  // if (hasRunIntelligence === null) return <div>Loading...</div>;

  return (
    <>
      <div className="flex bg-[#EFF4F8]">
        <div>
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="sticky top-0 z-10">
            <Header />
          </div>
          <div className="flex-1 p-6">
            {hasRunIntelligence === null ? (
              <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              </div>
            ) : hasRunIntelligence ? (
              <>
                <KpiCards
                  statsData={statsData}
                  currentDate={currentDate}
                  fullName={fullName}
                  statsLoading={statsLoading}
                />

                <Opportunity
                  opportunity_hubData={opportunity_hubData}
                  recent_activityData={recent_activityData}
                  statsLoading={statsLoading}
                  recentDataLoading={recentDataLoading}
                />

                <AiGenerated
                  ai_insightsData={ai_insightsData}
                  statsLoading={statsLoading}
                />
              </>
            ) : (
              <NewUserDashboard />
            )}
          </div>
        </div>
      </div>
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

import { useEffect, useState } from "react";
import Header from "../Components/Header";
import IntelligenceReportsComponent from "../Components/IntelligenceReports";
import SideBar from "../Components/SideBar";
import { base_url1 } from "../URL";

const IntelligenceReports = () => {
  const [allReportData, setAllReportData] = useState([]);
  const [intelligenceReportLoading, setIntelligenceReportLoading] = useState(false);

  const getReportData = async () => {
    try {
      setIntelligenceReportLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url1}/reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reportData = await response.json();
      if (reportData.success) {
        // console.log("reportData", reportData);
        setAllReportData(reportData?.reports);
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    }finally{
      setIntelligenceReportLoading(false);
    }
  };

  useEffect(() => {
    getReportData();
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
            <IntelligenceReportsComponent allReportData={allReportData} intelligenceReportLoading={intelligenceReportLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default IntelligenceReports;

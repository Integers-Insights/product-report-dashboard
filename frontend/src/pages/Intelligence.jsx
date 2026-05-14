import { useEffect, useState } from "react";
import Header from "../components/Header";
import IntelligenceReportsComponent from "../components/IntelligenceReports";
import SideBar from "../components/SideBar";

const IntelligenceReports = () => {
  const [allReportData, setAllReportData] = useState([]);
  const [intelligenceReportLoading, setIntelligenceReportLoading] =
    useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;

  const getReportData = async () => {
    try {
      setIntelligenceReportLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/reports`, {
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
        setAllReportData(
          Array.isArray(reportData?.reports) ? reportData?.reports : [],
        );
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setIntelligenceReportLoading(false);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

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
            <IntelligenceReportsComponent
              allReportData={allReportData}
              intelligenceReportLoading={intelligenceReportLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default IntelligenceReports;

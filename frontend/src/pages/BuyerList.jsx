import { useEffect, useState } from "react";
import BuyerListComponent from "../Components/BuyerListComponent";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import { base_url1 } from "../URL";

const BuyerList = () => {
  const [fetchingBuyerData, setFetchingBuyerData] = useState(false);
  const [total_b2b_buyers_data, setTotal_b2b_buyers_data] = useState(0);
  const [buyer_list, setBuyer_list] = useState([]);

  const getBuyerListData = async () => {
    try {
      setFetchingBuyerData(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url1}/buyer-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const buyerData = await response.json();

      console.log("buyerData: ", buyerData);

      if (buyerData.success) {
        setBuyer_list(Array.isArray(buyerData?.b2b) ? buyerData?.b2b : []);
        setTotal_b2b_buyers_data(buyerData?.total_b2b_buyers || 0);
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setFetchingBuyerData(false);
    }
  };

  useEffect(() => {
    getBuyerListData();
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
            <BuyerListComponent
              fetchingBuyerData={fetchingBuyerData}
              total_b2b_buyers_data={total_b2b_buyers_data}
              buyer_list={buyer_list}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerList;

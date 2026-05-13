import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductReport from "../components/ProductReport";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";

const FullReport = () => {
  const [banner_product_name, setBanner_product_name] = useState("");
  const [banner_hs_code, setBanner_hs_code] = useState("");
  const [banner_certifications, setBanner_certifications] = useState([]);
  const [banner_single_country, setBanner_single_country] = useState("");
  const [banner_multiple_country, setBanner_multiple_country] = useState([]);
  const [banner_buyer_type, setBanner_buyer_type] = useState("");
  const [banner_price_positioning, setBanner_price_positioning] = useState("");
  const [banner_monthly_supply_capacity, setBanner_monthly_supply_capacity] =
    useState("");
  const [banner_total_buyers, setBanner_total_buyers] = useState(0);
  const [banner_easy_win, setBanner_easy_win] = useState(0);
  const [banner_global_trade, setBanner_global_trade] = useState("");
  const [banner_keywords, setBanner_keywords] = useState(0);
  const [banner_market_range, setBanner_market_range] = useState("");
  const [banner_score, setBanner_score] = useState(0);
  const [overview_data,setOverview_data] = useState([]);
  const [urgent_note_data, setUrgent_note_data] = useState("");
  const [actions_data,setActions_data] = useState(null);
  const [market_data,setMarket_data] = useState([]);
  const [trade_data,setTrade_data] = useState({});
  const [buyers_data,setBuyers_data] = useState({});
  const [variants_data,setVariants_data] = useState([]);
  const [price_intelligence_data,setPrice_intelligence_data] = useState([]);
  const [marketing_kit_data,setMarketing_kit_data] = useState({});
  const [competitor_data,setCompetitor_data] = useState([]);
 

  const param = useParams();
  let index = param?.id;

  const base_url = import.meta.env.VITE_BASE_URL;

  const getFullReportData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      const response = await fetch(
        `${base_url}/product-intelligence/${index}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const allProductData = await response.json();

      if (allProductData.success) {
        setBanner_product_name(allProductData?.product?.name || "");
        setBanner_hs_code(allProductData?.product?.hs_code || "");
        setBanner_certifications(
          Array.isArray(allProductData?.product?.certifications)
            ? allProductData?.product?.certifications
            : []
        );
        setBanner_single_country(allProductData?.product?.headquarters_country || "");
        setBanner_multiple_country(
          Array.isArray(allProductData?.product?.market_country)
            ? allProductData?.product?.market_country
            : []
        );
        setBanner_buyer_type(allProductData?.product?.buyer_type || "");
        setBanner_price_positioning(allProductData?.product?.price_positioning || "");
        setBanner_monthly_supply_capacity(
          allProductData?.product?.monthly_supply_capacity || ""
        );
        setBanner_total_buyers(allProductData?.product?.total_buyers || 0);
        setBanner_easy_win(allProductData?.product?.easy_win || 0);
        setBanner_global_trade(allProductData?.product?.global_trade || "");
        setBanner_keywords(allProductData?.product?.keywords || 0);
        setBanner_market_range(allProductData?.product?.market_range || "");
        setBanner_score(allProductData?.product?.score || 0);

        setOverview_data(
          Array.isArray(allProductData?.overview)
            ? allProductData?.overview
            : []
        );
        setUrgent_note_data(allProductData?.urgent_note || "");
        setActions_data(allProductData?.actions);

        setMarket_data(
          Array.isArray(allProductData?.market_intelligence?.market_info)
            ? allProductData?.market_intelligence?.market_info
            : []
        );
        setTrade_data(allProductData?.trade_intelligence?.trade_info);
        setBuyers_data(allProductData?.buyers_intelligence);

        setPrice_intelligence_data(
          Array.isArray(allProductData?.price_intelligence?.price_info)
            ? allProductData?.price_intelligence?.price_info
            : []
        );

        setVariants_data(
          Array.isArray(allProductData?.variants?.variants_info)
            ? allProductData?.variants?.variants_info
            : []
        );

        setCompetitor_data(
          Array.isArray(allProductData?.competitor_intelligence?.competitors)
            ? allProductData?.competitor_intelligence?.competitors
            : []
        );
        setMarketing_kit_data(allProductData?.marketing_intelligence?.marketing_info);
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  useEffect(() => {
    if (!index) return;
    getFullReportData();
  }, [index]);

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
            <ProductReport
              banner_product_name={banner_product_name}
              banner_hs_code={banner_hs_code}
              banner_certifications={banner_certifications}
              banner_single_country={banner_single_country}
              banner_multiple_country={banner_multiple_country}
              banner_buyer_type={banner_buyer_type}
              banner_price_positioning={banner_price_positioning}
              banner_monthly_supply_capacity={banner_monthly_supply_capacity}
              banner_total_buyers={banner_total_buyers}
              banner_easy_win={banner_easy_win}
              banner_global_trade={banner_global_trade}
              banner_keywords={banner_keywords}
              banner_market_range={banner_market_range}
              banner_score={banner_score}
              overview_data={overview_data}
              urgent_note_data={urgent_note_data}
              actions_data={actions_data}
              market_data={market_data}
              trade_data={trade_data}
              buyers_data={buyers_data}
              variants_data={variants_data}
              competitor_data={competitor_data}
              marketing_kit_data={marketing_kit_data}
              price_intelligence_data={price_intelligence_data}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FullReport;

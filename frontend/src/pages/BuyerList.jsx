import { use, useEffect, useState } from "react";
import BuyerListComponent from "../components/BuyerListComponent";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const BuyerList = () => {
  const [fetchingBuyerData, setFetchingBuyerData] = useState(false);
  const [total_b2b_buyers_data, setTotal_b2b_buyers_data] = useState(0);
  const [buyer_list, setBuyer_list] = useState([]);

  const [countryData, setCountryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [topMatches,setTopMatches] = useState(0);

  const base_url = import.meta.env.VITE_BASE_URL;

  // const getBuyerListData = async () => {
  //   try {
  //     setFetchingBuyerData(true);
  //     const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

  //     const response = await fetch(`${base_url}/buyer-list`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }

  //     const buyerData = await response.json();

  //     // console.log("buyerData: ", buyerData);

  //     if (buyerData.success) {
  //       setBuyer_list(Array.isArray(buyerData?.b2b) ? buyerData?.b2b : []);
  //       setTotal_b2b_buyers_data(buyerData?.total_b2b_buyers || 0);
  //     }
  //   } catch (error) {
  //     console.log("Something went wrong:", error.message);
  //   } finally {
  //     setFetchingBuyerData(false);
  //   }
  // };

  const getBuyerListData = async () => {
    try {
      setFetchingBuyerData(true);

      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const queryParams = new URLSearchParams({
        search: searchTerm,
        product: selectedProduct,
        country: selectedCountry,
        type: selectedType,
      });

      const response = await fetch(
        `${base_url}/buyer-list?${queryParams.toString()}`,
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

      const buyerData = await response.json();

      console.log("buyerData: ",buyerData);

      if (buyerData.success) {
        setBuyer_list(Array.isArray(buyerData?.b2b) ? buyerData.b2b : []);

        setTotal_b2b_buyers_data(buyerData?.total_b2b_buyers || 0);
        setTopMatches(buyerData?.top_matches || 0);
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setFetchingBuyerData(false);
    }
  };

  const get_DropDownData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/buyer-list/filters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const filter_data = await response.json();

      console.log("filterd: ", filter_data);

      if (filter_data.success) {
        setCountryData(
          Array.isArray(filter_data?.countries) ? filter_data?.countries : [],
        );
        setProductData(
          Array.isArray(filter_data?.products) ? filter_data?.products : [],
        );
        setTypeData(
          Array.isArray(filter_data?.types) ? filter_data?.types : [],
        );
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  useEffect(() => {
    get_DropDownData();
  }, []);

  useEffect(() => {
    getBuyerListData();
  }, [searchTerm, selectedProduct, selectedCountry, selectedType]);

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
            <BuyerListComponent
              fetchingBuyerData={fetchingBuyerData}
              total_b2b_buyers_data={total_b2b_buyers_data}
              buyer_list={buyer_list}
              countryData={countryData}
              productData={productData}
              typeData={typeData}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              topMatches={topMatches}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerList;

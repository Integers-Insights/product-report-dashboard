import { useEffect, useState } from "react";
import Header from "../components/Header";
import Product from "../components/Product";
import SideBar from "../components/SideBar";
import NewUserProduct from "../components/NewUserProducts";

const MyProduct = () => {
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const base_url = import.meta.env.VITE_BASE_URL;

  const [hasRunIntelligence, setHasRunIntelligence] = useState(null); // null = loading

  // const getProductData = async () => {
  //   try {
  //     setProductLoading(true);
  //     const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

  //     const response = await fetch(`${base_url}/my-products`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }

  //     const productData = await response.json();

  //     if (productData.success) {
  //       setProductData(productData?.products);
  //     }
  //   } catch (err) {
  //     console.log("Something went wrong", err);
  //   } finally {
  //     setProductLoading(false);
  //   }
  // };

  const getProductData = async () => {
    try {
      setProductLoading(true);

      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const params = new URLSearchParams({
        search: searchValue,
        category: selectedCategory,
        status: selectedStatus,
      });

      const response = await fetch(
        `${base_url}/my-products?${params.toString()}`,
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

      const productData = await response.json();
      console.log("productData: ", productData);

      if (productData.success) {
        setProductData(productData?.products || []);
        setHasRunIntelligence(productData.has_run_intelligence ?? false);
      }
    } catch (err) {
      console.log("Something went wrong", err);
    } finally {
      setProductLoading(false);
    }
  };

  const getDropDownData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/my-products/filters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const filterData = await response.json();

      if (filterData.success) {
        setCategoryData(
          Array.isArray(filterData?.categories) ? filterData?.categories : [],
        );
        setStatusData(
          Array.isArray(filterData?.statuses) ? filterData?.statuses : [],
        );
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  useEffect(() => {
    getDropDownData();
  }, []);

  useEffect(() => {
    getProductData();
  }, [searchValue, selectedCategory, selectedStatus]);

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
              <Product
                productData={productData}
                productLoading={productLoading}
                statusData={statusData}
                categoryData={categoryData}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            ) : (
              <NewUserProduct />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProduct;

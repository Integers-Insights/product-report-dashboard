import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Product from "../Components/Product";
import SideBar from "../Components/SideBar";
import { base_url1 } from "../URL";

const MyProduct = () => {
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const getProductData = async () => {
    try {
      setProductLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url1}/my-products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const productData = await response.json();

      if (productData.success) {
        setProductData(productData?.products);
        console.log("product data", productData);
      }
    } catch (err) {
      console.log("Something went wrong", err);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
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
            <Product productData={productData} productLoading={productLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProduct;

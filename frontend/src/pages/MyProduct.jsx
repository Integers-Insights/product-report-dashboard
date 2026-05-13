import { useEffect, useState } from "react";
import Header from "../components/Header";
import Product from "../components/Product";
import SideBar from "../components/SideBar";

const MyProduct = () => {
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;

  const getProductData = async () => {
    try {
      setProductLoading(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/my-products`, {
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
        <div>
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="sticky top-0 z-10">
            <Header />
          </div>
          <div className="flex-1 p-6">
            <Product productData={productData} productLoading={productLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProduct;

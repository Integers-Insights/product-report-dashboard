import Header from "../components/Header";
import MarketComponent from "../components/Market";
import SideBar from "../components/SideBar";

const MarketIntelligence = () => {
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
            <MarketComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketIntelligence;

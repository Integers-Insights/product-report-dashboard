import Header from "../components/Header";
import HelpComponent from "../components/HelpComponent";
import SideBar from "../components/SideBar";

const Help = () => {
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
            <HelpComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;

import Header from "../Components/Header";
import ProductReport from "../Components/ProductReport";
import SideBar from "../Components/SideBar";

const FullReport = () => {

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
                        <ProductReport />
                    </div>
                </div>
            </div>
        </>
    );
};

export default FullReport;
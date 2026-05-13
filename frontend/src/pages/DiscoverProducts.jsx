import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Steps from "../components/Steps";

const DiscoverProducts = () => {

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
                        <Steps/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiscoverProducts;
import Header from "../Components/Header";
import ProductComponent from "../Components/ProductComponent";
import SideBar from "../Components/SideBar";

const MyProduct = () => {

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
                        <ProductComponent/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProduct;
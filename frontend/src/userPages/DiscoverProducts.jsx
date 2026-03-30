import { useEffect, useState } from "react";
import Header from "../userComponents/Header";
import SideBar from "../userComponents/SideBar";
import Steps from "../userComponents/Steps";

const DiscoverProducts = () => {

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        let timeOut = setTimeout(()=>{
            setPopupOpen(true);
        },1000);

        return ()=>{
            clearTimeout(timeOut);
        }
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
                        <Steps/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiscoverProducts;
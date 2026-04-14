import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./userComponents/ScrollToTop";
import UserSignup from "./userComponents/UserSignup";
import UserLogin from "./userComponents/UserLogin";
import Profile from "./userComponents/Profile";

const Loader = () => (
  <div className="h-screen w-screen flex justify-center items-center">
    <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const OverViewPage = lazy(() => import("./userPages/OverviewPage"));
const DiscoverProducts = lazy(() => import("./userPages/DiscoverProducts"));
const FullReport = lazy(() => import("./userPages/FullReport"));
const VerifyEmail = lazy(() => import("./userComponents/VerifyEmail"));
const FailedVerification = lazy(
  () => import("./userComponents/FailedVerification"),
);
const MyProduct = lazy(() => import("./userPages/MyProject"));
const MarketIntelligence = lazy(() => import("./userPages/MarketIntelligence"));
const BuyerList = lazy(() => import("./userPages/BuyerList"));
const IntelligenceReports = lazy(
  () => import("./userPages/IntelligenceReports"),
);
const Help = lazy(() => import("./userPages/Help"));

const App = () => {

  const [mainLoader, setMainLoader] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setMainLoader(false);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <div>
      {mainLoader && (
        <div className="h-screen bg-surface w-screen fixed top-0 left-0 z-50 flex justify-center items-center">
          <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <ScrollToTop />

        <Suspense fallback={<Loader />}>
          <Routes>
            {/* user */}
            <Route path="/" element={<OverViewPage />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/user-login" element={<UserLogin />} />
            {/* <Route path="/sideBar" element={<SideBar />} /> */}
            {/* <Route path="/form" element={<PopForm />} /> */}
            <Route path="/discover" element={<DiscoverProducts />} />
            <Route path="/full-report" element={<FullReport />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/failed-verification"
              element={<FailedVerification />}
            />
            {/* <Route path="/need" element={<NeedHelp />} /> */}
            <Route path="/product" element={<MyProduct />} />
            <Route path="/market" element={<MarketIntelligence />} />
            <Route path="/buyer" element={<BuyerList />} />
            <Route
              path="/intelligence-reports"
              element={<IntelligenceReports />}
            />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

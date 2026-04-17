import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./Components/ScrollToTop";

const Loader = () => (
  <div className="h-screen w-screen flex justify-center items-center">
    <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Signup = lazy(() => import("./Components/Signup"));
const Login = lazy(() => import("./Components/Login"));
const OverViewPage = lazy(() => import("./pages/OverviewPage"));
const DiscoverProducts = lazy(() => import("./pages/DiscoverProducts"));
const FullReport = lazy(() => import("./pages/FullReport"));
const VerifyEmail = lazy(() => import("./Components/VerifyEmail"));
const FailedVerification = lazy(
  () => import("./Components/FailedVerification"),
);
const MyProduct = lazy(() => import("./pages/MyProduct"));
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"));
const BuyerList = lazy(() => import("./pages/BuyerList"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const Help = lazy(() => import("./pages/Help"));

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
            <Route path="/" element={<OverViewPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/discover" element={<DiscoverProducts />} />
            <Route path="/full-report" element={<FullReport />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/failed-verification"
              element={<FailedVerification />}
            />
            <Route path="/product" element={<MyProduct />} />
            <Route path="/market" element={<MarketIntelligence />} />
            <Route path="/buyer" element={<BuyerList />} />
            <Route
              path="/intelligence-reports"
              element={<Intelligence />}
            />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

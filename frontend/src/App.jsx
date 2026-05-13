import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PrivateComponent from "./components/PrivateComponent.jsx";

const Loader = () => (
  <div className="h-screen w-screen flex justify-center items-center">
    <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Signup = lazy(() => import("./components/Signup.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const OverViewPage = lazy(() => import("./pages/OverviewPage"));
const DiscoverProducts = lazy(() => import("./pages/DiscoverProducts"));
const FullReport = lazy(() => import("./pages/FullReport"));
const VerifyEmail = lazy(() => import("./components/VerifyEmail.jsx"));
const FailedVerification = lazy(
  () => import("./components/FailedVerification"),
);
const MyProduct = lazy(() => import("./pages/MyProduct"));
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"));
const BuyerList = lazy(() => import("./pages/BuyerList"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const Help = lazy(() => import("./pages/Help"));
const Error = lazy(() => import("./pages/Error"));

const Pricing = lazy(() => import("./pages/Pricing"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Team = lazy(() => import("./pages/Team"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const DataPolicy = lazy(() => import("./pages/DataPolicy"));
const GDPR = lazy(() => import("./pages/GDPR"));
const PaymentRefund = lazy(() => import("./pages/PaymentRefund"));


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
            <Route element={<PrivateComponent />}>
              <Route path="/overview" element={<OverViewPage />} />

              <Route path="/discover" element={<DiscoverProducts />} />
              <Route path="/full-report/:id" element={<FullReport />} />

              <Route path="/product" element={<MyProduct />} />
              <Route path="/market" element={<MarketIntelligence />} />
              <Route path="/buyer" element={<BuyerList />} />
              <Route path="/intelligence-reports" element={<Intelligence />} />
              <Route path="/help" element={<Help />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/failed-verification"
              element={<FailedVerification />}
            />
            <Route path="*" element={<Error />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/team" element={<Team />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/data-policy" element={<DataPolicy />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/payment-refund" element={<PaymentRefund />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

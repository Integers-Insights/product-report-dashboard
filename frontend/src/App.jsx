// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ReportingList from "./components/ReportingList";
// import MultiStepForm from "./admin/addData/MultiStepForm";
// import Login from "./auth/Login";
// import Dash from "./admin/Dash";
// import AllReports from "./admin/AllReports";
// import SingleReport from "./admin/SingleReport";
// import ReportName from "./components/ReportName";
// import ContactUs from "./components/ContactUs";
// import HomePage from "./components/HomePage";
// import PrivateComponent from "./auth/PrivateComponent";
// import { Toaster } from 'react-hot-toast';
// import FilteredIndustry from "./components/FilteredIndustry";
// import FilteredReportType from "./components/FilteredReportType";
// import FilteredUseCases from "./components/FilteredUseCases";
// import Error from "./components/Error";
// import { useEffect, useState } from "react";
// import AboutUs from "./components/AboutUs";
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import Conditions from "./components/Conditions";
// import CancellationPolicy from "./components/CancellationPolicy";
// import Disclaimer from "./components/Disclaimer";
// import ResearchMethodology from "./components/ResearchMethodology";
// import OurResearchers from "./components/OurResearchers";
// import ScrollToTop from "./components/ScrollToTop";
// import UserSignup from "./userComponents/UserSignup";
// import UserLogin from "./userComponents/UserLogin";
// import SideBar from "./userComponents/SideBar";
// import OverView from "./userPages/Overview";
// import PopForm from "./userComponents/Form";
// import Steps from "./userComponents/Steps";
// import DiscoverProducts from "./userPages/DiscoverProducts";
// import FullReport from "./userPages/FullReport";

// const App = () => {

//   const [mainLoader, setMainLoader] = useState(true);

//   useEffect(() => {
//     let timeOut = setTimeout(() => {
//       setMainLoader(false);
//     }, 1000);
//     return () => {
//       clearTimeout(timeOut);
//     }
//   }, []);

//   return (
//     <div>
//       {mainLoader && (
//         <div className="h-screen bg-surface w-screen fixed top-0 left-0 z-50 flex justify-center items-center">
//           <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       <Toaster position="top-right" reverseOrder={false} />
//       <BrowserRouter>
//         <ScrollToTop />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about-us" element={<AboutUs />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/term-conditions" element={<Conditions />} />
//           <Route path="/cancellation-policy" element={<CancellationPolicy />} />
//           <Route path="/disclaimer" element={<Disclaimer />} />
//           <Route path="/research-methodology" element={<ResearchMethodology />} />
//           <Route path="/our-researchers" element={<OurResearchers />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/report" element={<ReportingList />} />
//           <Route path="/industry/:slug" element={<FilteredIndustry />} />
//           <Route path="/report-type/:slug" element={<FilteredReportType />} />
//           <Route path="/usecase/:slug" element={<FilteredUseCases />} />
//           <Route path="/report-name/:id" element={<ReportName />} />
//           <Route element={<PrivateComponent />}>
//             <Route path="/add" element={<MultiStepForm />} />
//             <Route path="/add/:id" element={<MultiStepForm />} />
//             <Route path="/dash" element={<Dash />} />
//             <Route path="/all" element={<AllReports />} />
//             <Route path="/single-report/:id" element={<SingleReport />} />
//           </Route>
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<Error />} />

//           {/* user-dash */}
//           <Route path="/overview" element={<OverView />} />
//           <Route path="/signup" element={<UserSignup />} />
//           <Route path="/user-login" element={<UserLogin />} />
//           <Route path="/sideBar" element={<SideBar />} />

//           <Route path="/form" element={<PopForm />} />
//           <Route path="/discover" element={<DiscoverProducts />} />
//           <Route path="/full-report" element={<FullReport />} />

//           {/*  */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// };

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
// import NeedHelp from "./userComponents/NeedHelp";

const Loader = () => (
  <div className="h-screen w-screen flex justify-center items-center">
    <div className="h-10 w-10 border-4 border-[#5FC4BE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const HomePage = lazy(() => import("./components/HomePage"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const Conditions = lazy(() => import("./components/Conditions"));
const CancellationPolicy = lazy(
  () => import("./components/CancellationPolicy"),
);
const Disclaimer = lazy(() => import("./components/Disclaimer"));
const ResearchMethodology = lazy(
  () => import("./components/ResearchMethodology"),
);
const OurResearchers = lazy(() => import("./components/OurResearchers"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const ReportingList = lazy(() => import("./components/ReportingList"));
const ReportName = lazy(() => import("./components/ReportName"));
const Error = lazy(() => import("./components/Error"));
const FilteredIndustry = lazy(() => import("./components/FilteredIndustry"));
const FilteredReportType = lazy(
  () => import("./components/FilteredReportType"),
);
const FilteredUseCases = lazy(() => import("./components/FilteredUseCases"));

const Login = lazy(() => import("./auth/Login"));
const PrivateComponent = lazy(() => import("./auth/PrivateComponent"));

const Dash = lazy(() => import("./admin/Dash"));
const AllReports = lazy(() => import("./admin/AllReports"));
const SingleReport = lazy(() => import("./admin/SingleReport"));
const MultiStepForm = lazy(() => import("./admin/addData/MultiStepForm"));

const UserSignup = lazy(() => import("./userComponents/UserSignup"));
const UserLogin = lazy(() => import("./userComponents/UserLogin"));
// const SideBar = lazy(() => import("./userComponents/SideBar"));
// const PopForm = lazy(() => import("./userComponents/Form"));

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
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/term-conditions" element={<Conditions />} />
            <Route
              path="/cancellation-policy"
              element={<CancellationPolicy />}
            />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route
              path="/research-methodology"
              element={<ResearchMethodology />}
            />
            <Route path="/our-researchers" element={<OurResearchers />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/report" element={<ReportingList />} />
            <Route path="/industry/:slug" element={<FilteredIndustry />} />
            <Route path="/report-type/:slug" element={<FilteredReportType />} />
            <Route path="/usecase/:slug" element={<FilteredUseCases />} />
            <Route path="/report-name/:id" element={<ReportName />} />

            <Route element={<PrivateComponent />}>
              <Route path="/add" element={<MultiStepForm />} />
              <Route path="/add/:id" element={<MultiStepForm />} />
              <Route path="/dash" element={<Dash />} />
              <Route path="/all" element={<AllReports />} />
              <Route path="/single-report/:id" element={<SingleReport />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />

            {/* user */}
            <Route path="/overview" element={<OverViewPage />} />
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
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

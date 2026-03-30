import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Disclaimer = () => {
    return (
        <>
            <Navbar />
            <div className="bg-surface">
                <div className="w-80 sm:w-155 md:w-180 xl:w-285 m-auto my-3 sm:my-6 pb-9">

                    {/* <div className="w-80 sm:w-155 md:w-180 xl:w-285 m-auto py-9">
                        <Breadcrumbs />
                    </div> */}

                    <div className="py-9 flex gap-2 text-primary text-16 font-regular">
                        <span><Link to={"/"}>Home</Link></span>
                        <span>&gt;</span>
                        <span className="font-medium underline">Disclaimer</span>
                    </div>

                    <h1 className="text-primary text-32 font-semibold">Disclaimer</h1>

                    <p className="text-16 text-primary mt-4"><span className="font-medium">Company Name:</span> <span className="font-regular"> Integers Insights Private Limited</span></p>
                    <p className="text-16 text-primary"><span className="font-medium">Last Updated:</span> <span className="font-regular">20 February, 2026</span></p>

                    <h1 className="text-24 text-primary font-semibold mt-4">1. General Information</h1>
                    <p className="text-16 text-primary font-regular">The information, research reports, analyses, forecasts, and materials provided by Integers Insights Private Limited are meant solely for informational and educational purposes.</p>
                    <p className="text-16 text-primary font-regular mt-4">While we do our best to ensure that everything is accurate and reliable, we can't make any promises or guarantees—express or implied—about the completeness, accuracy, suitability, or reliability of the information found in our reports or on our website.</p>
                    <p className="text-16 text-primary font-regular mt-4">Using our reports is entirely at your own discretion and risk. </p>

                    <h1 className="text-24 text-primary font-semibold mt-4">2. No Professional Advice  </h1>
                    <p className="text-16 text-primary font-regular">Our reports should not be taken as: </p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Financial advice </li>
                        <li>Investment advice  </li>
                        <li>Legal advice </li>
                        <li>Tax advice </li>
                        <li>Accounting advice </li>
                        <li>Business consultancy </li>
                    </ul>
                    <p className="text-16 text-primary font-regular">We strongly encourage users to seek independent professional advice before making any financial, investment, or strategic decisions. </p>



                    <h1 className="text-24 text-primary font-semibold mt-4">3. Data Sources & Accuracy</h1>
                    <p className="text-16 text-primary font-regular">Our reports are compiled using publicly available sources such as: </p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Government publications</li>
                        <li>Regulatory filings </li>
                        <li>Trade databases </li>
                        <li>Industry reports</li>
                        <li>Company disclosures</li>
                    </ul>
                    <p className="text-16 text-primary font-regular">While we make reasonable efforts to verify the data, Integers Insights Private Limited cannot guarantee that all information is free from errors, omissions, or delays.</p>
                    <p className="text-16 text-primary font-regular mt-4">Market conditions, regulatory environments, and economic factors can change after publication.</p>



                    <h1 className="text-24 text-primary font-semibold mt-4">4. Forecasts & Projections</h1>
                    <p className="text-16 text-primary font-regular">Any forecasts, growth rates, or projections included in our reports are based on: </p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Historical data trends</li>
                        <li>Analytical modeling</li>
                        <li>Market assumptions</li>
                    </ul>
                    <p className="text-16 text-primary font-regular">Keep in mind that forecasts are forward-looking statements and come with their own uncertainties and external risks. Actual results may vary significantly from what we project. </p>
                    <p className="text-16 text-primary font-regular mt-4">We take no responsibility for decisions made based on forecasted data.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">5. Limitation of Liability</h1>
                    <p className="text-16 text-primary font-regular">To the fullest extent allowed by Indian law: </p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Integers Insights Private Limited won’t be held responsible for any direct, indirect, incidental, consequential, or special damages that may arise from using our reports.</li>
                        <li>We also won’t be liable for any loss of profits, revenue, business opportunities, or damage to your reputation.</li>
                        <li>In any case, our total liability will not exceed the amount you paid for the specific report you purchased. </li>
                    </ul>

                    <h1 className="text-24 text-primary font-semibold mt-4">6. Third-Party Links</h1>
                    <p className="text-16 text-primary font-regular">Our website and reports might include references or links to third-party websites. We don’t control these sites and aren’t responsible for: </p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>External content</li>
                        <li>Third-party privacy practices</li>
                        <li>The accuracy of external data  </li>
                    </ul>
                    <p className="text-16 text-primary font-regular">Just because we include these references doesn’t mean we endorse them.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">7. Intellectual Property </h1>
                    <p className="text-16 text-primary font-regular">All reports and materials are the intellectual property of <span className="font-medium">Integers Insights Private Limited</span>. Unauthorized reproduction, redistribution, or commercial use is strictly forbidden. </p>
                    <p className="text-16 text-primary font-regular">When you purchase, you receive a limited, non-transferable license for internal business use only.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">8. Technology & Automation Disclosure</h1>
                    <p className="text-16 text-primary font-regular">
                        Our research framework uses technology-driven data structuring systems to improve consistency and formatting. However, all reports are created using publicly available data sources and structured analytical methods.
                    </p>
                    <p className="text-16 text-primary font-regular">
                        We do not claim to have access to any confidential or proprietary company data.
                    </p>

                    <h1 className="text-24 text-primary font-semibold mt-4">9. Jurisdiction</h1>
                    <p className="text-16 text-primary font-regular">This Disclaimer will be governed by the laws of India. Any disputes will fall under the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">10. Contact Information </h1>
                    <p className="text-16 text-primary font-regular">For any questions regarding this Disclaimer:</p>
                    <p className="text-16 text-primary font-regular mt-4"><span className="font-medium">Email: </span><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Company Name: </span>Integers Insights Private Limited </p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Address: </span>Unit No. 21, 2nd Floor, Vicino (Mega Mall), New Link Rd, Oshiwara, Andheri West, Mumbai, Maharashtra 400102</p>

                </div>
            </div>
            <Footer />
        </>
    );
};
export default Disclaimer;
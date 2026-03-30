import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const ResearchMethodology = () => {
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
                        <span className="font-medium underline">Research Methodology</span>
                    </div>

                    <h1 className="text-primary text-32 font-semibold">Research Methodology</h1>

                    <p className="text-16 text-primary mt-4">At Integers Insights Private Limited, we pride ourselves on a methodology that emphasizes transparency, structured analysis, and insights that are ready for decision-making. We blend verified public data sources, analytical modeling, and tech-driven structuring systems to deliver clear and trustworthy market intelligence.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">1. Research Framework</h1>
                    <p className="text-16 text-primary font-regular">Our research is built on a multi-stage framework:</p>
                   
                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Data Collection</li>
                        <li>Data Validation</li>
                        <li>Market Estimation</li>
                        <li>Analytical Structuring</li>
                        <li>Forecast Modeling</li>
                        <li>Citation & Source Mapping</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">This organized approach guarantees consistency, clarity, and traceability in all our reports.</p>



                    <h1 className="text-24 text-primary font-semibold mt-4">2. Data Collection</h1>
                    <p className="text-16 text-primary font-regular">We gather data from reliable and publicly accessible sources, such as:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Government trade databases</li>
                        <li>Customs and import-export statistics</li>
                        <li>Publications from regulatory authorities</li>
                        <li>Company annual reports and disclosures</li>
                        <li>Industry associations</li>
                        <li>Research papers and institutional publications</li>
                        <li>Credible industry news platforms</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Rest assured, we do not utilize any confidential or non-public company data.</p>




                    <h1 className="text-24 text-primary font-semibold mt-4">3. Data Validation & Cross-Verification</h1>
                    <p className="text-16 text-primary font-regular">To ensure our findings are reliable:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>We compare multiple independent sources</li>
                        <li>We reconcile conflicting data points through triangulation</li>
                        <li>We review historical trends for logical consistency</li>
                        <li>We flag and evaluate any anomalies</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Our aim is to minimize bias and enhance data integrity.</p>
                   



                    <h1 className="text-24 text-primary font-semibold mt-4">4. Market Size Estimation</h1>
                    <p className="text-16 text-primary font-regular">We estimate market size using structured quantitative methods, including:</p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Top-down allocation modeling</li>
                        <li>Bottom-up aggregation analysis</li>
                        <li>Trade-adjusted consumption calculations</li>
                        <li>Regional benchmarking comparisons</li>
                        <li>Value-chain assessment</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">The assumptions we use for estimation are grounded in historical patterns and documented data sources.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">5. Forecasting & Projections</h1>
                    <p className="text-16 text-primary font-regular">We create forecasts by analyzing:</p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Historical growth trends</li>
                        <li>CAGR-based modeling</li>
                        <li>Demand-driver correlations</li>
                        <li>Scenario-based outlook assessments</li>
                        <li>Sensitivity checks on key influencing factors</li>
                    </ul>

                    <p className="text-16 text-primary font-regular mt-4">Keep in mind that all projections are forward-looking estimates and can be influenced by market uncertainties.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">6. Competitive & Pricing Analysis</h1>
                    <p className="text-16 text-primary font-regular">We gather competitive insights from:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Public financial disclosures</li>
                        <li>Reviews of product portfolios</li>
                        <li>Mapping geographic presence</li>
                        <li>Strategic announcements</li>
                        <li>Analyzing trade price trends</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Our pricing insights come from comparing trade data, understanding regional differences, and examining supply-demand dynamics.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">7. Technology-Enabled Structuring</h1>
                    <p className="text-16 text-primary font-regular">To boost consistency, readability, and scalability, we incorporate AI-driven data processing pipelines into our research process.</p>
                    <p className="text-16 text-primary font-regular mt-4">These systems help us by:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                        <li>Extracting relevant information from various public sources</li>
                        <li>Structuring data into standardized formats</li>
                        <li>Enhancing content clarity and presentation</li>
                        <li>Ensuring citation traceability</li>
                        <li>Minimizing formatting inconsistencies</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Technology enhances our efficiency and organization, while analytical validation guarantees contextual accuracy.</p>



                    <h1 className="text-24 text-primary font-semibold mt-4">8. Citations & Transparency</h1>
                    <p className="text-16 text-primary font-regular">
                        Whenever possible, we back up major data points with source references. 
                    </p>
                    <p className="text-16 text-primary font-regular">
                        We prioritize transparency so users can grasp how we arrive at our conclusions.
                    </p>

                    <h1 className="text-24 text-primary font-semibold mt-4">9. Limitations</h1>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Our analysis relies on publicly available information.</li>
                        <li>Reporting standards can differ across sources.</li>
                        <li>Market conditions may shift after publication.</li>
                        <li>Forecasts are subject to changes in regulations, economics, and technology.</li>
                    </ul>


                    <p className="text-16 text-primary font-regular">We encourage users to interpret findings within their specific business context.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">10. Continuous Improvement</h1>
                    <p className="text-16 text-primary font-regular">Our research methodology is always evolving as new data sources, analytical tools, and structuring technologies emerge. We consistently refine our processes to enhance clarity, reliability, and analytical depth.</p>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default ResearchMethodology;

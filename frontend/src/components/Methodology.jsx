import FAQ from "./FAQ";
import checkMarkIcon from '../assets/checkmark-circle-03.svg'
import { competitiveAnalysis, dataSource, forecastingMethodology, marketEstimation, pricing_Trade, technology_Enabled } from "./Data";

const Methodology = () => {

    return (
        <div>
            <div>
                <h1 className="text-primary text-24 font-semibold">Research Framework</h1>
                <p className="text-primary text-16 font-regular mt-4">This report is developed using a structured research framework combining secondary data analysis, market modeling, and analytical validation. The objective is to deliver reliable market intelligence that supports strategic and commercial decision-making.</p>

                <p className="text-primary text-16 font-regular mt-4">The methodology is designed to ensure:</p>
                <ul className="list-disc ml-6">
                    <li>Data reliability</li>
                    <li>Cross-source validation</li>
                    <li>Logical estimation methods</li>
                    <li>Transparent assumptions</li>
                </ul>
            </div>

            {/* card1 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Data Sources</h1>
                <p className="text-primary text-16 font-regular">The analysis is primarily based on verified secondary sources, including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {dataSource?.map((ds, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span><img src={checkMarkIcon} alt="icon" className="flex-shrink-0" /></span><span>{ds}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">Multiple data sources are compared to ensure consistency and reduce bias.</p>
            </div>

            {/* card2 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Market Estimation Approacht</h1>
                <p className="text-primary text-16 font-regular">Market size and growth projections are derived using a combination of:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {marketEstimation?.map((me, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span className="h-6 w-6 flex-shrink-0"><img src={checkMarkIcon} alt="icon" /></span><span>{me}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">Where required, triangulation methods are applied to validate findings across independent data streams.</p>
            </div>

            {/* card3 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Forecasting Methodology</h1>
                <p className="text-primary text-16 font-regular">Market forecasts are developed using:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {forecastingMethodology?.map((me, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span className="h-6 w-6 flex-shrink-0"><img src={checkMarkIcon} alt="icon" /></span><span>{me}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">Forecasts represent structured projections based on available data and prevailing market conditions at the time of publication.</p>
            </div>

            {/* card4 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Competitive Analysis Method</h1>
                <p className="text-primary text-16 font-regular">Competitive insights are compiled through:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {competitiveAnalysis?.map((me, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span className="h-6 w-6 flex-shrink-0"><img src={checkMarkIcon} alt="icon" /></span><span>{me}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">The objective is to provide an overview of competitive intensity rather than confidential company data.</p>
            </div>

            {/* card5 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Pricing & Trade Analysis</h1>
                <p className="text-primary text-16 font-regular">Pricing insights are derived from:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {pricing_Trade?.map((me, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span className="h-6 w-6 flex-shrink-0"><img src={checkMarkIcon} alt="icon" /></span><span>{me}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">Trade flows are analyzed to understand import/export dynamics, supply concentration, and regional demand patterns.</p>
            </div>

            {/* card6 */}
            <div className="mt-9">
                <h1 className="text-primary text-24 font-semibold">Technology-Enabled Research Framework</h1>
                <p className="text-primary text-16 font-regular">To enhance accuracy, scalability, and consistency, our research process incorporates AI-powered data structuring pipelines. These systems assist in:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mt-4">
                    {technology_Enabled?.map((me, i) => {
                        return (
                            <div key={i} className="flex items-center gap-2 text-15 font-medium"><span className="h-6 w-6 flex-shrink-0"><img src={checkMarkIcon} alt="icon" /></span><span>{me}</span></div>
                        )
                    })}
                </div>
                <p className="text-primary text-16 font-regular mt-5">Multiple analytical models are applied to organize data logically and ensure coherent presentation. All structured outputs undergo validation checks to maintain contextual relevance and factual alignment with source materials.</p>
                <p className="text-primary text-16 font-regular mt-5">Each data point included in the report is traceable to its original source through proper citation, ensuring transparency and verifiability.</p>
                <p className="text-primary text-16 font-regular mt-5">Technology supports efficiency while analytical rigor ensures reliability.</p>
            </div>

            <div className=" mt-9">
                <h1 className="text-primary text-24 font-semibold">Assumptions & Limitations</h1>
                <ul className="list-disc ml-6">
                    <li>The analysis is based on publicly available information and structured estimation models.</li>
                    <li>Exact figures may vary due to reporting differences or data availability.</li>
                    <li>Forecasts are subject to economic, regulatory, or technological changes.</li>
                    <li>The report does not include proprietary or confidential company-level data.</li>
                </ul>

                <h1 className="text-primary text-24 font-semibold mt-9">Update Policy</h1>
                <p className="text-primary text-16 font-regular">Reports are reviewed periodically to incorporate major market developments, regulatory changes, and updated trade data. The latest update date is indicated on the report overview page.</p>

                <h1 className="text-primary text-24 font-semibold mt-9">Final Note</h1>
                <p className="text-primary text-16 font-regular">This methodology ensures transparency in how conclusions are derived, enabling users to confidently interpret and apply the insights provided.</p>
            </div>
            <div className=" mt-9">
                <h1 className="text-primary text-24 font-semibold mb-4">Frequently Asked Questions (FAQs)</h1>
                <FAQ />
            </div>
        </div>
    );
};
export default Methodology;

import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";
import OurTeams from "./OutTeams";

const OurResearchers = () => {
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
                        <span className="font-medium underline">Our Researchers</span>
                    </div>

                    <h1 className="text-primary text-32 font-semibold">Our Researchers</h1>

                    <p className="text-16 text-primary mt-4">At Integers Insights Private Limited, our research team brings together sharp analytical skills, organized data processing, and tech-driven workflows to deliver trustworthy market intelligence.  We function as a tight-knit, collaborative group—where research, validation, and system design come together to guarantee that every report is consistent and clear.</p>

                    <OurTeams/>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-13">
                        <div>
                            <h1 className="text-24 text-primary font-semibold">How We Work</h1>
                            <p className="text-16 text-primary mt-4">Our team of researchers follows a well-defined workflow:</p>
                            <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                                <li>Identifying and validating sources</li>
                                <li>Extracting and comparing data</li>
                                <li>Creating analytical models</li>
                                <li>Structuring with the help of technology</li>
                                <li>Conducting final reviews and consistency checks</li>
                            </ul>

                            <p className="text-16 text-primary mt-4">We place a high value on transparency, logical methods, and traceable sources in every report we produce.</p>
                        </div>
                        <div>
                            <h1 className="text-24 text-primary font-semibold">Our Research Philosophy</h1>
                            <p className="text-16 text-primary mt-4">We believe that effective research should be:</p>
                            <ul className="text-16 text-primary font-regular list-disc ml-10 mt-4">
                                <li>Clear, not cluttered</li>
                                <li>Structured, not scattered</li>
                                <li>Transparent, not vague</li>
                                <li>Analytical, not based on assumptions</li>
                            </ul>
                            <p className="text-16 text-primary mt-4">By merging disciplined research practices with technology-driven systems, we strive to provide reports that are both scalable and trustworthy.</p>
                        </div>
                    </div>



                </div>
            </div>
            <Footer />
        </>
    );
};
export default OurResearchers;

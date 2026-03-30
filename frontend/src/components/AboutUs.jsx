// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Rectangle_16 from '../assets/Rectangle 16.png';
import Rectangle_18 from '../assets/Rectangle 18.png';
import FAQ from "./FAQ";
import OurTeams from "./OutTeams";
import { Link } from "react-router-dom";

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <div className="bg-surface my-3 sm:my-6">
                {/* <div className="w-80 sm:w-138 xl:w-285 m-auto my-3 sm:my-6 py-5 block xl:hidden">
                    <Breadcrumbs />
                </div> */}


                <div className="w-80 sm:w-138 xl:w-285 m-auto block xl:hidden">
                    <div className="my-3 sm:my-6 py-5 flex gap-2 text-primary text-16 font-regular">
                        <span><Link to={"/"}>Home</Link></span>
                        <span>&gt;</span>
                        <span>About Us</span>
                    </div>
                </div>


                <div className="bg-surface w-80 sm:w-138 xl:w-285 m-auto flex flex-col-reverse xl:flex-row gap-9">

                    <div className="w-80 sm:w-138">
                        {/* <div className="py-8 hidden xl:block">
                            <Breadcrumbs />
                        </div> */}

                        <div className="hidden xl:block">
                            <div className="py-8 flex gap-2 text-primary text-16 font-regular">
                                <span><Link to={"/"}>Home</Link></span>
                                <span>&gt;</span>
                                <span className="font-medium underline">About Us</span>
                            </div>
                        </div>


                        <div>
                            <h1 className="text-32 text-primary font-semibold">We are a research-driven team</h1>
                            <p className="text-16 text-primary font-regular mt-2">We are a research-driven team delivering structured, accessible, and decision-ready market intelligence.</p>

                            <p className="text-16 text-primary font-regular mt-2">Our mission is to transform scattered public data into clear, organized, and actionable reports. Through analytical thinking, structured research, and technology-enabled workflows, we simplify complex market information.</p>

                            <p className="text-16 text-primary font-regular mt-4">We focus on clarity, transparency, and credibility. Every report is built with traceable sources, logical structuring, and practical insights to support informed business decisions.</p>
                        </div>
                    </div>
                    <div className="w-80 sm:w-138 h-60 sm:h-107">
                        <img src={Rectangle_16} alt="image" className="w-full h-full" />
                    </div>

                </div>
            </div>

            <div className="bg-surface my-3 sm:my-6">
                <div className="w-80 sm:w-138 xl:w-285 m-auto pt-10">
                    <h1 className="text-32 text-primary font-semibold">What We Do</h1>
                </div>
                <div className="w-80 sm:w-138 xl:w-285 m-auto my-4 pb-9 flex flex-col xl:flex-row gap-9">

                    <div className=" w-80 sm:w-138 h-60 sm:h-80">
                        <img src={Rectangle_18} alt="image" className="w-full h-full" />
                    </div>

                    <div className=" w-80 sm:w-138">
                        <div>
                            <ul className="text-16 text-primary font-regular list-disc ml-7">
                                <li>We gather data from trusted public sources to ensure accuracy.</li>
                                <li>We organize and standardize the information so it’s easy to read.</li>
                                <li>We make sure to provide clear citations for transparency.</li>
                                <li>We offer well-structured market overviews and strategic insights.</li>
                                <li>We’re committed to continuously enhancing our research framework with cutting-edge technology.</li>
                            </ul>

                            <p className="text-16 text-primary font-regular mt-2">Our goal is to cut through the noise of information overload and deliver insights that empower confident decision-making.</p>
                        </div>
                    </div>
                </div>
            </div>

            <OurTeams />

            <div className="bg-surface my-3 sm:my-6">
                <div className="w-80 sm:w-138 xl:w-285 m-auto my-4 py-9">
                    <h1 className="text-32 text-primary font-semibold pb-6">Frequently Asked Questions (FAQs)</h1>
                    <FAQ />
                </div>
            </div>

            <Footer />
        </>
    );
};
export default AboutUs;

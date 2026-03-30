import selective from '../assets/selective.svg';
import Group from '../assets/Group.svg';
import download from '../assets/download.svg';
import circleArrow from '../assets/circle-arrow.svg';
import c1 from '../assets/c1.svg';
import c2 from '../assets/c2.svg';
import c3 from '../assets/c3.svg';
import c4 from '../assets/c4.svg';
import { useNavigate } from 'react-router-dom';
import { curatedData, howThisHelpsYou, textContainerData } from './Data';
import WhyChooseUs from './WhyChooseUs';
import HomePageCards from './HomePageCards';
import Footer from './Footer';
import Navbar from './Navbar';

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <>
        <Navbar/>
            <div className="bg-surface">
                <div className="h-120 flex items-center w-full hero-bg-img">
                    <div className="w-80 sm:w-140 xl:w-285 m-auto flex gap-5 justify-center">
                        <div className="w-80 sm:w-140">
                            <div>
                                <h1 className="text-32 text-primary font-semibold">Decision-orianted, not feature-orianted</h1>
                                <p className="text-16 text-primary font-regular mt-2 ">Comprehensive market trends, comsumer analysis and competitive landscape <br /> reports</p>
                            </div>
                            <div className=" mt-8 flex gap-7">
                                <button className="py-2 px-8 bg-surface text-primary text-15 font-medium cursor-pointer hover:bg-gray-100" onClick={() => navigate("/report")}>Browse Reports</button>
                                {/* <button className="py-2 px-8 border-text-primary text-primary text-15 font-medium cursor-pointer">Search Market Data</button> */}
                            </div>
                        </div>
                        <div className=" w-140 hidden xl:block">
                        </div>
                    </div>
                </div>
                <div className="w-80 md:w-188 xl:w-285 m-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-18">
                    <HomePageCards
                        txt1={"Consumer Goods"}
                        txt2={"Designed to support product launches, portfolio expansion, and market sizing decisions."}
                        label1={"Market Study"}
                        label2={"Consumption"}
                        label3={"Price Analysis"}
                    />
                    <HomePageCards
                        txt1={"Health & Wellness"}
                        txt2={"Data-driven insights covering nutraceuticals, supplements, wellness ingredients, and preventive health markets"}
                        label1={"Consumption"}
                        label2={"Formats"}
                        label3={"Target Segments"}
                    />
                    <HomePageCards
                        txt1={"Ingredients & Materials"}
                        txt2={"In-depth analysis of functional ingredients, raw materials, excipients, and specialty chemicals."}
                        label1={"Buyers & Sellers"}
                        label2={"Import & Export"}
                        label3={"Pricing"}
                    />
                </div>
                <div className="bg-section">
                    <div className=" py-18">
                        <h1 className="text-24 text-primary font-semibold text-center">WHY CHOOSE US</h1>
                        <div className="w-63.5 grid grid-cols-1 sm:w-138 sm:grid-cols-2 xl:w-287 xl:grid-cols-4 gap-11 pt-12  m-auto">
                            <WhyChooseUs
                                imgPath={c1}
                                title={"Generic Credible"}
                                subtitle={"Our reports are built using verified public data sources, trade statistics, company disclosures and structured research ensuring reliability without unnecessary assumptions."}
                            />
                            <WhyChooseUs
                                imgPath={c2}
                                title={"Updated Frequently"}
                                subtitle={"Markets change fast. We regularly update key data points, pricing signals, and competitive landscapes so decisions are based on current information, not outdated reports"}
                            />
                            <WhyChooseUs
                                imgPath={c3}
                                title={"Methodology Transparency"}
                                subtitle={"Each report clearly explains data sources, assumptions, estimation logic, and limitations; so you know exactly how insights are derived and can trust the outcomes"}
                            />
                            <WhyChooseUs
                                imgPath={c4}
                                title={"In-Detail Study"}
                                subtitle={"Beyond surface-level summaries, our reports dive into market structure, value chains, competitor positioning, pricing layers, and future outlooks enabling confident decision-making"}
                            />
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className=" py-18">
                        <h1 className="text-24 text-primary font-semibold text-center">CURATED FOR YOUR USE CASES</h1>
                        <div className=" w-80 sm:w-111 lg:w-225 xl:w-285 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-12 m-auto">
                            {
                                curatedData?.map((curated, i) => {
                                    return (
                                        <div className="border-brand-primary p-5 w-full sm:w-54 h-24 text-center content-center" key={i}>
                                            <h1 className="text-20 text-primary font-medium">{curated}</h1>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className=" py-18">
                        <h1 className="text-24 text-primary font-semibold text-center">HOW THIS HELPS YOU DECIDE</h1>
                        <div className=" w-80 grid grid-cols-1 sm:w-160 sm:grid-cols-2 xl:grid-cols-4 gap-6 py-20 xl:w-285 m-auto pt-12">
                            {
                                howThisHelpsYou?.map((titleText, i) => {
                                    return (
                                        <div className="border-text-secondary w-full sm:w-67 h-24 bg-surface text-center content-center relative" key={i}>
                                            <h1 className="text-20 text-primary font-regular">{titleText}</h1>
                                            <div className="div border-brand-primary absolute bottom-0 w-full"></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className=" bg-section">
                    <div className=" py-18">
                        <h1 className="text-24 text-primary font-semibold text-center">HOW TO GET MODULAR REPORT</h1>
                        <div className=" w-80 flex flex-col lg:flex-row items-center gap-13 pt-12 lg:w-209 m-auto">
                            <div className=" w-44 h-45">
                                <div className=' h-25 w-25 m-auto'>
                                    <img src={selective} alt="image" className='h-full w-full' />
                                </div>
                                <div className='px-2 mt-5'>
                                    <p className='text-primary text-20 font-medium text-center'>Choose industry or market</p>
                                </div>
                            </div>
                            <div className=" w-12 h-12">
                                <img src={circleArrow} alt="icon" className='h-ful w-full' />
                            </div>
                            <div className=" w-44 h-45">
                                <div className=' h-25 w-25 m-auto'>
                                    <img src={Group} alt="image" className='h-full w-full' />
                                </div>
                                <div className='px-2 mt-5'>
                                    <p className='text-primary text-20 font-medium text-center'>Buy full report or specific sections</p>
                                </div>
                            </div>
                            <div className=" w-12 h-12">
                                <img src={circleArrow} alt="icon" className='h-ful w-full' />
                            </div>
                            <div className=" w-44 h-45">
                                <div className=' h-25 w-25 m-auto'>
                                    <img src={download} alt="image" className='h-full w-full' />
                                </div>
                                <div className='px-2 mt-5'>
                                    <p className='text-primary text-20 font-medium text-center'>Download or view online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" w-80 sm:w-160 lg:w-240 m-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:w-314 xl:grid-cols-7 gap-8.5 text-15 text-primary font-medium py-18">
                    {
                        textContainerData?.map((textContainerTitle, i) => {
                            return (
                                <div className="border-brand-primary py-3 text-center" key={i}>{textContainerTitle}</div>
                            )
                        })
                    }
                </div>
                <Footer />
            </div>
        </>
    );
};
export default HomePage;

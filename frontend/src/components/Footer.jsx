import { Link, useNavigate } from 'react-router-dom';
import logo1 from '../assets/Logo-footer.svg';

const Footer = () => {

    return (
        <div className="bg-brand w-full">
            <div className="w-80 sm:w-160 grid grid-cols-1 sm:grid-cols-2 xl:w-314 xl:grid-cols-3 py-20 bg-brand gap-8 m-auto">
                <div>
                    <div>
                        <h1 className="text-24 text-primary font-medium">Subscribe for updates</h1>
                        <p className="text-16 text-primary font-regular mt-2">We provide structured, data-driven market research reports designed to support product strategy, market entry, pricing, and competitive decisions. Our focus is on delivering credible, regularly updated insights tailored for SMEs, consultants, and growth-focused businesses.</p>
                    </div>
                    <div className="mt-6">
                        <button className=" py-2 px-8 text-16 text-primary font-medium bg-surface cursor-pointer hover:bg-gray-100">Subscribe Now</button>
                    </div>
                </div>
                <div>
                    <h1 className="text-24 text-primary font-medium">Offices</h1>
                    <p className="text-16 text-primary font-semibold mt-2">Integers Insights Pvt. Ltd.</p>
                    <p className="text-16 text-primary font-regular mt-2">Unit No. 27, 2nd Floor, Vicino (Mega Mall), New Link Rd, Oshiwara, Andheri West, Mumbai, Maharashtra 400102</p>
                </div>
                <div>
                    <h1 className="text-24 text-primary font-medium">Important Links</h1>
                    <div className="mt-2 flex justify-between">
                        <div>
                            <ul className="text-16 text-primary font-regular flex flex-col gap-2">
                                <li>Industries</li>
                                <li>Countries</li>
                                <li>Report types</li>
                                <li>Trending Ingredient</li>
                                <li>Trending Industry</li>
                                <li>Best Selling</li>
                            </ul>
                        </div>
                        <div>
                            <ul className="text-16 text-primary font-regular flex flex-col gap-2">

                                {/* <li><Link to={"/about-us"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>About</Link></li> */}
                                <li><Link to={"/about-us"}>About</Link></li>

                                {/* <li><Link to={"/contact"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Contact</Link></li> */}
                                <li><Link to={"/contact"}>Contact</Link></li>

                                {/* <li><Link to={"/privacy-policy"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Privacy Policy</Link></li> */}
                                <li><Link to={"/privacy-policy"}>Privacy Policy</Link></li>

                                {/* <li><Link to={"/term-conditions"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Terms & Conditions</Link></li> */}
                                <li><Link to={"/term-conditions"}>Terms & Conditions</Link></li>

                                {/* <li><Link to={"/cancellation-policy"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Refund & Cancellation Policy</Link></li> */}
                                <li><Link to={"/cancellation-policy"}>Refund & Cancellation Policy</Link></li>

                                {/* <li><Link to={"/disclaimer"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Disclaimer</Link></li> */}
                                <li><Link to={"/disclaimer"}>Disclaimer</Link></li>

                                 {/* <li><Link to={"/our-researchers"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Our Researchers</Link></li> */}
                                <li><Link to={"/our-researchers"}>Our Researchers</Link></li>

                                {/* <li><Link to={"/research-methodology"} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Methodologies</Link></li> */}
                                <li><Link to={"/research-methodology"}>Methodologies</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <div className="border flex justify-center xl:justify-end items-center">
                    <div className="w-50 h-50 bg-brand text-center content-center rounded-full">
                        <img src={logo1} alt="logo" className=" border h-full w-full rounded-full" />
                    </div>
                </div> */}
            </div>

            <p className='px-1 sm:px-0 text-center text-xl pb-1.5'>2026 Integers Insights Private Limited | All Right Reserved
            </p>

        </div>
    );
};

export default Footer;

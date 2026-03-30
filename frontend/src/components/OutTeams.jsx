import nikhil_raut from '../assets/nikhil raut.png';
import neel_naik from '../assets/neel naik.png';
import yukta_moolya from '../assets/yukta moolya.png';
import amarjit from '../assets/Amarjit.png';
import { BsLinkedin } from "react-icons/bs";

const OurTeams = () => {
    return (
        <div className='bg-surface my-3 sm:my-6'>
            <div className="w-80 sm:w-138 xl:w-285 m-auto my-3 sm:my-6 py-5">
                <h1 className="text-32 text-primary font-semibold">Meet Our Team</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 my-9">

                    <div>
                        <div className="h-80 relative overflow-hidden">
                            <img src={nikhil_raut} alt="image" className='h-full w-full transition-transform duration-300 hover:scale-110' />
                            <div className="absolute bottom-4 right-4 cursor-pointer bg-surface rounded">
                                <a href="https://www.linkedin.com/in/nikhil-raut94/" target='_blank'><BsLinkedin className="text-3xl text-[#0A66C2]" /></a>
                            </div>
                        </div>
                        <p className='text-primary text-16 mt-1 text-center'>
                            <span className='font-medium'>Nikhil Raut </span>–<span> Technology & Systems</span>
                        </p>
                    </div>
                    <div>
                        <div className="h-80 relative overflow-hidden">
                            <img src={neel_naik} alt="image" className='h-full w-full transition-transform duration-300 hover:scale-110' />
                            <div className="absolute bottom-4 right-4 cursor-pointer bg-surface rounded">
                                {/* <BsLinkedin className="text-3xl text-[#0A66C2]" /> */}
                                <a href="https://www.linkedin.com/in/neel-naik-27aba11a0/" target='_blank'><BsLinkedin className="text-3xl text-[#0A66C2]" /></a>
                            </div>
                        </div>
                        <p className='text-primary text-16 mt-1 text-center'>
                            <span className='font-medium'>Neel </span>–<span> Strategy & Product</span>
                        </p>
                    </div>
                    <div>
                        <div className="h-80 relative overflow-hidden">
                            <img src={yukta_moolya} alt="image" className='h-full w-full transition-transform duration-300 hover:scale-110' />
                            <div className="absolute bottom-4 right-4 cursor-pointer bg-surface rounded">
                                <a href="https://www.linkedin.com/in/yukta-moolya" target='_blank'><BsLinkedin className="text-3xl text-[#0A66C2]" /></a>
                            </div>
                        </div>
                        <p className='text-primary text-16 mt-1 text-center'>
                            <span className='font-medium'>Yukta </span>–<span> Research & Content</span>
                        </p>
                    </div>
                    <div>
                        <div className="h-80 relative overflow-hidden">
                            <img src={amarjit} alt="image" className='object-cover h-full w-full transition-transform duration-300 hover:scale-110' />
                            <div className="absolute bottom-4 right-4 cursor-pointer bg-surface rounded">
                                <a href="https://www.linkedin.com/in/amarjit-gupta-03a633357/" target='_blank'><BsLinkedin className="text-3xl text-[#0A66C2]" /></a>
                            </div>

                        </div>
                        <p className='text-primary text-16 mt-1 text-center'>
                            <span className='font-medium'>Amarjit </span>–<span> Operations & Market Insights</span>
                        </p>
                    </div>

                </div>
                {/* <p className="text-primary text-16"><span className="font-medium">Nikhil Raut</span> – Technology & Systems Builds and maintains the AI-driven data processing pipeline and automation framework.</p>

                <p className="text-primary text-16"><span className="font-medium">Neel</span> – Strategy & Product Oversees research direction, report structure, and platform development.</p>

                <p className="text-primary text-16"><span className="font-medium">Yukta</span> –  Research & Content Leads data compilation, validation, and content structuring.</p>

                <p className="text-primary text-16"><span className="font-medium">Amarjit</span> – Operations & Market Insights Supports data validation, competitive tracking, and operational execution.</p> */}
            </div>
        </div>
    );
};
export default OurTeams;
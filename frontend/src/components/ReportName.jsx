import { useEffect, useState } from 'react';
import ScopeCoverage from './ScopeCoverage';
import TableContent from './TableContent';
import SamplePreview from './SamplePreview';
import Methodology from './Methodology';
import ContactForm from './ContactForm';
import TabButton from './TabButton';
import { useParams } from 'react-router-dom';
import { base_url } from '../URL';
import toast from 'react-hot-toast';
import Footer from './Footer';
import Navbar from './Navbar';
import KeyWords from './Keywords';

const ReportName = () => {

    const [activeTab, setActiveTab] = useState("Scope & Coverage");
    const [popupOpen, setPopupOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [reportId, setReportId] = useState("");
    const [reportPages, setReportPages] = useState("");
    const [reportCovers, setReportCovers] = useState([]);
    const [reportSupports, setReportSupports] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [imgPath, setImgPath] = useState(null);
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [seoKeywords, setSeoKeywords] = useState([]);
    const [pdfPath, setPdfPath] = useState(null);
    const [loader5, setLoader5] = useState(false);

    let param = useParams();
    let index = param.id;

    const getFullReportData = async () => {
        try {
            setLoader5(true);
            let result = await fetch(`${base_url}/reports/${index}/full`);

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();

            if (data) {
                setAmount(data?.price_info?.amount_cents);
                setReportId(data?.price_info?.report_unique_id);
                setReportPages(data?.price_info?.page_count);
                setReportCovers(data?.scope?.[0]?.values || []);
                setReportSupports(data?.scope?.[1]?.values || []);
                setTableContent(data?.sections || []);
                setImgPath(data?.price_info?.image_path || null);
                setTitle(data?.price_info?.title);
                setSubTitle(data?.price_info?.subtitle);
                setPdfPath(data?.price_info?.pdf_url || null);
                const keywords = data?.price_info?.seo_keywords?.split(",") || [];
                setSeoKeywords(keywords);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("Something went wrong...");
        } finally {
            setLoader5(false);
        }
    }

    useEffect(() => {
        if (index) {
            getFullReportData();
        }
    }, [index]);

    if (loader5) {
        return (
            <div className="h-60 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className='bg-gray-100 py-7'>
                <div className="w-80 sm:w-160 lg:w-198 xl:w-285 m-auto">
                    <div className="flex gap-6 items-start">
                        <div className="w-80 sm:w-160 lg:w-198">
                            {/* <div className=" flex gap-2 text-primary text-16 font-regular">
                            <span>Home</span>
                            <span>&gt;</span>
                            <span>Reports</span>
                            <span>&gt;</span>
                            <span>Industry Name</span>
                            <span>&gt;</span>
                            <span>Report Name</span>
                        </div> */}

                            <div className=" flex gap-1.5 xl:gap-4 mt-6">
                                <div className="w-24 h-32 flex-shrink-0 hidden sm:block">
                                    {imgPath && <img src={imgPath} alt="image" className=' w-24 h-32' />}
                                </div>
                                <div>
                                    <h1 className='text-primary text-32 font-semibold break-words'>
                                        {title?.length > 90 ? title.slice(0, 90) + " ..." : title}
                                    </h1>
                                    <p className='text-primary text-16 font-regular mt-2'>
                                        {subTitle?.length > 200 ? subTitle.slice(0, 200) + " ..." : subTitle}
                                    </p>
                                    <div className=" flex gap-2 mt-2">
                                        <div className="border border-gray-300 bg-surface px-2 py-0.5 text-primary text-13 font-regular">Import Export</div>
                                        <div className="border border-gray-300 bg-surface px-2 py-0.5 text-primary text-13 font-regular">Competitors Landscape</div>
                                        <div className="border border-gray-300 bg-surface px-2 py-0.5 text-primary text-13 font-regular">Target Customers</div>
                                    </div>
                                </div>
                            </div>
                            <div className=" m-auto my-4 w-84 block xl:hidden bg-surface p-2">
                                <div className="w-80">
                                    <div className="flex gap-2 items-center border-b border-b-gray-400 pb-3">
                                        <p className='text-primary text-24 font-semibold'>$ {amount || ""}</p>
                                        <span className='text-primary text-16 font-regular'>(Excluding Tax)</span>
                                    </div>
                                    <div className=" mt-2 flex flex-col gap-2">
                                        <div className=" flex gap-1.5">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                                <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                            </svg>
                                            </span>
                                            <span className='text-primary text-16 font-regular'>ID: {reportId || ""}</span>
                                        </div>
                                        <div className=" flex gap-1.5">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                                <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                            </svg>
                                            </span>
                                            <span className='text-primary text-16 font-regular'>Pages: {reportPages || ""}</span>
                                        </div>
                                        <div className=" flex gap-1.5">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                                <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                            </svg>
                                            </span>
                                            <span className='text-primary text-16 font-regular'>Format: PDF</span>
                                        </div>
                                    </div>
                                    <div className=" bg-brand h-10 mt-5 w-full">
                                        <button className=' h-full w-full text-15 font-medium text-primary cursor-pointer hover:bg-[var(--color-brand-primary-hover)]' onClick={() => setPopupOpen(true)}>Buy This Report</button>
                                    </div>
                                </div>
                                <div className=" w-80 mt-6">
                                    <div className="flex gap-2 items-center pb-3">
                                        <h1 className='text-primary text-20 font-medium'>Customize Your Report</h1>
                                    </div>
                                    <div className=" mt-2 flex flex-col gap-2">
                                        <p className='text-primary text-16 font-regular'>Lorem ipsum dolor sit amet consectetur. Blandit massa consectetur sem consequat pellentesque cursus cursus in. Lacus arcu.</p>
                                    </div>
                                    <div className=" bg-brand h-10 mt-5 w-full">
                                        <button className=' h-full w-full text-15 font-medium text-primary cursor-pointer hover:bg-[var(--color-brand-primary-hover)]' onClick={() => setPopupOpen(true)}>Customize Now</button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-80 sm:w-160 lg:w-198 flex gap-4 mt-3">
                                <TabButton
                                    label="Scope & Coverage"
                                    isActive={activeTab === "Scope & Coverage"}
                                    onClick={() => setActiveTab("Scope & Coverage")}
                                />
                                <TabButton
                                    label="Table of Content"
                                    isActive={activeTab === "Table of Content"}
                                    onClick={() => setActiveTab("Table of Content")}
                                />
                                <TabButton
                                    label="Sample Preview"
                                    isActive={activeTab === "Sample Preview"}
                                    onClick={() => setActiveTab("Sample Preview")}
                                />
                                <TabButton
                                    label="Methodology"
                                    isActive={activeTab === "Methodology"}
                                    onClick={() => setActiveTab("Methodology")}
                                />
                            </div>
                            <div className=' w-80 sm:w-160 lg:w-198 p-0 xl:p-6 bg-surface px-1'>
                                {activeTab === "Scope & Coverage" && <ScopeCoverage setPopupOpen={setPopupOpen} reportCovers={reportCovers} reportSupports={reportSupports} setActiveTab={setActiveTab} />}
                                {activeTab === "Table of Content" &&
                                    <>
                                        <TableContent tableContent={tableContent} />
                                        <KeyWords seoKeywords={seoKeywords} />
                                    </>
                                }
                                {activeTab === "Sample Preview" && <SamplePreview pdfPath={pdfPath} />}
                                {activeTab === "Methodology" && <Methodology />}
                            </div>
                        </div>
                        <div className="sticky top-21 self-start w-81 hidden xl:block bg-surface">
                            <div className="w-81 p-4">
                                <div className="flex gap-2 items-center border-b border-b-gray-400 pb-3">
                                    <p className='text-primary text-24 font-semibold'>$ {amount || ""}</p>
                                    <span className='text-primary text-16 font-regular'>(Excluding Tax)</span>
                                </div>
                                <div className=" mt-2 flex flex-col gap-2">
                                    <div className=" flex gap-1.5">
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                            <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                        </svg>
                                        </span>
                                        <span className='text-primary text-16 font-regular'>ID: {reportId || ""}</span>
                                    </div>
                                    <div className=" flex gap-1.5">
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                            <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                        </svg>
                                        </span>
                                        <span className='text-primary text-16 font-regular'>Pages: {reportPages || ""}</span>
                                    </div>
                                    <div className=" flex gap-1.5">
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#3CD690" />
                                            <path d="M15.8322 7.09717C16.2147 6.88711 16.6943 7.02894 16.9034 7.41357C17.1122 7.79828 16.9712 8.28064 16.5888 8.49099C15.0853 9.31824 13.7003 11.0282 12.6609 12.629C12.151 13.4143 11.7424 14.1451 11.4612 14.6794C11.3209 14.9461 11.2129 15.1634 11.1405 15.3122C11.1043 15.3866 11.0761 15.4437 11.0582 15.4818C11.0493 15.5008 11.0429 15.5151 11.0387 15.5242C11.0368 15.5284 11.0355 15.5315 11.0346 15.5335L11.0336 15.5356C10.9116 15.8037 10.652 15.9825 10.3592 15.9988C10.0664 16.015 9.78915 15.8662 9.6386 15.6131C9.28802 15.0236 8.73952 14.4985 8.2467 14.1066C8.00548 13.9148 7.78847 13.7634 7.63299 13.6609C7.55553 13.6099 7.49395 13.5712 7.45309 13.5462C7.43268 13.5337 7.41721 13.5248 7.40786 13.5193C7.40318 13.5165 7.39861 13.5131 7.39861 13.5131C7.02005 13.2958 6.88784 12.8114 7.10357 12.4305C7.31953 12.0496 7.80117 11.9167 8.17988 12.1337L8.19016 12.1389C8.19488 12.1417 8.20093 12.1457 8.20866 12.1503C8.22439 12.1596 8.24614 12.1729 8.27343 12.1896C8.32796 12.2229 8.40506 12.2707 8.49856 12.3323C8.68513 12.4552 8.9415 12.6341 9.22637 12.8606C9.5187 13.0931 9.85205 13.387 10.1752 13.7313C10.4659 13.1901 10.8594 12.499 11.3389 11.7605C12.4047 10.1189 13.9675 8.12291 15.8322 7.09717Z" fill="white" />
                                        </svg>
                                        </span>
                                        <span className='text-primary text-16 font-regular'>Format: PDF</span>
                                    </div>
                                </div>
                                <div className=" bg-brand h-10 mt-5 w-full">
                                    <button className=' h-full w-full text-15 font-medium text-primary cursor-pointer hover:bg-[var(--color-brand-primary-hover)]' onClick={() => setPopupOpen(true)}>Buy This Report</button>
                                </div>
                            </div>
                            <div className=" w-81 p-4 mt-6">
                                <div className="flex gap-2 items-center pb-3">
                                    <h1 className='text-primary text-20 font-medium'>Customize Your Report</h1>
                                </div>
                                <div className=" mt-2 flex flex-col gap-2">
                                    <p className='text-primary text-16 font-regular'>Lorem ipsum dolor sit amet consectetur. Blandit massa consectetur sem consequat pellentesque cursus cursus in. Lacus arcu.</p>
                                </div>
                                <div className=" bg-brand h-10 mt-5 w-full">
                                    <button className=' h-full w-full text-15 font-medium text-primary cursor-pointer hover:bg-[var(--color-brand-primary-hover)]' onClick={() => setPopupOpen(true)}>Customize Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Relevant Reports */}
                    {/* <RelevantReports /> */}
                </div>
                <ContactForm popupOpen={popupOpen} setPopupOpen={setPopupOpen} title={title} />
            </div>
            <Footer />
        </>
    );
};
export default ReportName;

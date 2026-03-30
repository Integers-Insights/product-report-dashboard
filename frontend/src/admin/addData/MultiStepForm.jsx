import { useEffect, useState } from "react";
import FormStep1 from "./steps/FormStep1";
import FormStep2 from "./steps/FormStep2";
import FormStep3 from "./steps/FormStep3";
import FormStep4 from "./steps/FormStep4";
import FormStep5 from "./steps/FormStep5";
import ReviewStep from "./steps/ReviewStep";
import StepIndicator from "./steps/StepIndicator";
import FormStep6 from "./steps/FormStep6";
import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../URL";
import toast from 'react-hot-toast';
import DashNav from "../DashNav";

// const formSteps = 6;
// const totalSteps = 7;

const MultiStepForm = () => {

    const [formStep, setFormStep] = useState(1);
    const [error, setError] = useState(false);
    const [periodError, setPeriodError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftId, setDraftId] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [reportDirectory, setReportDirectory] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState("");
    const [versionNum, setVersionNum] = useState();
    const [versionID, setversionID] = useState("");

    // formstep1 state
    const [reportTitle, setReportTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [industry, setIndustry] = useState("");
    const [subIndustry, setSubIndustry] = useState("");
    const [regions, setRegions] = useState([]);
    const [country, setCountry] = useState([]);
    const [reportType, setReportType] = useState("");
    const [useCases, setUseCases] = useState("");
    const [publishDate, setPublishDate] = useState("");
    const [coveragePeriodFrom, setCoveragePeriodFrom] = useState("");
    const [coveragePeriodTo, setCoveragePeriodTo] = useState("");

    // formstep2 state
    const [reportCovers, setReportCovers] = useState([]);
    const [reportSupports, setReportSupports] = useState([]);

    // formstep3 state
    const [availableReports, setAvailableReports] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [samplePDF, setSamplePDF] = useState(null);
    const [image, setImage] = useState(null);
    const [charts, setCharts] = useState(null);

    // formstep4 state
    const [sectionName, setSectionName] = useState("");
    const [sectionGroup, setSectionGroup] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [previewAvailable, setPreviewAvailable] = useState(null);
    const [sDescription, setSDescription] = useState("");
    const [fullReport, setFullReport] = useState(null);
    const [sectionPDF, setSectionPDF] = useState(null);

    // formstep5 state
    const [reportPrice, setReportPrice] = useState("");

    // formstep6 state
    const [status, setStatus] = useState("");
    const [fHomepage, setFHomepage] = useState(null);
    const [seoSlug, setSeoSlug] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [seoDescription, setSeoDescription] = useState("");

    // for get form data
    const [getIndustry, setGetIndustry] = useState([]);
    const [getSubindustry, setGetSubindustry] = useState([]);
    const [getRegions, setGetRegions] = useState([]);
    const [getCountries, setGetCountries] = useState([]);
    const [getReportTypes, setGetReportTypes] = useState([]);
    const [getuseCases, setGetUseCases] = useState([]);
    const [getAvailableReport, setGetAvailableReport] = useState([]);

    let param = useParams();
    let index = param.id;

    const navigate = useNavigate();

    const handleRadioChange = async (e) => {
        const value = e.target.value;
        setSelectedOption(value);

        if (value === "generated") {
            try {
                const res = await fetch(`${base_url}/reports/generating`, {
                    method: "GET",
                    credentials: "include"
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (data) {
                    setReportDirectory(data?.reports);
                }
            } catch (error) {
                console.error("API Error:", error);
                toast.error("Failed to load reports directory");
                setError(true);
            }
        }
    };

    const getselectedReportIdData = async () => {
        if (!selectedReportId) return;
        try {
            const res = await fetch(`${base_url}/reports/generating/${selectedReportId}`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const rData = await res.json();

            if (rData) {
                setVersionNum(rData?.version_number);
                setversionID(rData?.version_id || "");
                setReportTitle(rData?.title || "");
                setSubTitle(rData?.description || "");
            }
        } catch (err) {
            console.error("Report API Error:", err);
            toast.error("Failed to load report data");
            setError(true);
        }
    };

    // const saveStepData = async ({ step, payload }) => {
    //     try {
    //         // const hasExistingId = draftId || index;
    //         const hasExistingId = Boolean(draftId || index);

    //         const url = hasExistingId
    //             ? `${base_url}/reports/${draftId || index}/step${step}`
    //             : `${base_url}/reports/step${step}/save-draft`;
    //         const method = hasExistingId ? "PUT" : "POST";

    //         const res = await fetch(url, {
    //             method,
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(payload),
    //             credentials: "include"
    //         });

    //         if (!res.ok) {
    //             const errorData = await res.json();
    //             toast.error(errorData?.detail);
    //             return { success: false };
    //         }

    //         const data = await res.json();

    //         if (!hasExistingId && data?.report_id) {
    //             setDraftId(data.report_id);
    //         }
    //         return { success: true, data };

    //     } catch (err) {
    //         console.error("Save Step Error:", err);
    //         toast.error(`Failed to save step ${step}`);
    //         return { success: false };
    //     }
    // };


    const saveStepData = async ({ step, payload }) => {
        try {

            const reportId = draftId ?? index;
            const hasExistingId = Boolean(reportId);
            const url = hasExistingId
                ? `${base_url}/reports/${reportId}/step${step}`
                : `${base_url}/reports/step${step}/save-draft`;

            const method = hasExistingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData?.detail);
                return { success: false };
            }

            const data = await res.json();

            if (!hasExistingId && data?.report_id) {
                setDraftId(data.report_id);
            }

            return { success: true, data };

        } catch (err) {
            console.error("Save Step Error:", err);
            toast.error(`Failed to save step ${step}`);
            return { success: false };
        }
    };


    const handleNext = async () => {
        try {
            setIsSubmitting(true);
            if (formStep === 1) {
                if (!reportTitle || !subTitle || !industry || !subIndustry || regions.length === 0 || country.length === 0 || !reportType || !useCases || !publishDate || !coveragePeriodFrom || !coveragePeriodTo) {
                    setError(true);
                    return;
                }
                setError(false);

                if (Number(coveragePeriodFrom) >= Number(coveragePeriodTo)) {
                    setPeriodError("Coverage Period From must be smaller than Coverage Period To");
                    return;
                }
                setPeriodError("");

                const payload = {
                    title: reportTitle,
                    subtitle: subTitle,
                    industry_id: industry,
                    sub_industry_id: subIndustry,
                    region_id: regions,
                    country_id: country,
                    report_type_id: reportType,
                    use_case_id: useCases,
                    version_id: versionID,
                    coverage_start_year: Number(coveragePeriodFrom),
                    coverage_end_year: Number(coveragePeriodTo),
                    publish_date: publishDate
                };

                // await saveStepData({ step: 1, payload });

                const result = await saveStepData({ step: 1, payload });

                if (!result?.success) {
                    return;
                }

            }

            if (formStep === 2) {
                if (reportCovers.length === 0 || reportSupports.length === 0) {
                    setError(true);
                    return;
                }
                setError(false);

                const payload = {
                    covers: reportCovers,
                    supports_decisions: reportSupports
                };

                // await saveStepData({ step: 2, payload });

                const result = await saveStepData({ step: 2, payload });

                if (!result?.success) {
                    return;
                }

            }

            if (formStep === 3) {
                const isEditMode = Boolean(index);
                if (
                    isEditMode &&
                    !uploadedFile &&
                    !samplePDF &&
                    !charts &&
                    !image
                ) {
                    setError(false);
                    setFormStep(formStep + 1);
                    return;
                }
                if (!isEditMode) {
                    if (!availableReports && !uploadedFile) {
                        setError(true);
                        return;
                    }
                    if (!samplePDF) {
                        setError(true);
                        return;
                    }
                    if (!image) {
                        setError(true);
                        return;
                    }
                }
                if (uploadedFile && uploadedFile.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (samplePDF && samplePDF.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (charts && charts.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (image && image.type !== "image/webp") {
                    setError(true);
                    return;
                }

                setError(false);

                const formData = new FormData();
                if (availableReports) formData.append("full_asset_id", availableReports);
                if (uploadedFile) formData.append("full_pdf", uploadedFile);
                if (samplePDF) formData.append("sample_pdf", samplePDF);
                if (charts) formData.append("charts_pdf", charts);
                if (image) formData.append("image_file", image);

                try {
                    // const hasExistingId = draftId || index;
                    // const hasExistingId = Boolean(draftId || index);

                    const reportId = draftId ?? index;
                    const hasExistingId = Boolean(reportId);

                    const res = await fetch(
                        hasExistingId
                            ? `${base_url}/reports/${reportId}/step3`
                            : `${base_url}/reports/step3/save-draft`,
                        {
                            method: hasExistingId ? "PUT" : "POST",
                            body: formData,
                            credentials: "include"
                        }
                    );

                    // if (!res.ok) {
                    //     toast.error("Failed to upload files");
                    //     console.log("Upload failed");
                    //     return;
                    // }

                    if (!res.ok) {
                        const errorData = await res.json();
                        toast.error(errorData?.detail || "Failed to upload files");
                        return;
                    }

                    const data = await res.json();

                    toast.success("Files uploaded successfully");
                } catch (err) {
                    setError(true);
                    toast.error("Failed to upload files");
                    return;
                }
            }

            if (formStep === 4) {
                // No validation needed for step 4
            }

            if (formStep === 5) {
                // if (!reportPrice || isNaN(reportPrice) || Number(reportPrice) <= 0) {
                //     setError(true);
                //     return;
                // }
                // setError(false);

                const payload = {
                    amount_cents: Number(reportPrice),
                    download_allowed: true,
                    online_viewing_allowed: true
                };

                // await saveStepData({ step: 4, payload });

                const result = await saveStepData({ step: 4, payload });

                if (!result?.success) {
                    return;
                }

            }

            if (formStep === 6) {
                if (!seoSlug.trim() || !seoTitle.trim() || !seoKeywords.trim() || !seoDescription.trim() || fHomepage === null) {
                    setError(true);
                    return;
                }
                setError(false);

                const payload = {
                    status,
                    seo_slug: seoSlug,
                    seo_title: seoTitle,
                    seo_keywords: seoKeywords,
                    seo_description: seoDescription,
                    feature_homepage: fHomepage
                };

                // await saveStepData({ step: 5, payload });

                const result = await saveStepData({ step: 5, payload });

                if (!result?.success) {
                    return;
                }


                toast.success("Report published successfully!");
                navigate('/all');
                return;
            }

            if (formStep < 6) {
                setFormStep(formStep + 1);
            }
        } catch (err) {
            console.error("Handle Next Error:", err);
            setError(true);
            toast.error("Error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setIsSubmitting(true);

            if (formStep === 1) {
                const payload = {
                    title: reportTitle || "",
                    subtitle: subTitle || "",
                    industry_id: industry || "",
                    sub_industry_id: subIndustry || "",
                    region_id: regions || [],
                    country_id: country || [],
                    report_type_id: reportType || "",
                    use_case_id: useCases || "",
                    version_id: versionID || "",
                    coverage_start_year: Number(coveragePeriodFrom) || 0,
                    coverage_end_year: Number(coveragePeriodTo) || 0,
                    publish_date: publishDate || ""
                };
                // await saveStepData({ step: 1, payload });

                const result = await saveStepData({ step: 1, payload });
                if (!result?.success) return;

            } else if (formStep === 2) {
                const payload = {
                    covers: reportCovers || [],
                    supports_decisions: reportSupports || []
                };
                // await saveStepData({ step: 2, payload });

                const result = await saveStepData({ step: 2, payload });
                if (!result?.success) return;

            } else if (formStep === 3) {
                const formData = new FormData();
                if (availableReports) formData.append("full_asset_id", availableReports);
                if (uploadedFile) formData.append("full_pdf", uploadedFile);
                if (samplePDF) formData.append("sample_pdf", samplePDF);
                if (charts) formData.append("charts_pdf", charts);
                if (image) formData.append("image_file", image);

                // const hasExistingId = draftId || index;
                // const hasExistingId = Boolean(draftId || index);

                const reportId = draftId ?? index;
                const hasExistingId = Boolean(reportId);


                const res = await fetch(
                    hasExistingId
                        ? `${base_url}/reports/${reportId}/step3`
                        : `${base_url}/reports/step3/save-draft`,
                    {
                        method: hasExistingId ? "PUT" : "POST",
                        body: formData,
                        credentials: "include"
                    }
                );

                if (!res.ok) {
                    toast.error("Failed to save draft");
                    return;
                }

                const data = await res.json();
                // toast.success("Draft saved successfully!");

            } else if (formStep === 5) {
                const payload = {
                    amount_cents: Number(reportPrice) || 0,
                    download_allowed: true,
                    online_viewing_allowed: true
                };
                // await saveStepData({ step: 4, payload });

                const result = await saveStepData({ step: 4, payload });
                if (!result?.success) return;
            } else if (formStep === 6) {
                const payload = {
                    status: status || "",
                    seo_slug: seoSlug || "",
                    seo_title: seoTitle || "",
                    seo_keywords: seoKeywords || "",
                    seo_description: seoDescription || "",
                    feature_homepage: fHomepage || false
                };
                // await saveStepData({ step: 5, payload });

                const result = await saveStepData({ step: 5, payload });
                if (!result?.success) return;
            }
            toast.success("Draft saved successfully!");
        } catch (err) {
            console.error("Save Draft Error:", err);
            setError(true);
            toast.error("Failed to save draft. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrev = () => {
        if (formStep === 7) {
            setFormStep(6);
        } else if (formStep > 1) {
            setFormStep(formStep - 1);
        }
    };

    const getIndustryData = async () => {
        try {
            let result = await fetch(`${base_url}/industries/main`);

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();
            if (data) {
                setGetIndustry(data?.industries || []);
            }
        } catch (err) {
            console.error("Error fetching industries:", err);
            toast.error("Failed to load industries");
        }
    };

    const getSubIndustryData = async () => {
        if (!industry) return;
        try {
            const url = `${base_url}/industries/sub?industry=${encodeURIComponent(industry)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data) {
                setGetSubindustry(data?.sub_industries || []);
            }
        } catch (err) {
            console.log("Error fetching sub-industries:", err);
            toast.error("Failed to load sub-industries");
        }
    };

    const getRegionsData = async () => {
        try {
            let result = await fetch(`${base_url}/regions`);

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();
            if (data) {
                setGetRegions(data?.regions || []);
            }
        } catch (err) {
            console.log("Error fetching regions:", err);
            toast.error("Failed to load regions");
        }
    };

    const getReportData = async () => {
        try {
            let result = await fetch(`${base_url}/report-types`);

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();
            if (data) {
                setGetReportTypes(data?.report_types || []);
                setGetUseCases(data?.use_cases || []);
            }
        } catch (err) {
            console.log("Error fetching report types:", err);
            toast.error("Failed to load report types");
        }
    };

    const getCountriesByRegion = async () => {
        try {
            if (!regions || regions.length === 0) {
                setGetCountries([]);
                return;
            }

            const regionParam = regions.join(",");
            const url = `${base_url}/countries?region=${encodeURIComponent(regionParam)}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data) {
                setGetCountries(data?.countries || []);
            }
        } catch (err) {
            console.error("Country API Error:", err);
            toast.error("Failed to load countries");
        }
    };

    const getAvailableReportsData = async () => {
        try {
            const res = await fetch(`${base_url}/report-assets/?report_version_id=${versionID}`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const fData = await res.json();

            if (fData) {
                setGetAvailableReport(fData || []);
            }
        } catch (err) {
            console.log("Available Reports API Error:", err);
            toast.error("Failed to load available reports");
        }
    };

    useEffect(() => {
        getIndustryData();
        getRegionsData();
        getReportData();

    }, []);

    useEffect(() => {
        if (versionID) {
            getAvailableReportsData();
        }
    }, [versionID]);

    useEffect(() => {
        if (industry) {
            getSubIndustryData();
        }
    }, [industry]);

    useEffect(() => {
        if (regions.length > 0) {
            getCountriesByRegion();
        } else {
            setGetCountries([]);
            setCountry([]);
        }
    }, [regions]);

    useEffect(() => {
        if (selectedReportId) {
            getselectedReportIdData();
        }
    }, [selectedReportId]);

    // for edit
    const getReportDataForEdit = async () => {
        try {
            let result = await fetch(`${base_url}/reports/${index}/edit`, {
                method: "GET",
                credentials: "include"
            });

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            let data = await result.json();

            if (data?.report_id) {
                setDraftId(data.report_id);
            }

            if (data?.step_data?.step1) {
                let stp1 = data?.step_data?.step1;
                setversionID(stp1?.version_id);
                setReportTitle(stp1?.title || "");
                setSubTitle(stp1?.subtitle || "");
                setIndustry(stp1?.industry_name || "");
                setSubIndustry(stp1?.sub_industry_name || "");
                setRegions(stp1?.region_names || []);
                setCountry(stp1?.country_names || []);
                setReportType(stp1?.report_type_name || "");
                setUseCases(stp1?.use_case_name || "");
                setPublishDate(stp1?.publish_date || "");
                setCoveragePeriodFrom(stp1?.coverage_start_year || "");
                setCoveragePeriodTo(stp1?.coverage_end_year || "");
            }
            if (data?.step_data?.step2) {
                let stp2 = data?.step_data?.step2;
                setReportCovers(Array.isArray(stp2?.covers) ? stp2.covers : []);
                setReportSupports(Array.isArray(stp2?.supports_decisions) ? stp2.supports_decisions : []);
            }

            if (data?.step_data?.step3) {
                let stp3 = data?.step_data?.step3;
                setAvailableReports(stp3?.full_asset_id || "");
                // setUploadedFile(stp3?.full_pdf_url || null);
                // setSamplePDF(stp3?.sample_pdf_url || null);
                // setImage(stp3?.image_url || null);
                // setCharts(stp3?.charts_pdf_url || null);
            }

            if (data?.step_data?.step4) {
                let stp4 = data?.step_data?.step4;
                setReportPrice(stp4?.amount_cents || "");
            }
            if (data?.step_data?.step5) {
                let stp5 = data?.step_data?.step5;
                setStatus(stp5?.status || "");
                setFHomepage(stp5?.feature_homepage || false);
                setSeoSlug(stp5?.seo_slug || "");
                setSeoTitle(stp5?.seo_title || "");
                setSeoKeywords(stp5?.seo_keywords || "");
                setSeoDescription(stp5?.seo_description || "");
            }
        }
        catch (err) {
            console.log("Something went wrong...");
            toast.error("Failed to load report data for editing");
        }
    }

    useEffect(() => {
        if (index) {
            getReportDataForEdit();
        }
    }, [index]);

    return (
        <div className="bg-gray-100">
            <DashNav />
            <>
                <div className="hidden lg:block">
                    <StepIndicator step={formStep} setStep={setFormStep} />
                </div>
                <div className="border border-gray-200 rounded w-80 sm:w-160 md:w-190 lg:w-230 m-auto p-2 bg-surface">
                    {formStep === 1 && (
                        <FormStep1
                            selectedOption={selectedOption}
                            handleRadioChange={handleRadioChange}
                            reportDirectory={reportDirectory}
                            selectedReportId={selectedReportId}
                            setSelectedReportId={setSelectedReportId}
                            versionNum={versionNum}
                            reportTitle={reportTitle}
                            setReportTitle={setReportTitle}
                            subTitle={subTitle}
                            setSubTitle={setSubTitle}
                            industry={industry}
                            setIndustry={setIndustry}
                            subIndustry={subIndustry}
                            setSubIndustry={setSubIndustry}
                            regions={regions}
                            setRegions={setRegions}
                            country={country}
                            setCountry={setCountry}
                            reportType={reportType}
                            setReportType={setReportType}
                            useCases={useCases}
                            setUseCases={setUseCases}
                            publishDate={publishDate}
                            setPublishDate={setPublishDate}
                            coveragePeriodFrom={coveragePeriodFrom}
                            setCoveragePeriodFrom={setCoveragePeriodFrom}
                            coveragePeriodTo={coveragePeriodTo}
                            setCoveragePeriodTo={setCoveragePeriodTo}
                            error={error}
                            getIndustry={getIndustry}
                            getSubindustry={getSubindustry}
                            getRegions={getRegions}
                            getCountries={getCountries}
                            getReportTypes={getReportTypes}
                            getuseCases={getuseCases}
                            periodError={periodError}
                        />
                    )}
                    {formStep === 2 && (
                        <FormStep2
                            reportCovers={reportCovers}
                            setReportCovers={setReportCovers}
                            reportSupports={reportSupports}
                            setReportSupports={setReportSupports}
                            error={error}
                            draftId={draftId}
                        />
                    )}
                    {formStep === 3 && (
                        <FormStep3
                            availableReports={availableReports}
                            setAvailableReports={setAvailableReports}
                            uploadedFile={uploadedFile}
                            setUploadedFile={setUploadedFile}
                            samplePDF={samplePDF}
                            setSamplePDF={setSamplePDF}
                            image={image}
                            setImage={setImage}
                            charts={charts}
                            setCharts={setCharts}
                            getAvailableReport={getAvailableReport}
                            error={error}
                        />
                    )}
                    {formStep === 4 && (
                        <FormStep4
                            sectionName={sectionName}
                            setSectionName={setSectionName}
                            sectionGroup={sectionGroup}
                            setSectionGroup={setSectionGroup}
                            shortDescription={shortDescription}
                            setShortDescription={setShortDescription}
                            previewAvailable={previewAvailable}
                            setPreviewAvailable={setPreviewAvailable}
                            sDescription={sDescription}
                            setSDescription={setSDescription}
                            fullReport={fullReport}
                            setFullReport={setFullReport}
                            sectionPDF={sectionPDF}
                            setSectionPDF={setSectionPDF}
                            error={error}
                        />
                    )}
                    {formStep === 5 && (
                        <FormStep5
                            reportPrice={reportPrice}
                            setReportPrice={setReportPrice}
                            error={error}
                        />
                    )}
                    {formStep === 6 && (
                        <FormStep6
                            status={status}
                            setStatus={setStatus}
                            fHomepage={fHomepage}
                            setFHomepage={setFHomepage}
                            seoSlug={seoSlug}
                            setSeoSlug={setSeoSlug}
                            seoTitle={seoTitle}
                            setSeoTitle={setSeoTitle}
                            seoKeywords={seoKeywords}
                            setSeoKeywords={setSeoKeywords}
                            seoDescription={seoDescription}
                            setSeoDescription={setSeoDescription}
                            error={error}
                        />
                    )}
                    {formStep === 7 && (
                        <ReviewStep
                            draftId={draftId}
                            reportTitle={reportTitle}
                            subTitle={subTitle}
                            industry={industry}
                            subIndustry={subIndustry}
                            regions={regions}
                            country={country}
                            reportType={reportType}
                            useCases={useCases}
                            publishDate={publishDate}
                            coveragePeriodFrom={coveragePeriodFrom}
                            coveragePeriodTo={coveragePeriodTo}
                            reportCovers={reportCovers}
                            reportSupports={reportSupports}
                            availableReports={availableReports}
                            uploadedFile={uploadedFile}
                            samplePDF={samplePDF}
                            image={image}
                            charts={charts}
                            sectionName={sectionName}
                            sectionGroup={sectionGroup}
                            shortDescription={shortDescription}
                            previewAvailable={previewAvailable}
                            sDescription={sDescription}
                            fullReport={fullReport}
                            sectionPDF={sectionPDF}
                            reportPrice={reportPrice}
                            status={status}
                            fHomepage={fHomepage}
                            seoSlug={seoSlug}
                            seoTitle={seoTitle}
                            seoKeywords={seoKeywords}
                            seoDescription={seoDescription}
                        />
                    )}
                </div>

                <div className="relative h-14 rounded w-230 m-auto my-4">
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                        {formStep >= 2 && formStep < 7 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handlePrev}
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                        )}
                        {formStep <= 6 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSaveDraft}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Draft"}
                            </button>
                        )}
                        {formStep <= 5 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleNext}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Next"}
                            </button>
                        )}
                        {formStep === 6 && (
                            <>
                                <button
                                    className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setFormStep(7)}
                                    disabled={isSubmitting}
                                >
                                    Review
                                </button>
                                <button
                                    className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Publishing..." : "Publish Report"}
                                </button>
                            </>
                        )}

                        {formStep === 7 && (
                            <button
                                className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setFormStep(6)}
                                disabled={isSubmitting}
                            >
                                Back to Edit
                            </button>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
};

export default MultiStepForm;

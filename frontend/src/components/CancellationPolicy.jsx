import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const CancellationPolicy = () => {
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
                        <span className="font-medium underline">Refund & Cancellation Policy</span>
                    </div>

                    <h1 className="text-primary text-32 font-semibold">Refund & Cancellation Policy</h1>

                    <p className="text-16 text-primary mt-4"><span className="font-medium">Company Name:</span> <span className="font-regular"> Integers Insights Private Limited</span></p>
                    <p className="text-16 text-primary"><span className="font-medium">Last Updated:</span> <span className="font-regular">20 February, 2026</span></p>

                    <h1 className="text-24 text-primary font-semibold mt-4">1. Overview</h1>
                    <p className="text-16 text-primary font-regular">At <span className="font-medium">Integers Insights Private Limited</span> , we specialize in providing digital research reports and downloadable content. Given the nature of our digital products, our refund and cancellation policy aligns with the relevant Indian laws, including the Information Technology Act, 2000, and applicable consumer protection regulations.</p>
                    <p className="text-16 text-primary font-regular">By purchasing our reports, you’re agreeing to the terms laid out below.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">2. Cancellation Policy</h1>
                    <h2 className="text-20 text-primary font-medium">a&#41; Before Access is Granted </h2>
                    <p className="text-16 text-primary font-regular">You can cancel your order only before:</p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Payment confirmation is completed, or</li>
                        <li>Download/access credentials are sent out.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular">If you need to cancel an order before you gain access, please let us know right away at:</p>

                    <p className="text-16 text-primary font-regular"><span className="font-medium">Email: </span><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>
                    <p className="text-16 text-primary font-regular">Once you’ve been granted access to the digital report, cancellations are no longer allowed.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">3. Refund Policy</h1>
                    <p className="text-16 text-primary font-regular">Because digital products are intangible and cannot be returned:</p>
                    <h2 className="text-20 text-primary font-medium mt-4">a&#41; No Refund After Access</h2>
                    <p className="text-16 text-primary font-regular">Once the report has been delivered, downloaded, or access credentials have been provided, the purchase is final and non-refundable.</p>


                    <h2 className="text-20 text-primary font-medium mt-4">b&#41; Eligible Refund Scenarios </h2>
                    <p className="text-16 text-primary font-regular">Refunds may be considered only in these situations:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Duplicate payment for the same report </li>
                        <li>A technical error that prevents the report from being delivered</li>
                        <li>Payment has been deducted, but access to the report hasn’t been granted</li>
                    </ul>
                    <p className="text-16 text-primary font-regular">Please submit any refund requests within 7 days of the transaction date.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">4. Refund Processing Timeline </h1>
                    <p className="text-16 text-primary font-regular">Once a refund request gets the green light:</p>

                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Refunds will be sent back to the original payment method. </li>
                        <li>It might take about 7 to 10 business days for the processing, depending on your payment provider and banking timelines.</li>
                        <li>Keep in mind that any transaction fees from payment gateways or banks could be deducted if applicable. </li>
                    </ul>

                    <h1 className="text-24 text-primary font-semibold mt-4">5. Dispute Resolution</h1>
                    <p className="text-16 text-primary font-regular">If you find yourself facing a billing dispute: </p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>We encourage users to reach out to us directly before considering chargebacks.</li>
                        <li>We’ll take a look and get back to you within a reasonable timeframe.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular">Please note that unwarranted chargebacks after accessing the report may lead to a suspension of future purchases. </p>

                    <h1 className="text-24 text-primary font-semibold mt-4">6. Exceptions </h1>
                    <p className="text-16 text-primary font-regular">Refunds won’t be issued for:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Changing your mind after making a purchase.</li>
                        <li>Feeling dissatisfied due to personal expectations.</li>
                        <li>Not being able to use the report because of technical issues on your end.</li>
                        <li>Not being familiar with the report content after a sample preview was provided. </li>
                    </ul>
                    <p className="text-16 text-primary font-regular">We offer overview sections and sample previews to help users make informed decisions before buying.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">7. Compliance with Indian Law  </h1>
                    <p className="text-16 text-primary font-regular">This policy is governed by the laws of India. Any disputes will fall under the jurisdiction of the courts located in Mumbai, Maharashtra.</p>



                    <h1 className="text-24 text-primary font-semibold mt-4">8. Contact Information </h1>
                    <p className="text-16 text-primary font-regular">For refund or cancellation request:</p>
                    <p className="text-16 text-primary font-regular mt-4"><span className="font-medium">Email: </span><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Company Name: </span>Integers Insights Private Limited </p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Address: </span>Unit No. 21, 2nd Floor, Vicino (Mega Mall), New Link Rd, Oshiwara, Andheri West, Mumbai, Maharashtra 400102</p>

                </div>
            </div>
            <Footer />
        </>
    );
};
export default CancellationPolicy;
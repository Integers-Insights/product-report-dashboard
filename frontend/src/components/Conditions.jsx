import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Conditions = () => {
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
                        <span className="font-medium underline">Terms & Conditions</span>
                    </div>

                    <h1 className="text-primary text-32 font-semibold">Terms & Conditions</h1>
                    <p className="text-16 text-primary mt-4"><span className="font-medium">Last Updated:</span> <span className="font-regular">20 February, 2026</span></p>
                    <h1 className="text-24 text-primary font-semibold mt-4">1. Acceptance of Terms</h1>
                    <p className="text-16 text-primary font-regular">When you access or use our website and buy our reports, you’re agreeing to these Terms & Conditions. If you don’t agree, please don’t use our platform.  These Terms apply to everyone—users, visitors, and customers alike.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">2. Use of the Website</h1>
                    <p className="text-16 text-primary font-regular">You agree to use the website only for legal purposes. You must not:  </p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Misuse the website or try to access it without authorization</li>
                        <li>Copy, reproduce, or share report content without permission</li>
                        <li>Use automated tools to scrape data (like bots, etc.)</li>
                        <li>Interfere with the website’s security or functionality </li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4 ml-2">We reserve the right to suspend or terminate access if these rules are violated.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">3. Intellectual Property Rights</h1>
                    <p className="text-16 text-primary font-regular">All reports, content, designs, data compilations, graphics, and materials on this website are the intellectual property of <span className="font-medium">Integers Insights Private Limited</span>, unless stated otherwise. </p>
                    <p className="text-16 text-primary font-regular">When you purchase a report, you get a limited, non-exclusive, non-transferable license to use it for your internal business needs only.</p>

                    <p className="text-16 text-primary font-regular mt-4">You may NOT:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Resell or redistribute the report</li>
                        <li>Publish any part of the report publicly</li>
                        <li>Share the full report outside your organization </li>
                        <li>Modify it and present it as your own research </li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Unauthorized use could lead to legal action.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">4. Report Content & Disclaimer</h1>
                    <p className="text-16 text-primary font-regular">Our reports are created using publicly available sources, structured analysis, and research methods.</p>
                    <p className="text-16 text-primary font-regular mt-4">While we aim for accuracy:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>We can’t guarantee completeness or absolute accuracy</li>
                        <li>Forecasts are just projections based on the data we have</li>
                        <li>Market conditions can change over time</li>
                        <li>We aren’t responsible for any business decisions made based on our reports.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Reports are meant for informational and analytical purposes only.</p>




                    <h1 className="text-24 text-primary font-semibold mt-4">5. Pricing & Payments</h1>
                    <p className="text-16 text-primary font-regular">You can find all our prices listed on the website, and we may update them whenever we see fit.</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Before you can access your report, we need to receive your payment.</li>
                        <li>We process payments through secure third-party gateways to keep your information safe.</li>
                        <li>If required by law, applicable taxes may be added to your total.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Rest assured, we do not store your full payment card details.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">6. Refund Policy</h1>
                    <p className="text-16 text-primary font-regular">Given the digital nature of our products:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Generally, all report purchases are non-refundable.</li>
                        <li>We may consider refunds only in cases of duplicate payments or if there’s a technical issue preventing access.</li>
                        <li>If you need a refund, please submit your request within 15 days of your purchase.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">We reserve the right to review refund claims on a case-by-case basis. </p>


                    <h1 className="text-24 text-primary font-semibold mt-4">7. Limitation of Liability</h1>
                    <p className="text-16 text-primary font-regular">To the fullest extent allowed by law:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>We won’t be liable for any indirect, incidental, or consequential damages.</li>
                        <li>Our total liability is limited to the amount you paid for the report.</li>
                        <li>We’re not responsible for any loss of profits, business interruptions, or data loss.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">Using our website and reports is at your own risk.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">8. User Accounts (If Applicable)</h1>
                    <p className="text-16 text-primary font-regular">If you decide to create an account:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>You’re responsible for keeping your login credentials confidential.</li>
                        <li>You’re accountable for all activities that happen under your account.</li>
                        <li>If you notice any unauthorized access, please let us know right away.</li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">We reserve the right to suspend accounts if they’re misused.</p>



                    <h1 className="text-24 text-primary font-semibold mt-4">9. Third-Party Links</h1>
                    <p className="text-16 text-primary font-regular">Our website may include links to third-party sites. We aren’t responsible for their content, policies, or practices.</p>

                    <h1 className="text-24 text-primary font-semibold mt-4">10. Modifications to Services</h1>
                    <p className="text-16 text-primary font-regular">We reserve the right to:</p>
                    <ul className="text-16 text-primary font-regular list-disc ml-10">
                        <li>Change or discontinue services</li>
                        <li>Update report formats</li>
                        <li>Adjust pricing</li>
                        <li>Limit access </li>
                    </ul>
                    <p className="text-16 text-primary font-regular mt-4">without prior notice. </p>


                    <h1 className="text-24 text-primary font-semibold mt-4">11. Governing Law</h1>
                    <p className="text-16 text-primary font-regular">These Terms & Conditions will be governed by and interpreted according to the laws of Maharashtra, India.
                        Any disputes will fall under the exclusive jurisdiction of the courts located in Courts in Mumbai, Maharashtra.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">12. Force Majeure </h1>
                    <p className="text-16 text-primary font-regular">We won’t be held responsible for any delays or failures in our performance caused by events that are beyond our control. This includes, but isn’t limited to, natural disasters, internet outages, government actions, or technical issues.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">13. Changes to Terms</h1>
                    <p className="text-16 text-primary font-regular">We might update these Terms & Conditions every now and then. If you keep using the website after we make changes, it means you accept the new Terms.</p>


                    <h1 className="text-24 text-primary font-semibold mt-4">14. Contact Information</h1>
                    <p className="text-16 text-primary font-regular">If you have any questions about this terms & conditions, feel free to reach out to us at:</p>

                    <p className="text-16 text-primary font-regular mt-4"><span className="font-medium">Email: </span><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Company Name: </span>Integers Insights Private Limited </p>
                    <p className="text-16 text-primary font-regular"><span className="font-medium">Address: </span>Unit No. 21, 2nd Floor, Vicino (Mega Mall), New Link Rd, Oshiwara, Andheri West, Mumbai, Maharashtra 400102</p>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default Conditions;
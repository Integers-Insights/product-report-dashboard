import { Link } from "react-router-dom";
// import Breadcrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const PrivacyPolicy = () => {
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
                    <span className="font-medium underline">Privacy Policy</span>
                </div>

                <h1 className="text-primary text-32 font-semibold">Privacy Policy</h1>
                <p className="text-16 text-primary mt-4"><span className="font-medium">Last Updated:</span> <span className="font-regular">20 February, 2026</span></p>
                <h1 className="text-24 text-primary font-semibold mt-4">1. Introduction</h1>
                <p className="text-16 text-primary font-regular">We truly care about your privacy and are dedicated to safeguarding your personal information. This Privacy Policy outlines how we gather, utilize, share, and protect your information when you visit our website, access our reports, or make use of our services. </p>
                <p className="text-16 text-primary font-regular mt-4">By engaging with our platform, you’re agreeing to the practices laid out in this policy.</p>

                <h1 className="text-24 text-primary font-semibold mt-4">2. Information We Collect</h1>
                <p className="text-16 text-primary font-regular">We might collect the following types of information:</p>
                <p className="text-16 text-primary font-regular mt-4 ml-2">a&#41; Personal Information</p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Your name </li>
                    <li>Email address </li>
                    <li>Company name </li>
                    <li>Billing information </li>
                    <li>Payment details (handled through third-party payment providers) </li>
                </ul>
                <p className="text-16 text-primary font-regular mt-4 ml-2">b&#41; Non-Personal Information</p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Type and version of your browser </li>
                    <li>Device details </li>
                    <li>IP address </li>
                    <li>Pages you visit </li>
                    <li>Time spent on our website </li>
                    <li>Source of referral  </li>
                </ul>

                <p className="text-16 text-primary font-regular mt-4 ml-2">c&#41; Communication Data</p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Emails or messages you send our way </li>
                    <li>Interactions with customer support</li>
                </ul>

                <h1 className="text-24 text-primary font-semibold mt-4">3. How We Use Your Information </h1>
                <p className="text-16 text-primary font-regular">We collect and use your information for several important reasons:</p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>To give you access to the reports you've purchased </li>
                    <li>To handle your transactions smoothly</li>
                    <li>To send you invoices and confirmations </li>
                    <li>To respond to your questions and support requests </li>
                    <li>To enhance our website's performance and your overall experience </li>
                    <li>To analyze usage trends </li>
                    <li>To prevent fraud and keep our platform secure </li>
                </ul>
                <p className="text-16 text-primary font-regular mt-4">Rest assured, we do not sell your personal data to any third parties.  </p>

                <h1 className="text-24 text-primary font-semibold mt-4">4. Payment Processing</h1>
                <p className="text-16 text-primary font-regular">All payments are processed through secure third-party payment gateways. </p>
                <p className="text-16 text-primary font-regular">We don’t keep your full credit or debit card information on our servers.  </p>

                <h1 className="text-24 text-primary font-semibold mt-4">5. Cookies & Tracking Technologies</h1>
                <p className="text-16 text-primary font-regular">We might use cookies and similar technologies to:  </p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Enhance site functionality </li>
                    <li>Analyze traffic patterns</li>
                    <li>Remember your preferences</li>
                </ul>
                <p className="text-16 text-primary font-regular">You can turn off cookies in your browser settings, but keep in mind that some features of the site may not work properly without them. </p>

                <h1 className="text-24 text-primary font-semibold mt-4">6. Data Sharing & Disclosure</h1>
                <p className="text-16 text-primary font-regular">We may share your information only in specific situations:</p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>With trusted service providers (like hosting, payment processing, and analytics)</li>
                    <li>When required by law or regulatory authorities</li>
                    <li>To protect our legal rights and prevent misuse </li>
                </ul>
                <p className="text-16 text-primary font-regular">All third-party service providers are expected to uphold confidentiality and data protection standards.</p>

                <h1 className="text-24 text-primary font-semibold mt-4">7. Data Security</h1>
                <p className="text-16 text-primary font-regular">We take reasonable technical and organizational measures to safeguard your information from unauthorized access, misuse, or disclosure. However, please note that no online platform can guarantee complete security.</p>


                <h1 className="text-24 text-primary font-semibold mt-4">8. Data Retention</h1>
                <p className="text-16 text-primary font-regular">We keep your personal information only as long as necessary to: </p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Fulfill our contractual obligations</li>
                    <li>Comply with legal requirements</li>
                    <li>Resolve disputes</li>
                    <li>Enforce agreements</li>
                </ul>


                <h1 className="text-24 text-primary font-semibold mt-4">9. Your Rights</h1>
                <p className="text-16 text-primary font-regular">Depending on where you live, you may have the right to: </p>
                <ul className="text-16 text-primary font-regular list-disc ml-10">
                    <li>Access your personal data</li>
                    <li>Request corrections to any inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to or limit certain processing activities</li>
                </ul>
                <p className="text-16 text-primary font-regular mt-4">To exercise these rights, please reach out to us at: <br /><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>

                <h1 className="text-24 text-primary font-semibold mt-4">10. Third-Party Links</h1>
                <p className="text-16 text-primary font-regular">Our website may include links to external sites. We are not responsible for the privacy practices or content of those third-party websites.</p>

                <h1 className="text-24 text-primary font-semibold mt-4">11. Children’s Privacy</h1>
                <p className="text-16 text-primary font-regular">We want to make it clear that our services aren’t aimed at anyone under 18. We don’t intentionally gather personal information from minors. </p>

                <h1 className="text-24 text-primary font-semibold mt-4">12. International Users</h1>
                <p className="text-16 text-primary font-regular">If you’re using our platform from a location outside of our main operating area, please be aware that your information might be transferred and processed according to the relevant laws.</p>

                <h1 className="text-24 text-primary font-semibold mt-4">13. Changes to This Policy</h1>
                <p className="text-16 text-primary font-regular">From time to time, we might update this Privacy Policy. Any changes will be noted with a new “Last Updated” date at the top of this page.</p>

                <h1 className="text-24 text-primary font-semibold mt-4">14. Contact Information</h1>
                <p className="text-16 text-primary font-regular">If you have any questions about this Privacy Policy or how we handle your data, feel free to reach out to us at:  </p>

                <p className="text-16 text-primary font-regular mt-4"><span className="font-medium">Email: </span><a href="mailto:info@integersinsights.com">info@integersinsights.com</a></p>
                <p className="text-16 text-primary font-regular"><span className="font-medium">Company Name: </span>Integers Insights Private Limited </p>
                <p className="text-16 text-primary font-regular"><span className="font-medium">Address: </span>Unit No. 21, 2nd Floor, Vicino (Mega Mall), New Link Rd, Oshiwara, Andheri West, Mumbai, Maharashtra 400102</p>

            </div>
            </div>
            <Footer/>
        </>
    );
};
export default PrivacyPolicy;
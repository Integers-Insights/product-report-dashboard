import image_1 from '../assets/image 1.svg';

const ScopeCoverage = ({ setPopupOpen, reportCovers, reportSupports, setActiveTab }) => {

    return (
        <div>
            <div>
                <h1 className="text-primary text-24 font-semibold">What this report covers</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 mt-4">
                    {reportCovers?.map((item, i) => {
                        return (
                            <div className="flex gap-2" key={i}><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C13.686 2.75 15.2643 3.20078 16.624 3.9873C16.9826 4.19471 17.442 4.07144 17.6494 3.71289C17.8564 3.3545 17.7342 2.89587 17.376 2.68848C15.794 1.77337 13.9568 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 11.2647 22.6762 10.5456 22.5352 9.85059C22.4527 9.44475 22.0563 9.18226 21.6504 9.26465C21.2446 9.34718 20.983 9.74358 21.0654 10.1494C21.1867 10.7467 21.25 11.3656 21.25 12Z" fill="#001413" />
                                <path d="M21.7393 4.29688C22.1276 4.15287 22.5591 4.35095 22.7031 4.73926C22.8471 5.12757 22.649 5.55905 22.2607 5.70312C21.1578 6.11237 19.9682 6.95534 18.7822 8.04492C17.6047 9.12678 16.4728 10.4118 15.4834 11.6543C14.4954 12.8951 13.658 14.0815 13.0674 14.958C12.7725 15.3957 12.5403 15.7556 12.3818 16.0049C12.3026 16.1295 12.2417 16.2266 12.2012 16.292C12.181 16.3245 12.1653 16.3489 12.1553 16.3652C12.1503 16.3734 12.1469 16.3799 12.1445 16.3838C12.1434 16.3857 12.1421 16.3868 12.1416 16.3877C12.0038 16.6149 11.7559 16.7535 11.4902 16.75C11.2246 16.7465 10.9804 16.6027 10.8486 16.3721C9.88686 14.689 9.08043 13.9089 8.57031 13.5518C8.31634 13.374 8.13367 13.2999 8.03809 13.2695C7.98992 13.2542 7.96146 13.249 7.95508 13.248C7.95626 13.2482 7.95871 13.2488 7.96191 13.249C7.96554 13.2493 7.97042 13.2498 7.97656 13.25H7.99805C7.99814 13.25 7.99893 13.25 7.99902 13.249C7.58526 13.2485 7.25 12.9139 7.25 12.5C7.25 12.0858 7.58579 11.75 8 11.75V12.3232C8.00013 11.75 8.00116 11.75 8.00195 11.75H8.01465C8.01998 11.7501 8.02613 11.7508 8.03223 11.751C8.04435 11.7514 8.05818 11.7518 8.07324 11.7529C8.10355 11.7552 8.14008 11.7593 8.18164 11.7656C8.26502 11.7783 8.36974 11.8006 8.49316 11.8398C8.74127 11.9188 9.05878 12.0636 9.42969 12.3232C10.0141 12.7323 10.7251 13.424 11.5098 14.5918C11.6052 14.4469 11.7104 14.2891 11.8242 14.1201C12.4303 13.2206 13.2913 12.0007 14.3105 10.7207C15.3284 9.44247 16.5132 8.09191 17.7676 6.93945C19.0135 5.79483 20.3717 4.80427 21.7393 4.29688Z" fill="#001413" />
                            </svg></span><span>{item}</span></div>
                        )
                    })}
                </div>
            </div>
            <div className=" mt-9">
                <h1 className="text-primary text-24 font-semibold">What decisions this report supports</h1>
                <div className=" grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 mt-4">
                    {reportSupports?.map((itm, i) => {
                        return (
                            <div className=" flex gap-2" key={i}><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C13.686 2.75 15.2643 3.20078 16.624 3.9873C16.9826 4.19471 17.442 4.07144 17.6494 3.71289C17.8564 3.3545 17.7342 2.89587 17.376 2.68848C15.794 1.77337 13.9568 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 11.2647 22.6762 10.5456 22.5352 9.85059C22.4527 9.44475 22.0563 9.18226 21.6504 9.26465C21.2446 9.34718 20.983 9.74358 21.0654 10.1494C21.1867 10.7467 21.25 11.3656 21.25 12Z" fill="#001413" />
                                <path d="M21.7393 4.29688C22.1276 4.15287 22.5591 4.35095 22.7031 4.73926C22.8471 5.12757 22.649 5.55905 22.2607 5.70312C21.1578 6.11237 19.9682 6.95534 18.7822 8.04492C17.6047 9.12678 16.4728 10.4118 15.4834 11.6543C14.4954 12.8951 13.658 14.0815 13.0674 14.958C12.7725 15.3957 12.5403 15.7556 12.3818 16.0049C12.3026 16.1295 12.2417 16.2266 12.2012 16.292C12.181 16.3245 12.1653 16.3489 12.1553 16.3652C12.1503 16.3734 12.1469 16.3799 12.1445 16.3838C12.1434 16.3857 12.1421 16.3868 12.1416 16.3877C12.0038 16.6149 11.7559 16.7535 11.4902 16.75C11.2246 16.7465 10.9804 16.6027 10.8486 16.3721C9.88686 14.689 9.08043 13.9089 8.57031 13.5518C8.31634 13.374 8.13367 13.2999 8.03809 13.2695C7.98992 13.2542 7.96146 13.249 7.95508 13.248C7.95626 13.2482 7.95871 13.2488 7.96191 13.249C7.96554 13.2493 7.97042 13.2498 7.97656 13.25H7.99805C7.99814 13.25 7.99893 13.25 7.99902 13.249C7.58526 13.2485 7.25 12.9139 7.25 12.5C7.25 12.0858 7.58579 11.75 8 11.75V12.3232C8.00013 11.75 8.00116 11.75 8.00195 11.75H8.01465C8.01998 11.7501 8.02613 11.7508 8.03223 11.751C8.04435 11.7514 8.05818 11.7518 8.07324 11.7529C8.10355 11.7552 8.14008 11.7593 8.18164 11.7656C8.26502 11.7783 8.36974 11.8006 8.49316 11.8398C8.74127 11.9188 9.05878 12.0636 9.42969 12.3232C10.0141 12.7323 10.7251 13.424 11.5098 14.5918C11.6052 14.4469 11.7104 14.2891 11.8242 14.1201C12.4303 13.2206 13.2913 12.0007 14.3105 10.7207C15.3284 9.44247 16.5132 8.09191 17.7676 6.93945C19.0135 5.79483 20.3717 4.80427 21.7393 4.29688Z" fill="#001413" />
                            </svg></span><span>{itm}</span></div>
                        )
                    })}
                </div>
            </div>
            <div className=" mt-8">
                <h1 className="text-primary text-24 font-semibold">Why Our Reports Deliver Strategic Advantage</h1>
                <p className="mt-4 text-primary text-16 font-regular">Our reports are designed to go beyond surface-level data and provide structured, decision-ready intelligence. Each study is built to help businesses confidently evaluate opportunities, assess risks, and make informed strategic moves in competitive markets.</p>

                <p className="mt-4 text-primary text-16 font-regular">We focus on clarity, relevance, and actionable insights. Instead of overwhelming users with excessive raw data, we present carefully curated market analysis, competitive landscapes, pricing signals, trade flows, and forward-looking forecasts in a structured and easy-to-navigate format. Every section is organized to directly support real-world business decisions, whether launching a product, entering a new country, benchmarking competitors, or presenting to stakeholders.</p>

                <p className="mt-4 text-primary text-16 font-regular">Our modular approach allows users to access only the sections they need or unlock the full report for comprehensive coverage. Reports are regularly reviewed and updated to reflect changing market dynamics, ensuring the information remains relevant and timely. By combining structured data analysis with strategic interpretation, our reports help reduce uncertainty and support confident decision-making.</p>
            </div>
            <div className="mt-8">
                {/* <h1 className="text-primary text-24 font-semibold">What decisions this report supports</h1> */}
                <div className=" mt-4">
                    {/* <div className=" w-79.5 sm:w-149 h-45 xl:h-84">
                        <img src={image_1} alt="image" className='h-full w-[98%]' />
                    </div> */}
                    <div className=" mt-4 flex gap-2 items-center">
                        <span className='text-primary text-16 font-regular'>To explore more about this topic,</span>
                        <button className='py-2 px-8 text-primary text-15 font-medium bg-brand cursor-pointer hover:bg-[var(--color-brand-primary-hover)]' onClick={() => {
                            setActiveTab("Sample Preview");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}>Download Sample Report</button>
                    </div>
                </div>
            </div>
            {/* <div className=" mt-8">
                <p className='text-primary text-16 font-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore placeat nulla natus? Totam, expedita! Aperiam cupiditate dolorem hic, nemo sit similique placeat perferendis enim maiores distinctio blanditiis velit molestiae sequi odit, ea tempore ipsa laudantium consequuntur at, nam corporis explicabo. Nulla, consectetur quia. Eos impedit, suscipit quidem officia iure sint magnam et, facere distinctio aliquid porro dolores dicta optio amet ipsam doloribus quia, ea dolorum ab itaque consequatur. Id qui quibusdam adipisci veritatis, voluptatum nam minima iusto quae totam quis deleniti nesciunt maxime soluta itaque voluptates dolore consequuntur. Repellat asperiores, in veniam animi porro soluta provident et officia excepturi praesentium nihil voluptates consequuntur assumenda cupiditate minus deserunt libero natus deleniti, iste consectetur inventore! Nam natus quaerat culpa ducimus corrupti accusantium velit dolor ratione magnam sunt ipsa fuga unde voluptatum quo excepturi, odio a, reprehenderit pariatur, similique ut animi! Qui commodi rerum, quia, veritatis illo velit est similique dolorem maxime consequatur architecto reprehenderit. Hic itaque illo sapiente est sed sint autem a corporis? Optio ex possimus laudantium impedit libero? Sequi accusamus fugit perspiciatis deserunt nihil ipsum assumenda quod praesentium illo, voluptatem suscipit ut asperiores tempore rem consequuntur recusandae temporibus ipsa cum autem repudiandae magnam provident! Quaerat at accusamus incidunt reprehenderit, cupiditate pariatur rerum consequuntur dignissimos quia rem dolore animi, culpa commodi quod voluptate eos. Suscipit eaque sapiente molestiae nemo illum! Nam excepturi magnam reiciendis quo, fuga, consectetur corporis natus doloremque, iure atque perspiciatis cum quos. Cumque quos tenetur aperiam beatae mollitia, iusto repellat eveniet dolorum doloribus a enim dignissimos nisi sint iste esse maiores expedita vero officia ea non asperiores. Eaque magnam ipsa praesentium, quos quas doloremque culpa atque ipsam ea expedita minus totam illo. Soluta repellat aliquam magnam ut voluptas nisi consequatur molestias. Voluptates, nostrum. Maxime unde ducimus illum vitae quam distinctio fuga, provident officia aperiam ut deleniti omnis in? Debitis quidem animi commodi error cumque harum nesciunt quo iure neque dolorem reprehenderit nobis assumenda nihil ex eligendi dolores cum suscipit unde, inventore adipisci voluptatum eius eveniet. Aperiam eum ratione dolorem voluptate aliquam totam debitis asperiores ex repudiandae soluta neque quasi amet nam veniam hic, perferendis ea, dolorum sapiente fugiat beatae cumque necessitatibus dolor! Minus doloribus maiores dicta quidem recusandae, magnam illum fuga. Necessitatibus delectus eius exercitationem neque beatae deleniti reiciendis in unde officiis qui, iusto iure est ipsa ratione, consectetur vel aut assumenda a earum perferendis temporibus tempora labore. Distinctio a incidunt vero enim reiciendis corporis aut libero aperiam at fugit esse porro voluptate ea voluptas consequatur, recusandae fuga. Facilis consequatur sequi fugit totam distinctio, magnam reiciendis libero a rerum. Minus incidunt praesentium ab nisi saepe nihil, odit id, ad similique ut quidem optio pariatur at maiores amet suscipit quod nemo! Tenetur quos expedita sed minus, eligendi illum. Obcaecati, temporibus. Tenetur doloribus praesentium dolores, totam quaerat aliquid animi ad voluptatibus quos. Dolores ex magni aliquam laboriosam, maiores fugit, rerum qui unde hic sed iste id dolore nam sit nesciunt a architecto beatae deserunt nostrum saepe reiciendis, libero quaerat. Officiis natus perspiciatis at amet cupiditate dolore deleniti quibusdam nisi possimus.</p>
            </div> */}
            {/* <div className=" mt-8">
                <h1 className="text-primary text-24 font-semibold">What decisions this report supports</h1>
                <div className=" mt-4">
                    <div className=" w-79.5 sm:w-149 h-45 xl:h-84">
                        <img src={image_1} alt="image" className='h-full w-[98%] ' />
                    </div>
                </div>
            </div> */}

            <div className=" mt-8">
                <h1 className="text-primary text-24 font-semibold">Our Research Approach</h1>
                <p className="mt-4 text-primary text-16 font-regular">Our research methodology is built on rigorous secondary data collection, structured validation, and analytical modeling. We gather information from verified public sources including government publications, trade databases, regulatory authorities, company disclosures, and industry reports. Data is cross-verified across multiple sources to ensure consistency and reliability.</p>

                <p className="mt-4 text-primary text-16 font-regular">Market estimations are developed using a combination of top-down and bottom-up approaches. Historical data trends, trade-adjusted consumption patterns, and growth modeling techniques are applied to derive current market size and forecast projections. Where necessary, assumptions are clearly stated to maintain transparency.</p>

                <p className="mt-4 text-primary text-16 font-regular">Our objective is not simply to compile data, but to interpret it within a strategic context. We analyze competitive positioning, pricing dynamics, regional variations, and structural market drivers to provide a balanced view of both opportunities and risks. While forecasts are based on structured modeling and historical patterns, we acknowledge that market conditions may evolve due to regulatory, economic, or technological shifts..</p>

                <p className="mt-4 text-primary text-16 font-regular">
                    By maintaining transparency in data sources, analytical methods, and assumptions, we ensure that users understand how conclusions are formed — strengthening trust and credibility in every report.</p>
            </div>
        </div>
    );
};
export default ScopeCoverage;

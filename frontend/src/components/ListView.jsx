import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ListView = ({ listData, load }) => {

    const navigate = useNavigate();

    if (load) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            {listData?.map((data, i) => {
                return (
                    <div className="border border-gray-200 bg-surface grid grid-cols-[31%_auto] h-46 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" key={data.report_id}>
                        <div className="h-46"><img src={data?.image_path} alt="image" className="h-full w-full" /></div>
                        <div className=" p-4 flex flex-col justify-between">
                            <div className=" flex flex-col gap-2">
                                <div>
                                    <h1 className="text-primary text-20 font-medium wrap-break-word">
                                        {data?.title?.length > 57
                                            ? data.title.slice(0, 57) + " ..."
                                            : data?.title}
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-primary text-16 font-regular wrap-break-word">
                                        {data?.subtitle?.length > 60
                                            ? data.subtitle.slice(0, 57) + " ..."
                                            : data?.subtitle}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="border px-2 py-0.5 text-primary text-13 font-regular">Import Export</div>
                                    <div className="border px-2 py-0.5 text-primary text-13 font-regular">Competitors Landscape</div>
                                    <div className="border px-2 py-0.5 text-primary text-13 font-regular">Target Customers</div>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-end gap-8">
                                    <div className="content-center text-16 text-primary font-regular">$
                                        {
                                            data?.full_price?.toString().length > 5
                                                ? data?.full_price?.toString().slice(0, 5) + "..."
                                                : data?.full_price
                                        }
                                    </div>
                                    <div className="">
                                        <button className="flex items-center cursor-pointer gap-2 px-6 py-2 bg-brand hover:bg-[var(--color-brand-primary-hover)]"
                                            onClick={() => {
                                                if (!data?.report_version_id) return;
                                                navigate(`/report-name/${data.report_version_id}`);
                                            }}
                                        >
                                            <span className="text-15 text-primary font-medium">Discover More</span>
                                            <span><IoIosArrowForward /></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
};
export default ListView;

import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const GridView = ({ listData, load }) => {

    const navigate = useNavigate();

    if (load) {
        return (
            <div className="col-span-full w-full h-40 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            {Array.isArray(listData) && listData?.map((data, i) => {
                return (
                    <div className="border border-gray-200 h-102 xl:w-auto bg-surface shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" key={data.report_id}>
                        <div className="h-[42%]">
                            <div className="px-3 pt-3">
                                <h1 className="h-27 text-primary text-20 font-medium break-words">
                                    {data?.title?.length > 60
                                        ? data.title.slice(0, 60) + "..."
                                        : data?.title || ""}
                                </h1>
                            </div>
                            <div className="mt-3 flex px-4 py-1 justify-between">
                                <span className='text-primary text-16 font-regular'>
                                    ${data?.full_price?.toString().length > 5
                                        ? data?.full_price?.toString().slice(0, 5) + "..."
                                        : data?.full_price}
                                </span>
                                <button className='flex gap-2 items-center cursor-pointer'
                                    onClick={() => {
                                        if (!data?.report_version_id) return;
                                        navigate(`/report-name/${data.report_version_id}`);
                                    }}
                                >
                                    <span className='text-primary text-15 font-medium'>Discover More</span>
                                    <span><IoIosArrowForward /></span>
                                </button>
                            </div>
                        </div>

                        <div className="relative h-[58%]">
                            {data?.image_path && (
                                <img
                                    src={data.image_path}
                                    alt="image"
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <div className=" absolute flex gap-2 px-4 bottom-4">
                                <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Import Export</div>
                                <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Competitors Landscape</div>
                                <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Target Customers</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
};
export default GridView;

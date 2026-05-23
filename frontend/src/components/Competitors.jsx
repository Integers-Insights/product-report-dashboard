import {
  BoltIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import InitialText from "./InitialText";
import Flag from "./Flag";
import { useNavigate } from "react-router-dom";

const Competitors = ({ competitor_data }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Competitor Map
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Direct competitors in your target markets · Certifications, pricing,
            positioning gaps
          </p>
        </div>
        {/* <div className="bg-red-100 text-red-500 text-sm font-medium py-0.5 px-3 rounded-2xl">
          1 cert gap identified — act now
        </div> */}
      </div>

      <div className="border flex gap-3 p-3 rounded-lg border-l-3 border-[#0284C7] mt-6">
        <div>
          <BoltIcon className="mt-1 h-5 w-5" />
        </div>
        <div>
          <span className="text-sm text-[#0284C7] font-medium">
            Your competitors are already selling to your next clients.
          </span>
          <span className="text-sm text-[#5F6368] font-regular">
            See exactly who buys from them — their order volumes, certification
            requirements, and procurement windows — so you can walk into the
            right conversation at the right time.
          </span>
          <span className="text-sm text-[#0284C7] font-medium">
            {" "}
            Turn their buyer list into your pipeline.
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        {competitor_data.length ? (
          competitor_data?.map((item, i) => {
            if (item?.masked) {
              return (
                <div
                  className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
                  key={i}
                >
                  <div className="flex gap-3 items-center">
                    <div className="blur-sm">
                      <InitialText text={"A B"} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2 blur-sm">
                        <p className="text-base font-medium text-[#000000]">
                          Lorem ipsum dolor sit amet consectetur.
                        </p>
                        <button className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                          Lorem, ipsum.
                        </button>
                        <button className="bg-[#EDF9FF] text-[#008ACB] text-xs font-medium px-2 py-0.5 rounded-2xl">
                          Lorem
                        </button>
                      </div>
                      <div className="text-xs font-light text-[#5F6368] flex gap-5 blur-sm">
                        <p>Lorem, ipsum dolor.</p>
                        <p>Lorem, ipsum dolor.</p>
                        <p>Lorem, ipsum dolor.</p>
                        <p>Lorem, ipsum dolor.</p>
                      </div>
                      <p className="text-sm font-regular text-[#5F6368] blur-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Velit reprehenderit praesentium, officiis eaque expedita
                        dignissimos deleniti aperiam! Aliquid praesentium
                        impedit autem
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1 whitespace-nowrap"
                      onClick={() => navigate("/pricing")}
                    >
                      🔒 {item?.message} +
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
                key={i}
              >
                <div className="flex gap-3 items-center">
                  <InitialText text={item.name} />
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <p className="text-base font-medium text-[#000000]">
                        {item?.name ?? "--"}
                      </p>
                      <span className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                        {item?.competitor_type ?? "--"}
                      </span>
                      <span>
                        <Flag country={item?.origin_country} />
                      </span>
                    </div>
                    <div className="text-xs font-light text-[#5F6368]">
                      <p>{item?.notes ?? "--"}</p>
                    </div>
                    <p className="text-sm font-regular text-blue-500">
                      <a
                        href={
                          item?.website
                            ? item.website.startsWith("http")
                              ? item.website
                              : `https://${item.website}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item?.website}
                      </a>
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      if (!item?.website) return;

                      const url = item.website.startsWith("http")
                        ? item.website
                        : `https://${item.website}`;

                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-green-700" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">No Data</p>
        )}
      </div>
    </>
  );
};
export default Competitors;

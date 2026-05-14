import {
  CubeIcon,
  BanknotesIcon,
  FireIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const icons = [
  CubeIcon,
  BanknotesIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const KpiCards = ({ statsData, currentDate, fullName }) => {
  return (
    <>
      <div>
        <h1 className="text-[#000000] text-[28px] font-semibold">
          Hello, {fullName || ""} 👋
        </h1>
        <p className="text-[#5F6368] text-13">
          Here's your export intelligence dashboard -{" "}
          <span>
            {currentDate
              ? new Date(currentDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        {statsData?.map((item, index) => {
          const Icons = icons[index];

          return (
            <div
              className="border border-[#E6E6E6] rounded-lg bg-white p-4 card-hover flex justify-start items-center gap-3"
              key={index}
            >
              <div className="h-11 w-11 rounded-full flex justify-center items-center bg-[#E0F5FF]">
                <Icons className="h-6 w-6 text-[#0284C7]" />
              </div>
              <div>
                <p className="text-base font-regular text-[#3C4D4D] capitalize">
                  {item.key}
                </p>
                <p className="flex gap-2 items-center">
                  {item?.total !== undefined && (
                    <span className="text-xl font-medium text-[#000000]">
                      {item.total}
                    </span>
                  )}

                  {item?.this_week !== undefined && (
                    <span
                      className={`text-sm ${
                        item.this_week > 0 ? "text-[#27C727]" : "text-[#C62828]"
                      }`}
                    >
                      {item.this_week > 0 ? "+" : ""}
                      {item.this_week} this week
                    </span>
                  )}

                  {item?.period && (
                    <span className="text-sm text-[#27C727]">
                      {item.period}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default KpiCards;

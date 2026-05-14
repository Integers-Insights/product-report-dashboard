const EmailSequence = ({ emailData, sequence_note_data }) => {
  return (
    <>
      <div className="border p-3 rounded-lg border-[#96DBFF] flex justify-between items-center bg-[#EDF9FF] mt-6">
        <p className="text-sm text-[#000000]">
          📧 {sequence_note_data ?? "--"}
        </p>
        <button className="text-sm font-medium text-white bg-[#0284C7] rounded-lg cursor-pointer px-2 py-1">
          Copy All 3 Emails
        </button>
      </div>

      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-[#0284C7]">
            1
          </div>
          <div className="w-[2px] flex-1 bg-gray-400"></div>
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-[#0284C7]">
            2
          </div>
          <div className="w-[2px] flex-1 bg-gray-400"></div>
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-[#0284C7]">
            3
          </div>
          <div className="w-[2px] flex-1 bg-gray-400"></div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {emailData?.length === 3 &&
              emailData?.map((item, i) => {
                return (
                  <div
                    className="border p-4 rounded-lg border-[#D9D9D9] card-hover"
                    key={i}
                  >
                    <p className="text-sm font-medium text-[#0284C7]">
                      Email {i + 1} · Send Day {item?.send_day} ·{" "}
                      {item?.type_label}
                    </p>
                    <p className="text-sm font-medium text-[#000000] mt-1">
                      {item?.goal}
                    </p>
                    <div className="p-2 bg-gray-100 rounded-lg border-l-3 border-[#0284C7] mt-3 font-regular text-sm italic">
                      Subject: {item?.subject}
                    </div>
                    <p className="text-sm text-[#5F6368] mt-3 whitespace-pre-line">
                      {item.body}
                    </p>
                    <p className="text-sm text-[#5F6368] mt-3">{item.txt5}</p>
                    <p className="text-sm text-[#5F6368] mt-3">{item.txt6}</p>

                    <div className="mt-3 text-sm font-medium text-[#5F6368] flex gap-3">
                      {" "}
                      {item?.tiles?.map((itm, index) => {
                        return (
                          <span
                            className="py-0.5 px-2 rounded-full bg-gray-100"
                            key={index}
                          >
                            {itm}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default EmailSequence;

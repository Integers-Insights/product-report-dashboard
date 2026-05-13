const AdConcept = ({ adConceptsData }) => {

  return (
    <>
      <p className="text-sm font-medium text-[#5F6368] mt-6 p-2.5 rounded-lg bg-gray-100">
        Click any card to copy the hook. All concepts based on buyer language
        patterns in USA and Germany.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {adConceptsData?.map((item, i) => {
          return (
            <div
              className="border p-3 rounded-lg border-l-3 border-[#008ACB] card-hover"
              key={i}
            >
              <p className="font-medium text-sm text-[#008ACB] mt-2">
                {item?.market ?? "--"} · {item?.angle ?? "--"}
              </p>
              <p className="font-medium text-base text-[#000000] mt-2">
                {item?.hook ?? "--"}
              </p>
              <p className="font-light text-sm text-[#5F6368] mt-2">
                {item?.description ?? "--"}
              </p>
              <div className="flex gap-3 text-sm font-medium mt-2 text-[#5F6368]">
                {item?.tiles?.map((v, i) => {
                  return (
                    <span
                      className="px-2 py-0.5 bg-gray-100 rounded-full"
                      key={i}
                    >
                      {v}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default AdConcept;

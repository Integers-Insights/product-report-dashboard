// const KpiCardSkeleton = () => {
//   return (
//     <>
//       <div className="grid grid-cols-4 gap-6 animate-pulse">
//         {[1, 2, 3, 4]?.map((ske, i) => {
//           return (
//             <div
//               className="border border-[#E6E6E6] rounded-lg bg-white p-4 card-hover flex justify-start items-center gap-3 h-20 bg-gray-100"
//               key={i}
//             ></div>
//           );
//         })}
//       </div>
//     </>
//   );
// };
// export default KpiCardSkeleton;


export const KpiCardSkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="border border-[#E6E6E6] bg-white rounded-lg p-4 flex items-center gap-3 animate-pulse"
        >
          <div className="h-11 w-11 rounded-full bg-gray-200"></div>

          <div className="flex-1">
            <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};



export const OpportunityHubSkeleton = () => {
  return (
    <div className="rounded-lg bg-white shadow-xs animate-pulse">
      {/* Header */}
      {/* <div className="flex justify-between w-full">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div> */}

      {/* Rows */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div
          key={index}
          className="border-b border-[#E0F5FF] pb-2 flex justify-between items-center mt-4"
        >
          {/* Left */}
          <div className="flex gap-3 items-center">
            <div className="h-2 w-2 rounded-full bg-gray-200"></div>

            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-3 items-center">
            <div className="flex gap-1">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full bg-gray-200"
                ></div>
              ))}
            </div>

            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};



export const RecentActivitySkeleton = () => {
  return (
    <div className="rounded-lg bg-white py-2 shadow-xs animate-pulse">
      {/* Header */}
      {/* <div className="h-4 w-32 bg-gray-200 rounded"></div> */}

      {/* Rows */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div
          key={index}
          className="border-b border-[#E0F5FF] pb-3 flex justify-between items-center mt-3"
        >
          {/* Left */}
          <div className="flex gap-3 items-center">
            <div className="h-2 w-2 rounded-full bg-gray-200"></div>

            <div>
              <div className="h-4 w-36 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-52 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-2 items-center">
            <div className="h-8 w-20 bg-gray-200 rounded-sm"></div>

            <div className="h-5 w-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};



export const AiInsightsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {[1, 2].map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-sm sm:rounded-lg p-6 animate-pulse"
        >
          {/* Title */}
          <div className="h-5 w-52 bg-gray-200 rounded mb-4"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};




export const ProductCardSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mt-3">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <div
          key={index}
          className="border border-[#E6E6E6] bg-white p-3 rounded-lg animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          </div>

          {/* Scores */}
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[110px_1fr_30px] gap-2 items-center"
              >
                <div className="h-3 w-20 bg-gray-200 rounded"></div>

                <div className="w-full h-1 bg-gray-200 rounded"></div>

                <div className="h-3 w-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Note box */}
          <div className="border border-gray-200 flex gap-2.5 mt-4 p-3 rounded-lg bg-gray-50">
            <div className="h-6 w-6 rounded bg-gray-200"></div>

            <div className="flex-1">
              <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          {/* Footer buttons */}
          <div className="flex justify-between gap-1.5">
            <div className="w-[85%] h-10 bg-gray-200 rounded-lg"></div>

            <div className="w-[12%] h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};


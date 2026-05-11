// import { useState } from "react";
// import B2Bbuyers from "./B2Bbuyers";
// import B2Cprofile from "./B2Cprofile";
// import BothProfile from "./BothProfile";

// const Buyer = () => {
//   const [buyerType, setBuyerType] = useState("Both");

//   return (
//     <div className="border">
//       {buyerType === "B2B" && <B2Bbuyers />}
//       {buyerType === "B2C" && <B2Cprofile />}
//     </div>
//   );
// };
// export default Buyer;





// import { useState, useEffect } from "react";
// import B2Bbuyers from "./B2Bbuyers";
// import B2Cprofile from "./B2Cprofile";

// const Buyer = ({buyers_data}) => {

//   let apiType=buyers_data?.buyer_type;
//   // console.log("ap: ",apiType);
//   // const [apiType, setApiType] = useState("BOTH");
//   const [buyerType, setBuyerType] = useState("B2B");

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const res = { type: "BOTH" };

//   //     const type = res.type?.trim().toUpperCase() || "B2B";

//   //     setApiType(type);

//   //     setBuyerType((prev) => {
//   //       if (type === "B2B") return "B2B";
//   //       if (type === "B2C") return "B2C";
//   //       return prev || "B2B";
//   //     });
//   //   };

//   //   fetchData();
//   // }, []);

//   return (
//     <div className="p-3">
//       {/* Buttons */}
//       <div className="mb-3 flex justify-end">
//         <div className="border border-[#E6E6E6] flex gap-2 px-3 py-1 bg-gray-100 rounded-lg">
          
//           {(apiType === "B2B" || apiType === "BOTH") && (
//             <button
//               onClick={() => setBuyerType("B2B")}
//               className={`rounded px-2 py-1 text-sm font-medium cursor-pointer ${
//                 buyerType === "B2B" ? "bg-white" : "hover:bg-gray-100"
//               }`}
//             >
//               B2B Buyers
//             </button>
//           )}

//           {(apiType === "B2C" || apiType === "BOTH") && (
//             <button
//               onClick={() => setBuyerType("B2C")}
//               className={`rounded px-2 py-1 text-sm font-medium cursor-pointer ${
//                 buyerType === "B2C" ? "bg-white" : "hover:bg-gray-100"
//               }`}
//             >
//               B2C Profile
//             </button>
//           )}

//         </div>
//       </div>

//       {/* Data */}
//       {buyerType === "B2B" && <B2Bbuyers />}
//       {buyerType === "B2C" && <B2Cprofile />}
//     </div>
//   );
// };

// export default Buyer;



// import { useState, useEffect } from "react";
// import B2Bbuyers from "./B2Bbuyers";
// import B2Cprofile from "./B2Cprofile";

// const Buyer = ({ buyers_data }) => {
//   const apiType = buyers_data?.buyer_type?.trim().toUpperCase() || "B2B";

//   const [buyerType, setBuyerType] = useState("B2B");

//   useEffect(() => {
//     if (apiType === "B2B") {
//       setBuyerType("B2B");
//     } else if (apiType === "B2C") {
//       setBuyerType("B2C");
//     } else if (apiType === "BOTH") {
//       setBuyerType("B2B"); // default
//     }
//   }, [apiType]);

//   return (
//     <div className="p-3">
//       {/* Buttons */}
//       <div className="mb-3 flex justify-end">
//         <div className="border border-[#E6E6E6] flex gap-2 px-3 py-1 bg-gray-100 rounded-lg">

//           {(apiType === "B2B" || apiType === "BOTH") && (
//             <button
//               onClick={() => setBuyerType("B2B")}
//               className={`rounded px-2 py-1 text-sm font-medium cursor-pointer ${
//                 buyerType === "B2B" ? "bg-white" : "hover:bg-gray-100"
//               }`}
//             >
//               B2B Buyers
//             </button>
//           )}

//           {(apiType === "B2C" || apiType === "BOTH") && (
//             <button
//               onClick={() => setBuyerType("B2C")}
//               className={`rounded px-2 py-1 text-sm font-medium cursor-pointer ${
//                 buyerType === "B2C" ? "bg-white" : "hover:bg-gray-100"
//               }`}
//             >
//               B2C Profile
//             </button>
//           )}

//         </div>
//       </div>

//       {/* Data */}
//       {(buyerType === "B2B" && (apiType === "B2B" || apiType === "BOTH")) && <B2Bbuyers />}
//       {(buyerType === "B2C" && (apiType === "B2C" || apiType === "BOTH")) && <B2Cprofile />}
//     </div>
//   );
// };

// export default Buyer;






import { useState, useEffect } from "react";
import B2Bbuyers from "./B2Bbuyers";
import B2Cprofile from "./B2Cprofile";

const Buyer = ({ buyers_data }) => {
  const apiType = buyers_data?.buyer_type?.trim().toUpperCase() || "B2B";

  const [buyerType, setBuyerType] = useState("B2B");

  useEffect(() => {
    if (apiType === "B2C") {
      setBuyerType("B2C");
    } else {
      setBuyerType("B2B");
    }
  }, [apiType]);

  return (
    <div className="p-3">
      
      <div className="mb-3 flex justify-end">
        <div className="border border-[#E6E6E6] flex gap-2 px-3 py-1 bg-gray-100 rounded-lg">

          {(apiType === "B2B" || apiType === "BOTH") && (
            <button
              onClick={() => setBuyerType("B2B")}
              className={`rounded px-2 py-1 text-sm font-medium ${
                buyerType === "B2B" ? "bg-white" : "hover:bg-gray-100"
              }`}
            >
              B2B Buyers
            </button>
          )}

          {(apiType === "B2C" || apiType === "BOTH") && (
            <button
              onClick={() => setBuyerType("B2C")}
              className={`rounded px-2 py-1 text-sm font-medium ${
                buyerType === "B2C" ? "bg-white" : "hover:bg-gray-100"
              }`}
            >
              B2C Profile
            </button>
          )}

        </div>
      </div>

      {(buyerType === "B2B" && (apiType === "B2B" || apiType === "BOTH")) && (
        <B2Bbuyers b2b={buyers_data?.b2b} />
      )}

      {(buyerType === "B2C" && (apiType === "B2C" || apiType === "BOTH")) && (
        <B2Cprofile b2c={buyers_data?.b2c} />
      )}
    </div>
  );
};

export default Buyer;
import * as Flags from "country-flag-icons/react/3x2";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const Flag = ({ country, size = 18 }) => {
  if (!country) return <span>🌍</span>;

  const iso = countries.getAlpha2Code(country.trim(), "en");
  const Component = iso ? Flags[iso] : null;

  return Component ?
  <Component width={size} />
   : <span>🌍</span>;
};

export default Flag;







// ///  
// import * as Flags from "country-flag-icons/react/3x2";
// import countries from "i18n-iso-countries";
// import en from "i18n-iso-countries/langs/en.json";

// countries.registerLocale(en);

// const Flag = ({ country, size = 24 }) => {
//   if (!country) return <span>🌍</span>;

//   const iso = countries.getAlpha2Code(country.trim(), "en");
//   const Component = iso ? Flags[iso] : null;

//   return Component ? (
//     <div className="border border-blue-500 rounded-full">
//       <Component width={size} className="border-green-700" />
//     </div>
//   ) : (
//     <span>🌍</span>
//   );
// };

// export default Flag;





// import * as Flags from "country-flag-icons/react/3x2";
// import countries from "i18n-iso-countries";
// import en from "i18n-iso-countries/langs/en.json";

// // locale register (ek baar)
// countries.registerLocale(en);

// const Flag = ({ country, size = 32 }) => {
//   if (!country) return <span>🌍</span>;

//   const iso = countries.getAlpha2Code(country.trim(), "en");
//   const Component = iso ? Flags[iso] : null;

//   if (!Component) return <span>🌍</span>;

//   return (
//     <div
//       className="rounded-full overflow-hidden border"
//       style={{ width: size, height: size }}
//     >
//       <div className="w-full h-full flex items-center justify-center">
//         <Component
//           style={{
//             width: "140%",
//             height: "140%",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Flag;
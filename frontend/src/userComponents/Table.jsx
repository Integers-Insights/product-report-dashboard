// const tableData = [
//     {
//         Competitor_txt1: 'SpiceGuru International',
//         Competitor_txt2: '🇮🇳 India — Rajasthan',
//         markets: "🇺🇸 🇩🇪 🇬🇧",
//         certifications: ["GMP", "USDA Org"],
//         price: '$7–14',
//         positioning: 'Mid bulk',
//         your_edge: 'Cert lapse — their buyers now available',
//         threat: '⬇ Reduced',
//         image:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     {
//         Competitor_txt1: 'OrganicIndia Ltd.',
//         Competitor_txt2: '🇮🇳 India — Uttar Pradesh',
//         markets: "🇺🇸 🇬🇧 🇸🇬",
//         certifications: ["GMP", "USDA Org", "Fair Trade"],
//         price: '$10–18',
//         positioning: 'Premium brand',
//         your_edge: 'Price advantage at $8.50 vs $10+',
//         threat: 'High',
//         image:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     {
//         Competitor_txt1: 'NatureVit GmbH',
//         Competitor_txt2: '🇩🇪 Germany — private label',
//         markets: "🇩🇪 🇫🇷",
//         certifications: ["EU Organic", "GMP"],
//         price: '$13–20',
//         positioning: 'EU-origin',
//         your_edge: 'Price: 40% cheaper, USDA cert adds credibility',
//         threat: 'Medium',
//         image:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     {
//         Competitor_txt1: 'Verdure Sciences',
//         Competitor_txt2: '🇺🇸 USA — reformulator',
//         markets: "🇺🇸 only",
//         certifications: ["USDA Org", "Non-GMO", "Kosher"],
//         price: '$15–24',
//         positioning: 'Science-backed',
//         your_edge: 'Price 45% lower + India origin story',
//         threat: 'Medium',
//         image:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     {
//         Competitor_txt1: 'Himalaya Drug Company',
//         Competitor_txt2: '🇮🇳 India — branded',
//         markets: "Global",
//         certifications: ["GMP", "WHO GMP", "USDA"],
//         price: '$12–22',
//         positioning: 'Consumer brand',
//         your_edge: 'Bulk B2B focus vs their retail focus — different buyers',
//         threat: 'Low (diff channel)',
//         image:
//             'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
// ]

// // export default function Table() {
// //     return (
// //         <div className="px-4 sm:px-6 lg:px-8">
// //             <div className="mt-8 flow-root">
// //                 <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
// //                     <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
// //                         <table className="relative min-w-full divide-y divide-gray-300">
// //                             <thead>
// //                                 <tr>
// //                                     <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
// //                                         Competitor
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Markets
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Certifications
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Price $/kg
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Positioning
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Your edge
// //                                     </th>
// //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
// //                                         Threat
// //                                     </th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody className="divide-y divide-gray-200 bg-white">
// //                                 {tableData.map((val) => (
// //                                     <tr key={val.email}>
// //                                         <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">                                          
// //                                                 <div className="ml-4">
// //                                                     <div className="font-medium text-gray-900">{val.Competitor_txt1}</div>
// //                                                     <div className="mt-1 text-gray-500">{val.Competitor_txt2}</div>
// //                                                 </div>
// //                                         </td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
// //                                             <div className="text-gray-900">{val.markets}</div>
// //                                             {/* <div className="mt-1 text-gray-500">{val.department}</div> */}
// //                                         </td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500 flex gap-2">
// //                                            <div className="border">{val.certifications[0]}</div>
// //                                            <div className="border">{val.certifications[1]}</div>
// //                                            <div className="border">{val?.certifications[2]}</div>
// //                                         </td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">{val.price}</td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">{val.positioning}</td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500 border w-10">{val.your_edge}</td>
// //                                         <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">{val.threat}</td>
// //                                     </tr>
// //                                 ))}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }



// const Table = () => {
//     return (
//         <>
//             <div className="border grid grid-cols-7 gap-5">
//                 <div className="border text-center uppercase font-medium text-sm py-1">Competitor</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Markets</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Certifications</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Price $/kg</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Positioning</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Your edge</div>
//                 <div className="border text-center uppercase font-medium text-sm py-1">Threat</div>
//             </div>

//             {tableData?.map((item, i) => {
//                 return (
//                     <div className="grid grid-cols-7 gap-5 mt-1.5 border-y border-red-500" key={i}>
//                         <div className="border px-1 font-medium text-sm py-1">
//                             <p className="font-medium text-[#000000]">{item.Competitor_txt1}</p>
//                             <p className="text-xs font-medium text-[#5F6368] mt-1">{item.Competitor_txt2}</p>
//                         </div>
//                         <div className="border text-center font-medium text-sm py-1">{item.markets}</div>
//                         <div className="border text-center font-medium text-sm py-1 px-1 flex flex-wrap gap-2">
//                             {item.certifications[0] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-1 py-0.5">{item.certifications[0]}</span>}
//                             {item.certifications[1] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-1 py-0.5">{item.certifications[1]}</span>}
//                             {item.certifications[2] && <span className="border h-6.5 font-medium text-[#5F6368] rounded-2xl px-1 py-0.5">{item.certifications[2]}</span>}
//                         </div>
//                         <div className="border text-center font-medium text-sm py-1">{item.price}</div>
//                         <div className="border px-1 font-medium text-sm py-1">
//                             <span className="border px-1 py-0.5 rounded-full">{item.positioning}</span>
//                         </div>
//                         <div className="border px-1 text-sm py-1">{item.your_edge}</div>
//                         <div className="border text-center font-medium text-sm py-1"><span className="border px-1 py-0.5 rounded-full">{item.threat}</span></div>
//                     </div>
//                 )
//             })}

//         </>
//     );
// };
// export default Table;
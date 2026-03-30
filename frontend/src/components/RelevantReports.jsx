// import frame1 from '../assets/frame1.jpeg';

// const RelevantReports = () => {

//     return (
//         <>
//             <div>
//                 <h1 className="text-24 text-primary font-semibold text-center my-12">Relevant Reports</h1>
//                 <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

//                     {/* card1 */}
//                     <div className=" h-102 bg-surface">
//                         <div className=" h-[42%]">
//                             <div className=" px-4 pt-4">
//                                 <h1 className='text-primary text-20 font-medium'>Consumer Goods Market Report - Consumer and Exporters</h1>
//                             </div>
//                             <div className=" mt-5 flex px-4 py-2 justify-between">
//                                 <span className='text-primary text-16 font-regular'>$1299</span>
//                                 <button className='flex gap-2'>
//                                     <span className='text-primary text-15 font-medium'>Browse Reports</span>
//                                     <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path d="M9.46967 5.46967C9.76256 5.17678 10.2373 5.17678 10.5302 5.46967L15.8232 10.7626C15.9748 10.9143 16.1426 11.0806 16.2636 11.2392C16.3978 11.4151 16.5429 11.6665 16.5429 11.9999C16.5429 12.3334 16.3978 12.5848 16.2636 12.7607C16.1426 12.9193 15.9748 13.0856 15.8232 13.2372L10.5302 18.5302C10.2373 18.8231 9.76256 18.8231 9.46967 18.5302C9.17678 18.2373 9.17678 17.7626 9.46967 17.4697L14.7626 12.1767C14.8324 12.107 14.8883 12.0497 14.9365 11.9999C14.8883 11.9502 14.8324 11.8929 14.7626 11.8232L9.46967 6.53022C9.17678 6.23732 9.17678 5.76256 9.46967 5.46967Z" fill="#001413" />
//                                     </svg></span>
//                                 </button>
//                             </div>
//                         </div>


//                         <div className=" relative h-[58%]">
//                             <img src={frame1} alt="image" className='h-full w-full' />
//                             <div className=" absolute flex gap-2 px-4 bottom-4">
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Market Study</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Importers</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Pricing</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* card2 */}
//                     <div className=" h-102 bg-surface">
//                         <div className=" h-[42%]">
//                             <div className=" px-4 pt-4">
//                                 <h1 className='text-primary text-20 font-medium'>Consumer Goods Market Report - Consumer and Exporters</h1>
//                             </div>
//                             <div className=" mt-5 flex px-4 py-2 justify-between">
//                                 <span className='text-primary text-16 font-regular'>$1299</span>
//                                 <button className='flex gap-2'>
//                                     <span className='text-primary text-15 font-medium'>Browse Reports</span>
//                                     <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path d="M9.46967 5.46967C9.76256 5.17678 10.2373 5.17678 10.5302 5.46967L15.8232 10.7626C15.9748 10.9143 16.1426 11.0806 16.2636 11.2392C16.3978 11.4151 16.5429 11.6665 16.5429 11.9999C16.5429 12.3334 16.3978 12.5848 16.2636 12.7607C16.1426 12.9193 15.9748 13.0856 15.8232 13.2372L10.5302 18.5302C10.2373 18.8231 9.76256 18.8231 9.46967 18.5302C9.17678 18.2373 9.17678 17.7626 9.46967 17.4697L14.7626 12.1767C14.8324 12.107 14.8883 12.0497 14.9365 11.9999C14.8883 11.9502 14.8324 11.8929 14.7626 11.8232L9.46967 6.53022C9.17678 6.23732 9.17678 5.76256 9.46967 5.46967Z" fill="#001413" />
//                                     </svg></span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className=" relative h-[58%]">
//                             <img src={frame1} alt="image" className='h-full w-full' />
//                             <div className=" absolute flex gap-2 px-4 bottom-4">
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Market Study</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Importers</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Pricing</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* card3 */}
//                     <div className=" h-102 bg-surface">
//                         <div className=" h-[42%]">
//                             <div className=" px-4 pt-4">
//                                 <h1 className='text-primary text-20 font-medium'>Consumer Goods Market Report - Consumer and Exporters</h1>
//                             </div>
//                             <div className=" mt-5 flex px-4 py-2 justify-between">
//                                 <span className='text-primary text-16 font-regular'>$1299</span>
//                                 <button className='flex gap-2'>
//                                     <span className='text-primary text-15 font-medium'>Browse Reports</span>
//                                     <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path d="M9.46967 5.46967C9.76256 5.17678 10.2373 5.17678 10.5302 5.46967L15.8232 10.7626C15.9748 10.9143 16.1426 11.0806 16.2636 11.2392C16.3978 11.4151 16.5429 11.6665 16.5429 11.9999C16.5429 12.3334 16.3978 12.5848 16.2636 12.7607C16.1426 12.9193 15.9748 13.0856 15.8232 13.2372L10.5302 18.5302C10.2373 18.8231 9.76256 18.8231 9.46967 18.5302C9.17678 18.2373 9.17678 17.7626 9.46967 17.4697L14.7626 12.1767C14.8324 12.107 14.8883 12.0497 14.9365 11.9999C14.8883 11.9502 14.8324 11.8929 14.7626 11.8232L9.46967 6.53022C9.17678 6.23732 9.17678 5.76256 9.46967 5.46967Z" fill="#001413" />
//                                     </svg></span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className=" relative h-[58%]">
//                             <img src={frame1} alt="image" className='h-full w-full' />
//                             <div className=" absolute flex gap-2 px-4 bottom-4">
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Market Study</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Importers</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Pricing</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* card4 */}
//                     <div className=" h-102 bg-surface">
//                         <div className=" h-[42%]">
//                             <div className=" px-4 pt-4">
//                                 <h1 className='text-primary text-20 font-medium'>Consumer Goods Market Report - Consumer and Exporters</h1>
//                             </div>
//                             <div className=" mt-5 flex px-4 py-2 justify-between">
//                                 <span className='text-primary text-16 font-regular'>$1299</span>
//                                 <button className='flex gap-2'>
//                                     <span className='text-primary text-15 font-medium'>Browse Reports</span>
//                                     <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path d="M9.46967 5.46967C9.76256 5.17678 10.2373 5.17678 10.5302 5.46967L15.8232 10.7626C15.9748 10.9143 16.1426 11.0806 16.2636 11.2392C16.3978 11.4151 16.5429 11.6665 16.5429 11.9999C16.5429 12.3334 16.3978 12.5848 16.2636 12.7607C16.1426 12.9193 15.9748 13.0856 15.8232 13.2372L10.5302 18.5302C10.2373 18.8231 9.76256 18.8231 9.46967 18.5302C9.17678 18.2373 9.17678 17.7626 9.46967 17.4697L14.7626 12.1767C14.8324 12.107 14.8883 12.0497 14.9365 11.9999C14.8883 11.9502 14.8324 11.8929 14.7626 11.8232L9.46967 6.53022C9.17678 6.23732 9.17678 5.76256 9.46967 5.46967Z" fill="#001413" />
//                                     </svg></span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className=" relative h-[58%]">
//                             <img src={frame1} alt="image" className='h-full w-full' />
//                             <div className=" absolute flex gap-2 px-4 bottom-4">
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Market Study</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Importers</div>
//                                 <div className='bg-surface border-text-secondary px-2 py-0.5 text-13 text-primary font-regular'>Pricing</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
// export default RelevantReports;

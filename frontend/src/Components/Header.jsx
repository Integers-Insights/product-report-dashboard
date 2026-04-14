// import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

// const Header = () => {
//     return (
//         <div className="bg-[#FFF] h-17 flex justify-end items-center pr-8">

//             <div className="flex gap-9 items-center">
//                 <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-[#0284C7] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 w-68">
//                     <div className="flex py-1.5 pl-2">
//                         <kbd className="inline-flex items-center border text-xs text-[#000000]">
//                             <MagnifyingGlassIcon className="w-5 h-5" />
//                         </kbd>
//                     </div>
//                     <input
//                         id="search"
//                         name="search"
//                         type="text"
//                         placeholder='Search report or product'
//                         className="block min-w-0 grow px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
//                     />
//                 </div>
//                 <div className="border">
//                     <BellIcon className="w-6 h-6 text-[#000000]" />
//                 </div>
//             </div>

//         </div>



//     );
// };
// export default Header;




import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
    return (
        <Disclosure as="nav" className="relative bg-white shadow-sm pr-8">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="grid w-68 grid-cols-1">
                            <input
                                name="search"
                                type="search"
                                placeholder="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                            />
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-[#000000]"
                            />
                        </div>
                    </div>

                    <div className="ml-4 flex items-center">
                        <button
                            type="button"
                            className="relative shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-[#0284C7]"
                        >
                            <BellIcon aria-hidden="true" className="size-6 text-[#000000]" />
                        </button>
                    </div>

                </div>
            </div>
        </Disclosure>
    )
}
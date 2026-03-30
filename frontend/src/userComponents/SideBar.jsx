import {
    CalendarIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon
} from '@heroicons/react/24/outline'

import { SparklesIcon, CubeTransparentIcon, BanknotesIcon, WalletIcon, ChartBarIcon, UserGroupIcon, ChartPieIcon, BoltIcon, ArrowUpCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

import Int_Logo_Main_Horz from '../assets/Int_Logo_Main_Horz.png';
import Ellipse_11 from '../assets/Ellipse_11.svg';

const navigation = [
    { name: 'Overview', href: '#', icon: CubeTransparentIcon, current: true },
    { name: 'Opportunity Hub', href: '#', icon: BanknotesIcon, current: false },
    { name: 'My Product', href: '#', icon: WalletIcon, current: false },
    { name: 'Market Glance', href: '#', icon: ChartBarIcon, count: '5', current: false },
    { name: 'Buyer List', href: '#', icon: UserGroupIcon, current: false },
    { name: 'Reports', href: '#', icon: ChartPieIcon, count: '5', current: false }
]
const teams = [
    { id: 1, name: 'Settings', href: '#', initial: 'H', current: false, icon: Cog6ToothIcon },
    { id: 2, name: 'Help & Support', href: '#', initial: 'T', current: false, icon: QuestionMarkCircleIcon },
    { id: 3, name: 'Log out', href: '#', initial: 'W', current: false, icon: ArrowLeftStartOnRectangleIcon },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SideBar = () => {
    return (
        // <div className="sticky top-0 left-0 flex grow flex-col gap-y-3 overflow-y-auto bg-[#FFF] px-6 w-62 h-screen">
        <div className="sticky top-0 left-0 flex flex-col gap-y-3 bg-[#FFF] px-6 w-64 min-h-screen">
            <div className="flex h-12 mt-2 shrink-0 items-center">
                <img
                    alt="Int-Logo"
                    src={Int_Logo_Main_Horz}
                    className="h-10 w-auto"
                />
            </div>
            <div className="py-3 rounded-lg bg-gradient-to-r from-[#0284c7] via-[#29a5e9] to-[#0980c3]">
                <button className='h-full w-full flex justify-center items-center gap-2 font-medium text-white'>
                    <span><SparklesIcon className='w-6 h-6' /></span>
                    <span>New Intelligence</span>
                </button>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-[#E0F5FF] text-[#0284C7] font-medium'
                                                : 'text-black hover:bg-gray-100',
                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-regular',
                                        )}
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className={classNames(
                                                // item.current ? 'text-black' : 'text-indigo-200 group-hover:text-white',
                                                'size-6 shrink-0',
                                            )}
                                        />
                                        {item.name}
                                        {item.count ? (
                                            <span
                                                aria-hidden="true"
                                                className="ml-auto w-9 min-w-max rounded-full bg-[#E0F5FF] px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-[#0284C7] outline-1 -outline-offset-1 outline-[#E0F5FF]"
                                            >
                                                {item.count}
                                            </span>
                                        ) : null}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className='mt-2'>
                        <div className="text-xs/6 font-semibold text-black">ACCOUNT</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                                <li key={team.name}>
                                    <a
                                        href={team.href}
                                        className={classNames(
                                            team.current
                                                ? 'bg-[#E0F5FF] text-[#0284C7] font-medium'
                                                : 'text-black hover:bg-gray-100 hover:text-black',
                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-regular',
                                        )}
                                    >
                                        {/* <span className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium text-black">
                      {team.initial}
                    </span> */}
                                        <team.icon
                                            aria-hidden="true"
                                            className={classNames(
                                                // item.current ? 'text-black' : 'text-indigo-200 group-hover:text-white',
                                                'size-6 shrink-0',
                                            )}
                                        />
                                        <span className="truncate">{team.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="-mx-6 mt-auto">
                        <div className="mb-3 py-3 px-6">
                            <div className="p-2 rounded-lg bg-[linear-gradient(102deg,rgba(2,132,199,0.10)_-8.81%,rgba(1,99,224,0.05)_103.39%)]">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span><BoltIcon className='h-5 w-5 text-yellow-500' /></span>
                                        <span className='text-[13px]'>Scout Plan</span>
                                    </div>
                                    <div><span className='text-xl font-semibold'>73</span><span className='text-[#5F6368] text-[14px]'>/100</span></div>
                                </div>

                                <div className="h-2 my-2 bg-[#A9B3B1] rounded">
                                    <div className="h-full bg-[#0284C7] rounded" style={{ width: "73%" }}>
                                    </div>
                                </div>
                                <p><span className='text-[#5F6368] text-[11px]'>27 queries used: Resets in</span><span className='text-[14px] font-medium text-[#0284C7]'> 22 days</span></p>

                                <div className="bg-[#0284C7] hover:bg-[#0369A1] rounded mt-2">
                                    <button className='flex justify-center gap-2.5 items-center h-full w-full py-1.5 text-white rounded cursor-pointer'>
                                        <span><ArrowUpCircleIcon className='h-5 w-5' /></span>
                                        <span className='text-[11px]'>Upgrade</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#"
                            className="flex items-center gap-x-4 px-6 py-1 text-sm/6 font-regular text-white"
                        >
                            <img
                                alt=""
                                src={Ellipse_11}
                                className="size-9 rounded-full outline -outline-offset-1 outline-white/10"
                            />
                            <span>
                                <span aria-hidden="true" className='text-black'>Harry Potter</span><br />
                                <span aria-hidden="true" className='block -mt-2 text-[#5F6368] text-[11px]'>Premium Account</span>
                            </span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default SideBar;

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon,CubeIcon,BanknotesIcon,FireIcon,ClipboardDocumentCheckIcon  } from '@heroicons/react/24/outline'

const stats = [
    { id: 1, name: 'Products tracked', stat: '4', icon: CubeIcon, change: '+1 this week', changeType: 'increase' },
    { id: 2, name: 'Buyers Discovered', stat: '12', icon: BanknotesIcon, change: '-3 this week', changeType: 'decrease' },
    { id: 3, name: 'Top Opportunity Score', stat: '91', icon: FireIcon, change: 'Turmeric → USA', changeType: 'increase' },
    { id: 3, name: 'Reports Completed', stat: '2', icon: ClipboardDocumentCheckIcon , change: 'This billing cycle', changeType: 'increase' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const KpiCards = () => {
    return (
        <>
            <div>
                <h1 className="text-[#000000] text-[28px] font-semibold">Good Morning, Guest  👋</h1>
                <p className="text-[#5F6368] text-13">Here's your export intelligence dashboard - Tuesday, 11 March 2026.</p>
            </div>

            <div>
                <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item,i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5  shadow-sm sm:px-6 sm:pt-6 card-hover">
                            <dt>
                                <div className="absolute rounded-full bg-[#E0F5FF] p-3">
                                    <item.icon aria-hidden="true" className="size-6 text-[#0284C7]" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-[#3C4D4D]">{item.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                <p className="text-xl font-semibold text-[#001413]">{item.stat}</p>
                                <p
                                    className={classNames(
                                        item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                                        'ml-2 flex items-baseline text-sm',
                                    )}
                                >
                                    {item.changeType === 'increase' ? (
                                        <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                                    ) : (
                                        <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                                    )}
                                    <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                                    {item.change}
                                </p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </>
    );
};
export default KpiCards;
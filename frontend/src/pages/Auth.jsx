// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { TrendingUp, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react'
// import PageWrapper from '../components/PageWrapper'

// function GoogleIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24">
//       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
//       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//     </svg>
//   )
// }

// const bullets = [
//   '3 free intelligence reports — no card needed',
//   'Verified buyer contacts with emails & LinkedIn',
//   'Live market data across 180+ countries',
//   'Opportunity score for any product + country pair',
//   'Upgrade or cancel anytime — no lock-in',
// ]

// function Input({ label, type = 'text', placeholder, id }) {
//   const [show, setShow] = useState(false)
//   const isPass = type === 'password'
//   return (
//     <div className="mb-4">
//       <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">{label}</label>
//       <div className="relative">
//         <input
//           id={id}
//           type={isPass ? (show ? 'text' : 'password') : type}
//           placeholder={placeholder}
//           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
//         />
//         {isPass && (
//           <button type="button" onClick={() => setShow(v => !v)}
//             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
//           >
//             {show ? <EyeOff size={14} /> : <Eye size={14} />}
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function Auth() {
//   const [tab, setTab] = useState('signup')

//   return (
//     <PageWrapper>
//       <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-brand-50/20">
//         {/* Background elements */}
//         <div className="absolute inset-0 bg-grid mask-radial opacity-30 pointer-events-none" />
//         <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-brand-400/8 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-sky-400/6 rounded-full blur-3xl pointer-events-none" />

//         <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.1)] border border-white/60 flex">

//           {/* Left panel */}
//           <div className="hidden lg:flex flex-col justify-between w-5/12 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 p-10 relative overflow-hidden">
//             <div className="absolute inset-0 bg-grid opacity-20" />
//             <motion.div
//               animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
//               transition={{ duration: 8, repeat: Infinity }}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"
//             />

//             <div className="relative">
//               <Link to="/" className="flex items-center gap-2.5 mb-10">
//                 <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                   <TrendingUp size={17} className="text-white" strokeWidth={2.5} />
//                 </div>
//                 <span className="font-extrabold text-lg text-white tracking-tight">Integer Market</span>
//               </Link>

//               <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">Start finding your global buyers today</h2>
//               <p className="text-sm text-white/70 font-light leading-relaxed mb-8">
//                 Join 2,400+ exporters and manufacturers who use Integer Market to find verified buyers, track live demand, and grow internationally.
//               </p>

//               <div className="space-y-3.5">
//                 {bullets.map(b => (
//                   <div key={b} className="flex items-start gap-3 text-sm text-white/90">
//                     <CheckCircle2 size={15} className="text-brand-300 shrink-0 mt-0.5" />
//                     {b}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="relative">
//               <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
//                 <div className="flex mb-3">
//                   {[...Array(5)].map((_, i) => (
//                     <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
//                   ))}
//                   <span className="text-xs text-white/60 ml-2">4.8 / 5</span>
//                 </div>
//                 <p className="text-xs text-white/80 italic leading-relaxed mb-3">
//                   "Integer Market gave us a ranked list of 12 countries with demand scores in 8 minutes. We closed our first German buyer within 6 weeks."
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white font-mono">RK</div>
//                   <div>
//                     <div className="text-xs font-semibold text-white">Rajiv Kapoor</div>
//                     <div className="text-[10px] text-white/50">Director, Nutraceuticals · Gujarat</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right panel */}
//           <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center">
//             {/* Tab switcher */}
//             <div className="flex bg-slate-100 rounded-xl p-1 mb-7 gap-1">
//               {['signup', 'login'].map(t => (
//                 <button key={t} onClick={() => setTab(t)}
//                   className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                     tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
//                   }`}
//                 >
//                   {t === 'signup' ? 'Create account' : 'Log in'}
//                 </button>
//               ))}
//             </div>

//             <AnimatePresence mode="wait">
//               {tab === 'signup' ? (
//                 <motion.div key="signup"
//                   initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
//                   transition={{ duration: 0.22 }}
//                 >
//                   <button className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium py-2.5 rounded-xl mb-5 transition-all hover:shadow-sm">
//                     <GoogleIcon /> Continue with Google
//                   </button>
//                   <div className="flex items-center gap-3 mb-5 text-xs text-slate-300">
//                     <div className="flex-1 h-px bg-slate-100" />
//                     or sign up with email
//                     <div className="flex-1 h-px bg-slate-100" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <Input id="first" label="First name" placeholder="Raj" />
//                     <Input id="last" label="Last name" placeholder="Kapoor" />
//                   </div>
//                   <Input id="email" label="Business email" type="email" placeholder="raj@yourcompany.com" />
//                   <Input id="company" label="Company name" placeholder="Kapoor Exports Pvt. Ltd." />
//                   <Input id="pass" label="Password" type="password" placeholder="At least 8 characters" />

//                   <motion.button
//                     whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//                     className="btn-shimmer w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl mt-1 transition-colors shadow-glow-green-sm"
//                   >
//                     Create my free account <ArrowRight size={15} />
//                   </motion.button>
//                   <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
//                     By signing up you agree to our <a href="#" className="underline hover:text-slate-600">Terms</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>. No credit card required.
//                   </p>
//                   <p className="text-center text-sm text-slate-400 mt-3">
//                     Already have an account?{' '}
//                     <button onClick={() => setTab('login')} className="text-brand-600 font-semibold hover:underline">Log in</button>
//                   </p>
//                 </motion.div>
//               ) : (
//                 <motion.div key="login"
//                   initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
//                   transition={{ duration: 0.22 }}
//                 >
//                   <button className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium py-2.5 rounded-xl mb-5 transition-all hover:shadow-sm">
//                     <GoogleIcon /> Continue with Google
//                   </button>
//                   <div className="flex items-center gap-3 mb-5 text-xs text-slate-300">
//                     <div className="flex-1 h-px bg-slate-100" />
//                     or log in with email
//                     <div className="flex-1 h-px bg-slate-100" />
//                   </div>
//                   <Input id="login-email" label="Email address" type="email" placeholder="raj@yourcompany.com" />
//                   <div className="mb-4">
//                     <div className="flex justify-between items-center mb-1.5">
//                       <label className="text-xs font-semibold text-slate-600 tracking-wide">Password</label>
//                       <a href="#" className="text-xs text-brand-600 hover:underline">Forgot password?</a>
//                     </div>
//                     <div className="relative">
//                       <input type="password" placeholder="Your password"
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
//                       />
//                     </div>
//                   </div>

//                   <motion.button
//                     whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//                     className="btn-shimmer w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors shadow-glow-green-sm"
//                   >
//                     Log in to Integer Market <ArrowRight size={15} />
//                   </motion.button>
//                   <p className="text-center text-sm text-slate-400 mt-5">
//                     Don't have an account?{' '}
//                     <button onClick={() => setTab('signup')} className="text-brand-600 font-semibold hover:underline">Sign up — it's free</button>
//                   </p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   )
// }

'use client';

import React from 'react';
import { Pencil, ShieldCheck, MoreVertical, Trash2, CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [isAutoRenewal, setIsAutoRenewal] = React.useState(true);

    const toggleMenu = (id: string) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClick = () => setActiveMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="mx-auto space-y-4 pb-10">
            {/* Header Section */}
            <div className="mb-2">
                <h1 className="text-[24px] font-medium text-[#2e2e37] font-inter leading-[32px] tracking-[0%]">Settings</h1>
                <p className="text-[14px] font-normal text-[#737379] font-inter leading-[20px] tracking-[0%]">
                    Manage your corporate profile, enterprise subscription, and billing infrastructure.
                </p>
            </div>

            {/* Profile Settings Card */}
            <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm overflow-hidden">
                <div className="p-[16px] space-y-4">
                    <h2 className="text-[18px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Profile Settings</h2>

                    <div className="flex items-center gap-10">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-[64px] h-[64px] rounded-full overflow-hidden border-2 border-white shadow-md">
                                <Image
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                                    alt="Profile"
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
                                <Pencil size={14} />
                            </button>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Alexander Sterling"
                                    className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Work Email</label>
                                <input
                                    type="email"
                                    defaultValue="alexander@nexusfintech.io"
                                    className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%]">
                                Account Password
                            </h3>
                            <p className="text-[12px] font-normal text-[#64748b] font-inter leading-[16px] tracking-[0%]">Last changed 3 months ago</p>
                        </div>
                        <button className="w-[164px] h-[36px] px-[10px] py-[4px] rounded-[8px] border border-[#e2e8f0] bg-white text-[14px] font-medium text-[#64748b] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Masonry Style with Bottom Alignment */}
            <div className="grid grid-cols-3 gap-4 items-stretch">
                {/* Left Column (2/3) */}
                <div className="col-span-2 flex flex-col gap-4">
                    {/* Company Settings */}
                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden h-fit">
                        <div className="p-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h2 className="text-[18px] font-bold text-[#1e293b] font-inter">Company Settings</h2>
                                <p className="text-[13px] text-slate-400 font-inter">Configure multiple entity identities and regional preferences.</p>
                            </div>
                            <button
                                className="flex items-center justify-center gap-[6px] w-[140px] h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-normal text-[#f8fafc] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98]"
                            >
                                <span className="text-[18px] leading-none">+</span> Add Company
                            </button>
                        </div>
                        <div className="mx-4 h-px bg-slate-100" />
                        <div className="p-4 space-y-3">
                            <div className="h-[90px] p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex items-center justify-between group relative">
                                <div className="flex items-center gap-5">
                                    <div className="w-[48px] h-[48px] bg-[#1d4ed8] rounded-[4px] flex items-center justify-center text-white font-bold text-[16px] font-inter shadow-md">EA</div>
                                    <div className="space-y-1">
                                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px]">Executive Architectural HQ</h3>
                                        <p className="text-[14px] font-normal text-[#64748b] font-inter">New York, NY</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1.5 bg-[#2563eb] text-white text-[10px] font-bold rounded-[8px] font-inter tracking-wider shadow-sm">PRIMARY</span>
                                    <MoreVertical size={20} className="text-slate-300" />
                                </div>
                            </div>
                            <div className="h-[90px] p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex items-center justify-between group relative">
                                <div className="flex items-center gap-5">
                                    <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-[4px] flex items-center justify-center text-[#1e293b] font-bold text-[16px] font-inter shadow-sm">LD</div>
                                    <div className="space-y-1">
                                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px]">London Design Studio</h3>
                                        <p className="text-[14px] font-normal text-[#64748b] font-inter">Regional Subsidiary • London, UK</p>
                                    </div>
                                </div>
                                <MoreVertical size={20} className="text-slate-300" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden h-fit">
                        <div className="p-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h2 className="text-[18px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Payment Details and Billing Info</h2>
                                <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%]">Update your payment methods and view recent transactions.</p>
                            </div>
                            <button className="flex items-center justify-center gap-[6px] w-[135px] h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-normal text-[#f8fafc] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98]">
                                <span className="text-[18px] leading-none">+</span> Add Payment
                            </button>
                        </div>
                        <div className="mx-4 h-px bg-slate-100" />
                        <div className="p-5">
                            <div className="bg-[#f8fafc] p-5 rounded-[12px] border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className="w-[44px] h-[44px] bg-[#2563eb] rounded-[6px] flex items-center justify-center text-white shadow-sm">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-2 text-[18px] font-bold text-[#0f172a] tracking-[4px]">
                                                <span>●●●●</span><span>●●●●</span><span>●●●●</span>
                                            </div>
                                            <span className="text-[18px] font-medium text-[#0f172a] font-inter">5698</span>
                                        </div>
                                        <div className="flex items-center gap-16">
                                            <span className="text-[13px] font-normal text-[#94a3b8] font-inter uppercase">EXP 12/28</span>
                                            <span className="text-[13px] font-normal text-[#94a3b8] font-inter uppercase">VISA BUSINESS</span>
                                        </div>
                                    </div>
                                </div>
                                <MoreVertical size={20} className="text-slate-300" />
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings - Fills remaining space */}
                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-[16px] flex-grow">
                        <h2 className="text-[18px] pb-2 font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Notification Settings</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Email notifications', desc: 'Receive system updates and feature announcements', active: true },
                                { title: 'Alerts for financial risks', desc: 'Real-time push notifications for liquidity or budget issues', active: true },
                                { title: 'Weekly summary reports', desc: 'Automated executive summary delivered every Monday', active: false }
                            ].map((setting, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%]">{setting.title}</h3>
                                        <p className="text-[12px] font-normal text-[#64748b] font-inter leading-[16px] tracking-[0%]">{setting.desc}</p>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${setting.active ? 'bg-[#2563eb]' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${setting.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="col-span-1 flex flex-col gap-4">
                    {/* Subscription Card */}
                    <div className="bg-[#2563eb] rounded-[16px] p-[16px] text-white flex flex-col shadow-lg shadow-blue-200 h-fit">
                        <p className="text-[16px] font-normal text-white font-inter leading-[24px]">Current running subscription</p>
                        <div className="h-px bg-white/20 w-full mt-4" />
                        <div className=" mt-2  mb-2">
                            <div className="flex items-baseline gap-1 mb-2">
                                <h2 className="text-[36px] font-extrabold font-manrope leading-[40px]">Enterprise</h2>
                                <span className="text-[16px] font-extrabold font-manrope text-white/90">/yearly</span>
                            </div>
                            <div className="flex items-center mt-4 justify-between text-[12px]">
                                <span className="opacity-80 font-inter">Renewal Date</span>
                                <span className="font-semibold font-inter">Oct 12, 2024</span>
                            </div>
                        </div>
                        <div className="space-y-4 mb-3">
                            <div className="space-y-2">
                                <div className="w-full h-[10px] bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-white rounded-full"></div>
                                </div>
                                <p className="text-[13px] opacity-90 font-inter">85% of term completed</p>
                            </div>
                            <div className="h-px bg-white/10 w-full" />
                            <div className="flex items-center justify-between ">
                                <span className="text-[15px] font-medium font-inter">Auto Renewal</span>
                                <div
                                    onClick={() => setIsAutoRenewal(!isAutoRenewal)}
                                    className={`w-11 h-6 rounded-full relative p-1 cursor-pointer transition-all ${isAutoRenewal ? 'bg-[#22c55e]' : 'bg-white/20 shadow-inner'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${isAutoRenewal ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <div className="h-px bg-white/10 w-full" />
                        </div>
                        <button className="w-full h-[36px] bg-white border border-slate-100 rounded-[8px] text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)]">Manage Plan</button>
                    </div>

                    {/* Subscription Upgrade Details */}
                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-[16px] space-y-6 h-fit">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><ShieldCheck size={18} /></div>
                            <h2 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Subscription Upgrade Details</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: 'Global Custom API', desc: 'Direct integration into BIM and ERP systems.' },
                                { title: 'Unlimited Regional Hubs', desc: 'No cap on company entities or international desks.' },
                                { title: 'Premium Support Tier', desc: '24/7 dedicated architectural consultancy support.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1 text-blue-500"><CheckCircle2 size={16} /></div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%]">{item.title}</h3>
                                        <p className="text-[12px] font-normal text-[#64748b] font-inter leading-[16px] tracking-[0%]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98] self-center">
                            Upgrade now
                        </button>
                    </div>

                    {/* Danger Zone - Fills remaining space */}
                    <div className="h-[182px] bg-[#fef2f2] rounded-[12px] border border-[#fecaca] p-[20px] flex flex-col justify-between flex-grow">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertTriangle size={18} />
                                <h2 className="text-[14px] font-medium text-[#eb5757] font-inter leading-[20px] tracking-[0%]">Danger Zone</h2>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0px]">Delete your workspace permanently.</h3>
                                <p className="text-[12px] font-normal text-[#eb5757] font-inter leading-[16px] tracking-[0%]">
                                    This action will erase all historical data, financial insights, and connected accounts. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-1 h-[36px] px-[24px] py-[10px] bg-[#eb5757] rounded-[8px] text-[14px] font-bold text-white font-inter leading-[20px] tracking-[0px] shadow-sm hover:bg-red-600 transition-all flex items-center justify-center">
                            Delete Workspace
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

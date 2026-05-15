'use client';

import React from 'react';
import { Pencil, ShieldCheck, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

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
        <div className="mx-auto space-y-8">
            {/* Header Section */}
            <div className="">
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
                                    className="w-[460px] h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Work Email</label>
                                <input
                                    type="email"
                                    defaultValue="alexander@nexusfintech.io"
                                    className="w-[460px] h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
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

            {/* Company & Subscription Grid */}
            <div className="grid grid-cols-3 gap-4 items-start">
                {/* Company Settings */}
                <div className="col-span-2 bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
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
                        {/* Company Item 1 */}
                        <div className="h-[90px] p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex items-center justify-between group relative">
                            <div className="flex items-center gap-5">
                                <div className="w-[48px] h-[48px] bg-[#1d4ed8] rounded-[4px] flex items-center justify-center text-white font-bold text-[16px] font-inter shadow-md">
                                    EA
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Executive Architectural HQ</h3>
                                    <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%]">New York, NY</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1.5 bg-[#2563eb] text-white text-[10px] font-bold rounded-[8px] font-inter tracking-wider shadow-sm">PRIMARY</span>
                                <div className="relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMenu('ea'); }}
                                        className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {activeMenu === 'ea' && (
                                        <div className="absolute right-0 top-8 w-[180px] h-[73px] bg-white rounded-[8px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex flex-col overflow-hidden">
                                            <button className="flex-1 px-4 flex items-center gap-3 text-[14px] text-[#64748b] font-inter hover:bg-slate-50 transition-colors group/item">
                                                <Trash2 size={14} className="text-slate-400 group-hover/item:text-red-500 transition-colors" /> Delete
                                            </button>
                                            <div className="h-px bg-slate-100 mx-2" />
                                            <button className="flex-1 px-4 flex items-center gap-3 text-[14px] text-[#64748b] font-inter hover:bg-slate-50 transition-colors group/item">
                                                <Pencil size={14} className="text-slate-400 group-hover/item:text-blue-500 transition-colors" /> Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Company Item 2 */}
                        <div className="h-[90px] p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex items-center justify-between group relative">
                            <div className="flex items-center gap-5">
                                <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-[4px] flex items-center justify-center text-[#1e293b] font-bold text-[16px] font-inter shadow-sm">
                                    LD
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">London Design Studio</h3>
                                    <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%]">Regional Subsidiary • London, UK</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMenu('ld'); }}
                                        className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {activeMenu === 'ld' && (
                                        <div className="absolute right-0 top-8 w-[180px] h-[73px] bg-white rounded-[8px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex flex-col overflow-hidden">
                                            <button className="flex-1 px-4 flex items-center gap-3 text-[14px] text-[#64748b] font-inter hover:bg-slate-50 transition-colors group/item">
                                                <Trash2 size={14} className="text-slate-400 group-hover/item:text-red-500 transition-colors" /> Delete
                                            </button>
                                            <div className="h-px bg-slate-100 mx-2" />
                                            <button className="flex-1 px-4 flex items-center gap-3 text-[14px] text-[#64748b] font-inter hover:bg-slate-50 transition-colors group/item">
                                                <Pencil size={14} className="text-slate-400 group-hover/item:text-blue-500 transition-colors" /> Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className="col-span-1 bg-[#2563eb] rounded-[16px] p-[16px] text-white flex flex-col shadow-lg shadow-blue-200">
                    <p className="text-[16px] font-normal text-white font-inter leading-[24px] tracking-[0%] ">Current running subscription</p>

                    <div className="border-b border-white/20 pb-6 ">
                        <div className="flex items-baseline gap-1 mb-2">
                            <h2 className="text-[36px] font-extrabold font-manrope tracking-tight text-white leading-[40px]">Enterprise</h2>
                            <span className="text-[16px] font-extrabold font-manrope text-white/90 leading-[40px]">/yearly</span>
                        </div>
                        <div className="flex items-center justify-between text-[12px]">
                            <span className="opacity-80 font-inter">Renewal Date</span>
                            <span className="font-semibold font-inter">Oct 12, 2024</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-5">
                        <div className="space-y-2">
                            <div className="w-full h-[10px] bg-white/20 rounded-full overflow-hidden">
                                <div className="w-[85%] h-full bg-white rounded-full"></div>
                            </div>
                            <p className="text-[13px] opacity-90 font-inter">85% of term completed</p>
                        </div>

                        {/* Line above Auto Renewal */}
                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex items-center justify-between ">
                            <span className="text-[15px] font-medium font-inter">Auto Renewal</span>
                            <div className="w-11 h-6 bg-[#22c55e] rounded-full relative p-1 cursor-pointer shadow-inner">
                                <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>

                        {/* Line below Auto Renewal */}
                        <div className="h-px bg-white/10 w-full" />
                    </div>

                    <button className="w-full h-[36px] px-[12px]  bg-white border border-slate-100 rounded-[8px] text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-slate-50 transition-all mt-auto self-center">
                        Manage Plan
                    </button>
                </div>
            </div>
        </div>
    );
}

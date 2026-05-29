'use client';

import React from 'react';
import { Pencil, ShieldCheck, MoreVertical, Trash2, CreditCard, CheckCircle2, AlertTriangle, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/common/Modal';
import { dispatch, useSelector } from '@/store';
import { updatePassword, hasActionError } from '@/store/slices/auth';
import { updateProfileUser, getUserProfile, hasActionError as hasUserActionError } from '@/store/slices/user';
import { ErrorAlert } from '@/components/common/errorMessage';
import { getImageUrl } from '@/utils/common';

const isValidSrc = (src: any): boolean => {
    if (typeof src !== 'string') return false;
    const trimmed = src.trim();
    return trimmed !== '' && trimmed !== 'null' && trimmed !== 'undefined' && trimmed !== '{}';
};

export default function SettingsPage() {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [isAutoRenewal, setIsAutoRenewal] = React.useState(true);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = React.useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
    const [notifications, setNotifications] = React.useState([
        { id: 'email', title: 'Email notifications', desc: 'Receive system updates and feature announcements', active: true },
        { id: 'risks', title: 'Alerts for financial risks', desc: 'Real-time push notifications for liquidity or budget issues', active: true },
        { id: 'weekly', title: 'Weekly summary reports', desc: 'Automated executive summary delivered every Monday', active: false }
    ]);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({});
    const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);

    const [profileData, setProfileData] = React.useState({
        name: '',
        email: '',
        profilePic: ''
    });
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);

    const { actionLoading: authActionLoading, actionError } = useSelector((state) => state.auth);
    const { actionLoading: userActionLoading, actionError: userActionError, userData } = useSelector((state) => state.user);

    React.useEffect(() => {
        dispatch(getUserProfile());
    }, []);

    React.useEffect(() => {
        if (userData) {
            setProfileData({
                name: userData.name || '',
                email: userData.email || '',
                profilePic: userData.profilePic || ''
            });
        }
    }, [userData]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profilePic: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setProfileSuccess(null);
        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('email', profileData.email);
        if (selectedFile) {
            formData.append('profilePic', selectedFile);
        }
        dispatch(updateProfileUser(
            formData,
            () => {
                setProfileSuccess('Profile updated successfully!');
                setSelectedFile(null);
                setTimeout(() => {
                    setProfileSuccess(null);
                }, 3000);
            }
        ));
    };

    const handlePasswordSubmit = async () => {
        const errors: Record<string, string> = {};
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        setPasswordSuccess(null);
        dispatch(updatePassword(
            {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            },
            () => {
                setPasswordSuccess('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordSuccess(null);
                }, 2000);
            }
        ));
    };

    const toggleNotification = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, active: !n.active } : n));
    };

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

                    {/* Success Message */}
                    {profileSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-emerald-700 text-[14px]">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                            <span>{profileSuccess}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {userActionError && (
                        <ErrorAlert
                            error={userActionError}
                            onDismiss={() => dispatch(hasUserActionError(null))}
                        />
                    )}

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        {/* Avatar Section */}
                        <div className="relative group shrink-0">
                            <div className="w-[64px] h-[64px] rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-400 font-bold font-inter text-[24px]">
                                {isValidSrc(profileData.profilePic) ? (
                                    <img
                                        src={getImageUrl(profileData.profilePic) as string}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    profileData.name ? profileData.name.trim().charAt(0).toUpperCase() : 'M'
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors"
                            >
                                <Pencil size={14} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Form Section */}
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Work Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-inter text-[14px] text-[#0f172a]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%]">
                                Account Password
                            </h3>
                            <p className="text-[12px] font-normal text-[#64748b] font-inter leading-[16px] tracking-[0%]">Last changed 3 months ago</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full sm:w-auto px-[16px] h-[36px] rounded-[8px] border border-[#e2e8f0] bg-white text-[14px] font-medium text-[#64748b] font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={userActionLoading}
                                className="w-full sm:w-auto px-[16px] h-[36px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                            >
                                {userActionLoading && (
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                )}
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Masonry Style with Bottom Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">

                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-fit relative">
                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h2 className="text-[18px] font-bold text-[#1e293b] font-inter">Company Settings</h2>
                                <p className="text-[13px] text-slate-400 font-inter max-w-[300px]">Configure multiple entity identities and regional preferences.</p>
                            </div>
                            <button
                                onClick={() => setIsCompanyModalOpen(true)}
                                className="flex items-center justify-center gap-[6px] w-full sm:w-[140px] h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-normal text-[#f8fafc] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98] shrink-0"
                            >
                                <span className="text-[18px] leading-none">+</span> Add Company
                            </button>
                        </div>
                        <div className="mx-4 h-px bg-slate-100" />
                        <div className="p-4 space-y-3">
                            <div className="min-h-[90px] p-[16px] sm:p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative">
                                <div className="flex items-center gap-5">
                                    <div className="w-[48px] h-[48px] bg-[#1d4ed8] rounded-[4px] flex items-center justify-center text-white font-bold text-[16px] font-inter shadow-md shrink-0">EA</div>
                                    <div className="space-y-1">
                                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px]">Executive Architectural HQ</h3>
                                        <p className="text-[14px] font-normal text-[#64748b] font-inter">New York, NY</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                    <span className="px-3 py-1.5 bg-[#2563eb] text-white text-[10px] font-bold rounded-[8px] font-inter tracking-wider shadow-sm">PRIMARY</span>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleMenu('company-1'); }}
                                            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                                        >
                                            <MoreVertical size={20} />
                                        </button>
                                        {activeMenu === 'company-1' && (
                                            <div className="absolute right-0 top-full mt-2 w-[160px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-1">
                                                <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-[#0f172a] hover:bg-slate-50 transition-colors">
                                                    <Pencil size={16} className="text-slate-400" />
                                                    <span>Edit</span>
                                                </button>
                                                <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={16} className="text-red-400" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="min-h-[90px] p-[16px] sm:p-[20px] bg-[#f6f8fa] rounded-[8px] border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative">
                                <div className="flex items-center gap-5">
                                    <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-[4px] flex items-center justify-center text-[#1e293b] font-bold text-[16px] font-inter shadow-sm shrink-0">LD</div>
                                    <div className="space-y-1">
                                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px]">London Design Studio</h3>
                                        <p className="text-[14px] font-normal text-[#64748b] font-inter">Regional Subsidiary • London, UK</p>
                                    </div>
                                </div>
                                <div className="relative self-end sm:self-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMenu('company-2'); }}
                                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {activeMenu === 'company-2' && (
                                        <div className="absolute right-0 top-full mt-2 w-[160px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-1">
                                            <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-[#0f172a] hover:bg-slate-50 transition-colors">
                                                <Pencil size={16} className="text-slate-400" />
                                                <span>Edit</span>
                                            </button>
                                            <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={16} className="text-red-400" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-fit relative">
                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h2 className="text-[18px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Payment Details and Billing Info</h2>
                                <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%] max-w-[400px]">Update your payment methods and view recent transactions.</p>
                            </div>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="flex items-center justify-center gap-[6px] w-full sm:w-[135px] h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-normal text-[#f8fafc] font-inter leading-[20px] tracking-[0%] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98] shrink-0"
                            >
                                <span className="text-[18px] leading-none">+</span> Add Payment
                            </button>
                        </div>
                        <div className="mx-4 h-px bg-slate-100" />
                        <div className="p-5">
                            <div className="bg-[#f8fafc] p-4 sm:p-5 rounded-[12px] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="w-[44px] h-[44px] bg-[#2563eb] rounded-[6px] flex items-center justify-center text-white shadow-sm shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2 sm:gap-8 overflow-hidden">
                                            <div className="flex items-center gap-1 sm:gap-2 text-[14px] sm:text-[18px] font-bold text-[#0f172a] tracking-[2px] sm:tracking-[4px] shrink-0">
                                                <span>●●●●</span><span>●●●●</span><span>●●●●</span>
                                            </div>
                                            <span className="text-[14px] sm:text-[18px] font-medium text-[#0f172a] font-inter shrink-0">5698</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-16">
                                            <span className="text-[11px] sm:text-[13px] font-normal text-[#94a3b8] font-inter uppercase whitespace-nowrap">EXP 12/28</span>
                                            <span className="text-[11px] sm:text-[13px] font-normal text-[#94a3b8] font-inter uppercase whitespace-nowrap">VISA BUSINESS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMenu('payment-1'); }}
                                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {activeMenu === 'payment-1' && (
                                        <div className="absolute right-0 top-full mt-2 w-[160px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-1">
                                            <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-[#0f172a] hover:bg-slate-50 transition-colors">
                                                <Pencil size={16} className="text-slate-400" />
                                                <span>Edit</span>
                                            </button>
                                            <button className="w-full px-4 py-2 flex items-center gap-3 text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={16} className="text-red-400" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-[20px] flex-grow">
                        <h2 className="text-[18px] pb-4 font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%] border-b border-slate-50 mb-6">Notification Settings</h2>
                        <div className="space-y-8">
                            {notifications.map((setting) => (
                                <div key={setting.id} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="text-[14px] font-medium text-[#0f172a] font-inter leading-[20px] tracking-[0%]">{setting.title}</h3>
                                        <p className="text-[12px] font-normal text-[#64748b] font-inter leading-[16px] tracking-[0%]">{setting.desc}</p>
                                    </div>
                                    <div
                                        onClick={() => toggleNotification(setting.id)}
                                        className={`w-11 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${setting.active ? 'bg-[#2563eb]' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${setting.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
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
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full mt-1 h-[36px] px-[24px] py-[10px] bg-[#eb5757] rounded-[8px] text-[14px] font-bold text-white font-inter leading-[20px] tracking-[0px] shadow-sm hover:bg-red-600 transition-all flex items-center justify-center"
                        >
                            Delete Workspace
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Company Modal */}
            <Modal
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
                width="450px"
                className="rounded-[24px]"
            >
                <div className="p-[16px]  space-y-2">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-[24px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Add New Company Details</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Company Name</label>
                            <input
                                type="text"
                                placeholder="Nexus FinTech Global"
                                className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Industry Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Industry</label>
                            <div className="relative group w-full">
                                <select className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
                                    <option>Technology & SaaS</option>
                                    <option>Architecture & Design</option>
                                    <option>Financial Services</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                            </div>
                        </div>

                        {/* Currency Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Currency</label>
                            <div className="relative group w-full">
                                <select className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
                                    <option>USD - US Dollar</option>
                                    <option>GBP - British Pound</option>
                                    <option>EUR - Euro</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pt-2">
                        <button
                            onClick={() => setIsCompanyModalOpen(false)}
                            className=" w-full h-[36px] px-[12px] py-[4px] bg-white border border-[#e2e8f0] rounded-[8px] text-[14px] font-medium text-[#64748b] font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            className="w-full h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98]"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                width="450px"
                className="rounded-[24px]"
            >
                <div className="p-[16px] space-y-2">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-[24px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Add Payment Details</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Cardholder Name */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Cardholder name</label>
                            <input
                                type="text"
                                placeholder="Johnson"
                                className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Card Details Group */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Card Details</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Enter card"
                                    className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Address Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Billing Address</label>
                            <div className="relative group w-full">
                                <select className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Canada</option>
                                    <option>Germany</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pt-2">
                        <button
                            onClick={() => setIsPaymentModalOpen(false)}
                            className=" w-full h-[36px] px-[12px] py-[4px] bg-white border border-[#e2e8f0] rounded-[8px] text-[14px] font-medium text-[#64748b] font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            className="w-full h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98]"
                        >
                            Add card
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Workspace Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                width="440px"
                className="rounded-[24px]"
            >
                <div className="p-[22px] flex flex-col items-center text-center">
                    {/* Danger Icon */}
                    <div className="w-[64px] h-[64px] bg-[#eb5757] rounded-[16px] flex items-center justify-center text-white mb-4 shadow-lg shadow-red-100">
                        <Trash2 size={32} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-4">
                        <h2 className="text-[24px] font-bold text-[#1e293b] font-inter">Delete Workspace?</h2>
                        <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[22px]">
                            Are you sure you want to delete this workspace? All financial data and AI models associated with <span className="font-semibold text-slate-800">Nexus FinTech Global</span> will be permanently removed.
                        </p>
                    </div>

                    {/* Confirmation Input */}
                    <div className="w-full space-y-2 mb-8 text-left">
                        <label className="text-[12px] font-medium text-[#2e2e37] font-inter">To confirm please type a delete below</label>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Delete"
                            className="w-full h-[44px] px-[12px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-slate-300"
                        />
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        <button
                            disabled={deleteConfirmation.toLowerCase() == 'delete'}
                            className={`w-full h-[40px] px-[12px] py-[4px] rounded-[8px] text-[14px] font-bold text-white font-inter leading-[20px] shadow-sm transition-all ${deleteConfirmation.toLowerCase() === 'delete'
                                ? 'bg-[#eb5757] hover:bg-red-600'
                                : 'bg-red-300 cursor-not-allowed opacity-70'
                                }`}
                        >
                            Delete Workspace
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full h-[40px] px-[12px] py-[4px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[14px] font-medium text-[#64748b] font-inter leading-[20px] hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                    setPasswordSuccess(null);
                    dispatch(hasActionError(null));
                }}
                width="450px"
                className="rounded-[24px]"
            >
                <div className="p-[16px] space-y-4">
                    {/* Header */}
                    <div className="text-center space-y-1">
                        <h2 className="text-[24px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Change Account Password</h2>
                        <p className="text-[13px] text-slate-400 font-inter">Ensure your account stays secure by choosing a strong password.</p>
                    </div>

                    {/* Success Message */}
                    {passwordSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-emerald-700 text-[14px]">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                            <span>{passwordSuccess}</span>
                        </div>
                    )}

                    {/* Redux Action Error */}
                    {actionError && (
                        <ErrorAlert
                            error={actionError}
                            onDismiss={() => dispatch(hasActionError(null))}
                        />
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                                    setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                                }}
                                placeholder="••••••••"
                                className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-red-500 text-[11px] font-inter">{passwordErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                                    setPasswordErrors({ ...passwordErrors, newPassword: '' });
                                }}
                                placeholder="••••••••"
                                className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-red-500 text-[11px] font-inter">{passwordErrors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-normal text-[#2e2e37] font-inter leading-[16px] tracking-[0%]">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                    setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                                }}
                                placeholder="••••••••"
                                className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white font-inter text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="text-red-500 text-[11px] font-inter">{passwordErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pt-2">
                        <button
                            onClick={() => {
                                setIsPasswordModalOpen(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setPasswordErrors({});
                                setPasswordSuccess(null);
                                dispatch(hasActionError(null));
                            }}
                            className="w-full h-[36px] px-[12px] py-[4px] bg-white border border-[#e2e8f0] rounded-[8px] text-[14px] font-medium text-[#64748b] font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePasswordSubmit}
                            disabled={authActionLoading}
                            className="w-full h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {authActionLoading && (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            )}
                            Update Password
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

import Modal from '@/components/common/Modal';
import React, { useEffect, useState } from 'react';
import { } from '@/types';
import { Company } from '@/types/company';
import { ChevronDown } from 'lucide-react';
import { useDispatch } from '@/store';
import { IndustryEnum, IndustryToSubIndustryMap, formatIndustryName } from '@/config/industryConfig';
import { createCompany, updateCompany } from '@/store/slices/company';

interface AddEditClientProps {
    isOpen: boolean;
    handleClose: () => void;
    companyData?: any;
}

function AddcompanyModal({ isOpen, handleClose, companyData }: AddEditClientProps) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<any>({
        name: '',
        industry: IndustryEnum.TECHNOLOGY_AND_IT,
        subIndustry: IndustryToSubIndustryMap[IndustryEnum.TECHNOLOGY_AND_IT][0],
        currency: 'usd',
        isPrimary: false,
        financialYearType: 'apr_to_mar',
    })
    useEffect(() => {
        if (isOpen) {
            if (companyData) {
                setFormData({
                    name: companyData.name || '',
                    industry: companyData.industry || IndustryEnum.TECHNOLOGY_AND_IT,
                    subIndustry: companyData.subIndustry || IndustryToSubIndustryMap[companyData.industry || IndustryEnum.TECHNOLOGY_AND_IT]?.[0] || '',
                    currency: companyData.currency || 'usd',
                    isPrimary: companyData.isPrimary || false,
                    financialYearType: companyData.financialYearType || 'apr_to_mar',
                });
            } else {
                setFormData({
                    name: '',
                    industry: IndustryEnum.TECHNOLOGY_AND_IT,
                    subIndustry: IndustryToSubIndustryMap[IndustryEnum.TECHNOLOGY_AND_IT][0],
                    currency: 'usd',
                    isPrimary: false,
                    financialYearType: 'apr_to_mar',
                });
            }
        }
    }, [companyData, isOpen]);

    const handleClear = () => {
        setFormData({
            name: '',
            industry: IndustryEnum.TECHNOLOGY_AND_IT,
            subIndustry: IndustryToSubIndustryMap[IndustryEnum.TECHNOLOGY_AND_IT][0],
            currency: 'usd',
            isPrimary: false,
            financialYearType: 'apr_to_mar',
        });
        handleClose()
    }

    const handleAddCompany = () => {
        if (companyData) {
            dispatch(updateCompany(companyData._id, formData, handleClear));
        } else {
            dispatch(createCompany(formData, handleClear));
        }
    }

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="450px"
            className="rounded-[24px]"
        >
            <div className="p-[16px]  space-y-2">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-[24px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
                        {companyData ? 'Edit Company Details' : 'Add New Company Details'}
                    </h2>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Company Name</label>
                        <input
                            type="text"
                            placeholder="Nexus FinTech Global"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full h-[40px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                        />
                    </div>

                    {/* Industry Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Industry</label>
                        <div className="relative group w-full">
                            <select
                                value={formData.industry}
                                onChange={(e) => {
                                    const newIndustry = e.target.value;
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        industry: newIndustry,
                                        subIndustry: IndustryToSubIndustryMap[newIndustry]?.[0] || ''
                                    }));
                                }}
                                className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                {Object.values(IndustryEnum).map((industryVal) => (
                                    <option key={industryVal} value={industryVal}>
                                        {formatIndustryName(industryVal)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Sub-Industry Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Sub-Industry</label>
                        <div className="relative group w-full">
                            <select
                                value={formData.subIndustry}
                                onChange={(e) => handleChange('subIndustry', e.target.value)}
                                className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                                disabled={!formData.industry || !IndustryToSubIndustryMap[formData.industry]}
                            >
                                {formData.industry && IndustryToSubIndustryMap[formData.industry]?.map((subInd) => (
                                    <option key={subInd} value={subInd.toLowerCase().replace(/[\s&-]+/g, '_')}>
                                        {subInd}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Currency Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Currency</label>
                        <div className="relative group w-full">
                            <select
                                value={formData.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="usd">USD - US Dollar</option>
                                <option value="inr">INR - Indian Rupee</option>
                                <option value="eur">EUR - Euro</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Financial Year Type Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Financial Year Type</label>
                        <div className="relative group w-full">
                            <select
                                value={formData.financialYearType}
                                onChange={(e) => handleChange('financialYearType', e.target.value)}
                                className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="jan_to_dec">1 Jan to 31 Dec</option>
                                <option value="apr_to_mar">1 April to 31 March</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Primary Status Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-normal text-[#2e2e37] dark:text-slate-300 font-inter leading-[16px] tracking-[0%]">Set as Primary</label>
                        <div className="relative group w-full">
                            <select
                                value={formData.isPrimary ? "true" : "false"}
                                onChange={(e) => handleChange('isPrimary', e.target.value === "true")}
                                className="w-full h-[40px] px-[10px] py-[8px] appearance-none rounded-[8px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 font-inter text-[14px] text-[#0f172a] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="false">No (Subsidiary Entity)</option>
                                <option value="true">Yes (Primary Account Workspace)</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3 pt-2">
                    <button
                        onClick={handleClose}
                        className=" w-full h-[36px] px-[12px] py-[4px] bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 rounded-[8px] text-[14px] font-medium text-[#64748b] dark:text-slate-300 font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddCompany}
                        className="w-full h-[36px] px-[12px] py-[4px] bg-[#2563eb] border border-white/20 rounded-[8px] text-[14px] font-medium text-white font-inter leading-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] hover:bg-blue-600 transition-all active:scale-[0.98]"
                    >
                        {companyData ? 'Save' : 'Add'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default AddcompanyModal
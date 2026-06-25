"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import Modal from "../common/Modal";

export default function WorkspaceModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get('modal');

  const isOpen = modalParam === 'workspace';
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    currency: 'USD $'
  });

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    router.push(`?${params.toString()}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} height="406px" width="398px" className="!bg-white dark:!bg-white !border-slate-200 dark:!border-slate-200">
      <div className="px-8 h-full flex flex-col relative" style={{ fontFamily: "'Inter', sans-serif" }}>


        <div className="text-center mb-4">
          <h2 className="text-[#0f172a] font-inter font-medium text-[24px] leading-[32px] text-center">
            Set Up Your Workspace
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-500 mt-2 text-center">
            Add your company details to get started
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 flex-1">
          {/* Company Name */}
          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">
              Company Name*
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-[334px] h-[38px] px-[10px] py-[8px] border border-slate-200 rounded-[8px] text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-300 transition-all shadow-sm"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">
              Industry*
            </label>
            <div className="relative w-[334px]">
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full h-[38px] px-[10px] py-[8px] border border-slate-200 rounded-[8px] text-[14px] focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer shadow-sm text-slate-600"
              >
                <option value="" disabled>Select Industry</option>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">
              Currency*
            </label>
            <div className="relative w-[334px]">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full h-[38px] px-[10px] py-[8px] border border-slate-200 rounded-[8px] text-[14px] focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer shadow-sm text-slate-600"
              >
                <option value="USD $">USD $</option>
                <option value="EUR €">EUR €</option>
                <option value="INR ₹">INR ₹</option>
                <option value="GBP £">GBP £</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => console.log("Workspace Data:", formData)}
            className="w-[334px] h-[36px] bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-[14px] leading-[20px] rounded-[8px] px-[12px] py-[4px] font-inter transition-all active:scale-[0.98]  shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}

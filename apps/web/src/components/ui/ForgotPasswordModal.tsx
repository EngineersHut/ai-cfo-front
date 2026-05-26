"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Key, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Modal from "../common/Modal";

type ForgotMode = 'email' | 'reset' | 'success';

interface ForgotPasswordModalProps {
  // Managed via URL
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ForgotPasswordModal({ }: ForgotPasswordModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get('modal');

  const isOpen = modalParam === 'forgot-password';
  const [mode, setMode] = useState<ForgotMode>('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    router.push(`?${params.toString()}`);
    // Reset mode for next time
    setTimeout(() => setMode('email'), 300);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (mode === 'email') setMode('reset');
    else if (mode === 'reset') setMode('success');
    else {
      handleClose();
    }
  };

  const getModalDimensions = () => {
    switch (mode) {
      case 'email': return { width: "343px", height: "278px" };
      case 'reset': return { width: "343px", height: "352px" };
      case 'success': return { width: "400px", height: "300px" };
      default: return { width: "343px", height: "auto" };
    }
  };

  if (!isOpen) return null;

  const { width, height } = getModalDimensions();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} height={height} width={width}>
      <div className="px-8 h-full flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Success Icon */}
        {mode === 'success' && (
          <div className="flex justify-center mb-6 ">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 overflow-hidden shadow-sm">
              <Image
                src="/Logomark.png"
                alt="Success"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-[#0f172a] font-inter font-medium text-[24px] leading-[32px] text-center">
            {mode === 'email' ? "Forgot password" : mode === 'reset' ? "Create New password" : "Reset Password Successfully"}
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-400 mt-2 text-center">
            {mode === 'email' ? "Kindly provide your email address to initiate a password reset request." :
              mode === 'reset' ? "Create a password with letters and numbers." :
                "Your password has been successfully changed."}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 flex-1">
          {mode === 'email' && (
            <div>
              <label className="block font-inter font-normal text-[12px] text-slate-600 mb-1.5 ml-0.5">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><AtSign size={18} strokeWidth={1.8} /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ahmad.account@gmail.com" className="w-full h-[38px] border border-slate-200 rounded-[8px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm" />
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block font-inter font-normal text-[12px] text-slate-600 mb-1.5 ml-0.5">Password *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" className="w-full h-[38px] border border-slate-200 rounded-[8px] pl-11 pr-12 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-inter font-normal text-[12px] text-slate-600 mb-1.5 ml-0.5">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••••••" className="w-full h-[38px] border border-slate-200 rounded-[8px] pl-11 pr-12 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm" />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <button onClick={handleContinue} className="w-full h-[36px] bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-[14px] rounded-[8px] transition-all active:scale-[0.98] shadow-sm">
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}

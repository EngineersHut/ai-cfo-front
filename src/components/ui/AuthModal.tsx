"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { AtSign, Key, Eye, EyeOff } from "lucide-react";
import Modal from "../common/Modal";

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

interface FormData {
  email: string;
  password: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login'
}: AuthModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (): void => {
    console.log("Auth Payload:", formData);
    // Add your login logic here
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} height="488px" width="398px">
      <div className="px-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div className="text-center ">
          <h2 className="text-[#0f172a] font-medium text-[24px] leading-[32px] tracking-normal text-center font-inter">
            Welcome to <span className="text-[#2563eb]">North Quest Solution</span>
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-400 mt-2 text-center">
            Enter your email and password to Login
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 pt-3">
          {/* Email */}
          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <AtSign size={18} strokeWidth={1.8} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ahmad.account@gmail.com"
                className="w-full h-[38px] bg-white border border-slate-200 rounded-[8px] pl-11 pr-[10px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Key size={18} strokeWidth={1.8} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full h-[38px] bg-white border border-slate-200 rounded-[8px] pl-11 pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full h-[36px] bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-[14px] leading-[20px] rounded-[8px] px-[12px] py-[4px] font-inter transition-all active:scale-[0.98] mt-2 shadow-sm"
          >
            Continue
          </button>

          {/* Divider */}
          <div className="relative  flex items-center justify-center">
            <div className="absolute inset-0 flex items-center px-2">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-[12px] text-slate-400 font-normal">
              Or login with
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            {/* Facebook */}
            <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            {/* Apple */}
            <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.96 0-2.04-.68-3.32-.68-1.27 0-2.31.66-3.18.66-1.56 0-4.01-2.47-4.01-6.27 0-3.9 2.51-5.96 4.93-5.96 1.25 0 2.3.8 3.03.8.72 0 1.99-.86 3.4-.86 1.77 0 3.12.91 3.86 2.04-3.56 1.48-2.98 5.99.38 7.35-.74 1.74-1.92 3.52-3.64 3.52zM15.35 6.64c-.75.89-2.02 1.55-3.07 1.46-.14-1.18.45-2.44 1.22-3.32.78-.9 2.09-1.51 3.02-1.4.15 1.17-.43 2.37-1.17 3.26z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-1">
            <p className="font-inter font-normal text-[12px] leading-[16px] text-slate-500 text-center">
              Don't have account? <button onClick={() => setMode('register')} className="text-[#2563eb] font-semibold hover:underline transition-all">Register</button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

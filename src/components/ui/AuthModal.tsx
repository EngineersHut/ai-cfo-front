"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[420px] bg-white rounded-[28px] shadow-2xl pointer-events-auto overflow-hidden p-8 sm:p-10"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-[26px] font-semibold text-slate-900 leading-tight">
                  Welcome to <span className="text-blue-600">North Quest Solution</span>
                </h2>
                <p className="text-[14px] text-slate-500 mt-3 font-normal">
                  Enter your email and password to Login
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="Ahmad.account@gmail.com"
                      className="w-full h-[48px] bg-white border border-slate-200 rounded-[12px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="w-full h-[48px] bg-white border border-slate-200 rounded-[12px] pl-11 pr-12 text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 text-slate-900"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Continue Button */}
                <button className="w-full h-[48px] bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-[12px] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2">
                  Continue
                </button>

                {/* Divider */}
                <div className="relative py-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative bg-white px-4 text-[12px] text-slate-400 font-normal">
                    Or login with
                  </span>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center h-[46px] border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center h-[46px] border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors">
                    <Image src="/icons/facebook.svg" width={22} height={22} alt="Facebook" />
                  </button>
                  <button className="flex items-center justify-center h-[46px] border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors">
                    <Image src="/icons/apple.svg" width={20} height={20} alt="Apple" />
                  </button>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-[13px] text-slate-500">
                    Don't have account? <a href="#" className="text-blue-600 font-semibold hover:underline">Register</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

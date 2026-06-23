"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Key, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Modal from "../common/Modal";
import * as yup from "yup";
import { dispatch, useSelector } from "@/store";
import { verifyEmail, verifyOTP, resetPassword, hasError, hasActionError } from "@/store/slices/auth";
import { ErrorAlert } from "../common/errorMessage";

const emailSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required')
});

const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});

const otpSchema = yup.object().shape({
  otp: yup.string().length(4, 'OTP must be exactly 4 digits').matches(/^\d+$/, 'OTP must contain only numbers').required('OTP is required')
});

type ForgotMode = 'email' | 'otp' | 'reset' | 'success';

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
  const [otp, setOtp] = useState(['', '', '', '']);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { actionLoading, actionError } = useSelector((state) => state.auth);


  const handleClose = () => {
    setValidationErrors({});
    setOtp(['', '', '', '']);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    router.push(`?${params.toString()}`);
    // Reset mode for next time
    setTimeout(() => setMode('email'), 300);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValidationErrors(prev => ({ ...prev, otp: '' }));

    // Focus next input automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleContinue = async () => {
    setValidationErrors({});
    try {
      if (mode === 'email') {
        await emailSchema.validate({ email: formData.email }, { abortEarly: false });
        dispatch(verifyEmail(
          { email: formData.email },
          () => setMode('otp')
        ));
      } else if (mode === 'otp') {
        const otpCode = otp.join('');
        await otpSchema.validate({ otp: otpCode }, { abortEarly: false });
        dispatch(verifyOTP(
          { email: formData.email, otp: otpCode },
          () => {
            setMode('reset');
          }
        ));
      } else if (mode === 'reset') {
        await resetPasswordSchema.validate(
          { password: formData.password, confirmPassword: formData.confirmPassword },
          { abortEarly: false }
        );
        dispatch(resetPassword(
          { password: formData.password, confirmPassword: formData.confirmPassword },
          () => setMode('success')
        ));
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.set('modal', 'login');
        router.push(`?${params.toString()}`);
        setTimeout(() => {
          setMode('email');
          setOtp(['', '', '', '']);
          setFormData({ email: '', password: '', confirmPassword: '' });
        }, 300);
      }
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  const getModalDimensions = () => {
    switch (mode) {
      case 'email': return { width: "343px", height: validationErrors.email ? "315px" : "288px" };
      case 'otp': return { width: "343px", height: validationErrors.otp ? "315px" : "288px" };
      case 'reset': return { width: "343px", height: (validationErrors.password || validationErrors.confirmPassword) ? "410px" : "360px" };
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
            {mode === 'email' ? "Forgot password" : mode === 'otp' ? "Verify OTP" : mode === 'reset' ? "Create New password" : "Reset Password Successfully"}
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-400 mt-2 text-center">
            {mode === 'email' ? "Kindly provide your email address to initiate a password reset request." :
              mode === 'otp' ? "Enter the 4-digit code sent to your email." :
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
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ahmad.account@gmail.com"
                  className={`w-full h-[38px] border rounded-[8px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                />
              </div>
              {validationErrors.email && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.email}</span>
              )}
            </div>
          )}

          {mode === 'otp' && (
            <div className="flex flex-col items-center">
              <label className="block font-inter font-normal text-[12px] text-slate-600 mb-3 self-start ml-0.5">Enter 4-digit OTP</label>
              <div className="flex gap-3 justify-center mb-1">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 shadow-sm ${validationErrors.otp ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                  />
                ))}
              </div>
              {validationErrors.otp && (
                <span className="text-red-500 text-[11px] mt-2 block">{validationErrors.otp}</span>
              )}
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block font-inter font-normal text-[12px] text-slate-600 mb-1.5 ml-0.5">Password *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full h-[38px] border rounded-[8px] pl-11 pr-12 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.password}</span>
                )}
              </div>
              <div>
                <label className="block font-inter font-normal text-[12px] text-slate-600 mb-1.5 ml-0.5">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full h-[38px] border rounded-[8px] pl-11 pr-12 text-[14px] focus:outline-none focus:border-blue-500 placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                  />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.confirmPassword}</span>
                )}
              </div>
            </div>
          )}

          <ErrorAlert
            error={actionError}
            onDismiss={() => {
              dispatch(hasError(null));
              dispatch(hasActionError(null));
            }}
          />

          <button
            onClick={handleContinue}
            disabled={actionLoading}
            className="w-full h-[36px] bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-[14px] rounded-[8px] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {actionLoading && (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {mode === 'success' ? 'Back to Login' : 'Continue'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

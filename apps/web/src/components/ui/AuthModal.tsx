"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Key, Eye, EyeOff, User } from "lucide-react";
import Modal from "../common/Modal";
import { dispatch, useSelector } from "@/store";
import { hasError, hasActionError, userSignUp, createsignIn } from "@/store/slices/auth";
import { ErrorAlert, SuccessAlert } from "../common/errorMessage";
import * as yup from "yup";

type AuthMode = 'login' | 'register';

const registerSchema = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the Terms of Service to continue')
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required')
});

interface AuthModalProps {
  defaultMode?: AuthMode;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function AuthModal({
  defaultMode = 'login'
}: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get('modal');

  const isOpen = modalParam === 'login' || modalParam === 'register';
  const mode = (modalParam as AuthMode) || defaultMode;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { error: errors, actionError, actionLoading } = useSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    setSuccessMessage(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    router.push(`?${params.toString()}`);
  };

  const setMode = (newMode: AuthMode) => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    setSuccessMessage(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', newMode);
    router.push(`?${params.toString()}`);
  };

  const openForgotPassword = () => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'forgot-password');
    router.push(`?${params.toString()}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (mode === 'register') {
        if (name === 'confirmPassword') {
          if (value && value !== updated.password) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              confirmPassword: 'Passwords must match'
            }));
          } else {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              confirmPassword: ''
            }));
          }
        } else if (name === 'password') {
          if (updated.confirmPassword && value !== updated.confirmPassword) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              confirmPassword: 'Passwords must match'
            }));
          } else if (updated.confirmPassword && value === updated.confirmPassword) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              confirmPassword: ''
            }));
          }
        }
      }

      return updated;
    });

    if (name !== 'confirmPassword' && name !== 'password') {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    } else if (name === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});

    try {
      if (mode === 'register') {
        await registerSchema.validate(formData, { abortEarly: false });
        dispatch(userSignUp(formData, () => {
          setSuccessMessage("User created successfully! Please login now.");
          setTimeout(() => {
            setSuccessMessage(null);
            setMode('login');
          }, 3000);
        }));
      } else {
        await loginSchema.validate(formData, { abortEarly: false });
        const loginPayload = {
          email: formData.email,
          password: formData.password
        };
        dispatch(createsignIn(loginPayload, handleClose));
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
      } else {
        console.error("Non-validation error:", err);
      }
    }
  };

  if (!isOpen) return null;

  const hasActiveError = !!(errors || actionError || Object.keys(validationErrors).length > 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} height={mode === 'register' ? "580px" : "500px"} width="398px">
      <div className={`px-8 pb-4 font-inter ${hasActiveError ? `overflow-y-auto scrollbar-thin ${mode === 'register' ? 'max-h-[510px]' : 'max-h-[430px]'}` : ''}`}>
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-[#0f172a] font-medium text-[24px] leading-[32px] tracking-normal text-center font-inter">
            Welcome to <span className="text-[#2563eb]">North Quest Solution</span>
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-400 mt-1 text-center">
            {mode === 'login' ? 'Enter your email and password to Login' : 'Create your account to get started'}
          </p>
        </div>

        {/* Error Alert */}


        {/* Form */}
        <div className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} strokeWidth={1.8} /></div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ahmad Husein"
                  className={`w-full h-[38px] bg-white border rounded-[8px] pl-11 pr-[10px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                />
              </div>
              {validationErrors.name && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.fullName}</span>
              )}
            </div>
          )}

          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><AtSign size={18} strokeWidth={1.8} /></div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ahmad.account@gmail.com"
                className={`w-full h-[38px] bg-white border rounded-[8px] pl-11 pr-[10px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
              />
            </div>
            {validationErrors.email && (
              <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.email}</span>
            )}
          </div>

          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className={`w-full h-[38px] bg-white border rounded-[8px] pl-11 pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
            {validationErrors.password && (
              <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.password}</span>
            )}
            {mode === 'login' && (
              <div className="flex justify-end mt-1">
                <button type="button" onClick={openForgotPassword} className="text-[12px] text-blue-600 hover:underline font-medium">Forgot Password?</button>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 mb-1.5 ml-0.5">Confirm Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Key size={18} strokeWidth={1.8} /></div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`w-full h-[38px] bg-white border rounded-[8px] pl-11 pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 text-slate-900 shadow-sm ${validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.confirmPassword}</span>
              )}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                <p className="font-inter font-normal text-[12px] leading-[16px] text-slate-500">
                  I agree to Opscale <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </div>
              {validationErrors.agreeToTerms && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">{validationErrors.agreeToTerms}</span>
              )}
            </div>
          )}
          <SuccessAlert
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
          <ErrorAlert
            error={actionError}
            onDismiss={() => {
              dispatch(hasError(null));
              dispatch(hasActionError(null));
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={actionLoading}
            className="flex items-center justify-center w-full h-[36px] bg-[#2563eb] hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium text-[14px] leading-[20px] rounded-[8px] px-[12px] py-[4px] font-inter transition-all active:scale-[0.98] mt-2 shadow-sm"
          >
            {actionLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Continue'
            )}
          </button>

          {mode === 'login' && (
            <>
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center px-2"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[12px] text-slate-400 font-normal">Or login with</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg></button>
                <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]"><svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></button>
                <button className="flex items-center justify-center w-[106px] h-[36px] border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors shadow-sm py-[4px] px-[10px]"><svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M17.05 20.28c-.96 0-2.04-.68-3.32-.68-1.27 0-2.31.66-3.18.66-1.56 0-4.01-2.47-4.01-6.27 0-3.9 2.51-5.96 4.93-5.96 1.25 0 2.3.8 3.03.8.72 0 1.99-.86 3.4-.86 1.77 0 3.12.91 3.86 2.04-3.56 1.48-2.98 5.99.38 7.35-.74 1.74-1.92 3.52-3.64 3.52zM15.35 6.64c-.75.89-2.02 1.55-3.07 1.46-.14-1.18.45-2.44 1.22-3.32.78-.9 2.09-1.51 3.02-1.4.15 1.17-.43 2.37-1.17 3.26z" /></svg></button>
              </div>
            </>
          )}

          <div className="text-center pt-2">
            <p className="font-inter font-normal text-[12px] leading-[16px] text-slate-500 text-center">
              {mode === 'login' ? "Don't have account?" : "Already have an account?"}{' '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-[#2563eb] font-semibold hover:underline transition-all">{mode === 'login' ? 'Register' : 'Login'}</button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

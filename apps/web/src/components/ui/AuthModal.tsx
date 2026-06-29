"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AtSign, Key, Eye, EyeOff, User } from "lucide-react";
import Modal from "../common/Modal";
import { dispatch, useSelector } from "@/store";
import {
  hasError,
  hasActionError,
  userSignUp,
  createsignIn,
} from "@/store/slices/auth";
import { ErrorAlert, SuccessAlert } from "../common/errorMessage";
import * as yup from "yup";

type AuthMode = "login" | "register";

const registerSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the Terms of Service to continue"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

interface AuthModalProps {
  defaultMode?: AuthMode;
  isOpen?: boolean;
  onClose?: () => void;
  mode?: AuthMode;
  setMode?: (mode: AuthMode) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function AuthModal({
  defaultMode = "login",
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  mode: controlledMode,
  setMode: controlledSetMode,
}: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [localIsOpen, setLocalIsOpen] = useState<boolean>(false);
  const [localMode, setLocalMode] = useState<AuthMode>(defaultMode);

  useEffect(() => {
    const initialModal = searchParams.get("modal");
    if (initialModal === "login" || initialModal === "register") {
      setLocalIsOpen(true);
      setLocalMode(initialModal as AuthMode);
      // Immediately redirect to clear the query parameters from the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("modal");
      const newQuery = params.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;
  const mode = controlledMode !== undefined ? controlledMode : localMode;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    error: errors,
    actionError,
    actionLoading,
  } = useSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    setSuccessMessage(null);
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("modal");
      const newQuery = params.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
        scroll: false,
      });
    }
  };

  const setMode = (newMode: AuthMode) => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    setSuccessMessage(null);
    if (controlledSetMode) {
      controlledSetMode(newMode);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("modal", newMode);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const openForgotPassword = () => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "forgot-password");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (mode === "register") {
        if (name === "confirmPassword") {
          if (value && value !== updated.password) {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: "Passwords must match",
            }));
          } else {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: "",
            }));
          }
        } else if (name === "password") {
          if (updated.confirmPassword && value !== updated.confirmPassword) {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: "Passwords must match",
            }));
          } else if (
            updated.confirmPassword &&
            value === updated.confirmPassword
          ) {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: "",
            }));
          }
        }
      }

      return updated;
    });

    if (name !== "confirmPassword" && name !== "password") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } else if (name === "password") {
      setValidationErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    dispatch(hasError(null));
    dispatch(hasActionError(null));
    setValidationErrors({});

    try {
      if (mode === "register") {
        await registerSchema.validate(formData, { abortEarly: false });
        dispatch(
          userSignUp(formData, () => {
            setSuccessMessage("User created successfully! Please login now.");
            setTimeout(() => {
              setSuccessMessage(null);
              setMode("login");
            }, 3000);
          }),
        );
      } else {
        await loginSchema.validate(formData, { abortEarly: false });
        const loginPayload = {
          email: formData.email,
          password: formData.password,
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

  const hasActiveError = !!(
    errors ||
    actionError ||
    Object.keys(validationErrors).length > 0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      height={mode === "register" ? "580px" : "400px"}
      width="398px"
      className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800"
    >
      <div
        className={`px-8 pb-4 font-inter ${hasActiveError ? `overflow-y-auto scrollbar-thin ${mode === "register" ? "max-h-[510px]" : "max-h-[430px]"}` : ""}`}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-[#0f172a] dark:text-white font-medium text-[24px] leading-[32px] tracking-normal text-center font-inter">
            Welcome to{" "}
            <span className="text-[#2563eb] dark:text-blue-400">North Quest Solution</span>
          </h2>
          <p className="font-inter font-normal text-[14px] leading-[20px] text-slate-400 mt-1 text-center">
            {mode === "login"
              ? "Enter your email and password to Login"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Error Alert */}

        {/* Form */}
        <div className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ahmad Husein"
                  className={`w-full h-[38px] bg-white dark:bg-slate-800 border rounded-[8px] pl-11 pr-[10px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white shadow-sm autofill-light ${
                    validationErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                />
              </div>
              {validationErrors.name && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">
                  {validationErrors.name}
                </span>
              )}
            </div>
          )}

          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">
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
                className={`w-full h-[38px] bg-white dark:bg-slate-800 border rounded-[8px] pl-11 pr-[10px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white shadow-sm autofill-light ${
                  validationErrors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />
            </div>
            {validationErrors.email && (
              <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">
                {validationErrors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">
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
                className={`w-full h-[38px] bg-white dark:bg-slate-800 border rounded-[8px] pl-11 pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white shadow-sm autofill-light ${
                  validationErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">
                {validationErrors.password}
              </span>
            )}
            {mode === "login" && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-[12px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label className="block font-inter font-normal text-[12px] leading-[16px] text-slate-600 dark:text-slate-300 mb-1.5 ml-0.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key size={18} strokeWidth={1.8} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`w-full h-[38px] bg-white dark:bg-slate-800 border rounded-[8px] pl-11 pr-[40px] py-[8px] text-[14px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white shadow-sm autofill-light ${
                    validationErrors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">
                  {validationErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {mode === "register" && (
            <div>
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <p className="font-inter font-normal text-[12px] leading-[16px] text-slate-500 dark:text-slate-400">
                  I agree to Opscale{" "}
                  <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>
              {validationErrors.agreeToTerms && (
                <span className="text-red-500 text-[11px] mt-1 ml-0.5 block">
                  {validationErrors.agreeToTerms}
                </span>
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
            className="flex items-center justify-center w-full h-[36px] bg-[#2563eb] hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium text-[14px] leading-[20px] rounded-[8px] px-[12px] py-[4px] font-inter transition-all active:scale-[0.98] mt-2 shadow-sm cursor-pointer"
          >
            {actionLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Continue"
            )}
          </button>
          <div className="text-center pt-2">
            <p className="font-inter font-normal text-[12px] leading-[16px] text-slate-500 dark:text-slate-400 text-center">
              {mode === "login"
                ? "Don't have account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[#2563eb] dark:text-blue-400 font-semibold hover:underline transition-all cursor-pointer"
              >
                {mode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

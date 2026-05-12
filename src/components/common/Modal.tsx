'use client';
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
// import { useRouter } from 'next/router';
// import { useLocation } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  isShowTimer?: boolean;
  children: React.ReactNode;
  width?: string;
  height?: string;
  showCloseButton?: boolean;
  loading?: boolean;
  className?: string;
  closeOnBackdropClick?: boolean;
  footer?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  timer?: React.ReactNode;
  modalClose?: boolean;
  noScroll?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  width,
  height,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Prevent body scroll while modal open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center ">
      <div
        className="absolute inset-0 bg-black/60  transition-opacity duration-300"
        onClick={() => {
          onClose();
        }}
        aria-hidden
      />

      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className={`
        relative z-10 flex flex-col
        w-full
        bg-white
        border border-gray-600
        
        rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        transition-all duration-300
        overflow-hidden
        ${className}
      `}
        style={{ 
          maxWidth: width || '420px',
          width: '95%',
          height: height || 'auto',
          maxHeight: height ? 'none' : '92dvh',
          background: 'rgba(255, 255, 255, 1)'
        }}
      >
        {/* Top Header / Close Button Area */}
        <div className="flex justify-end px-2 pt-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
          >
            <X size={20} strokeWidth={2.5} className="text-black" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-h-0">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

"use client";

import React from 'react';
import { X, RotateCw, Inbox, CheckCircle2, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from '@/store';
import { markAllNotificationsAsRead, getAllNotifications, clearAllNotifications } from '@/store/slices/realtimeNotification';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.realtimeNotification);

  if (!isOpen) return null;

  const handleRefresh = () => {
    dispatch(getAllNotifications());
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  const handleClearAll = () => {
    if (notifications.length > 0) {
      dispatch(clearAllNotifications());
    }
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-[360px] bg-white border border-slate-200/60 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 p-4 animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-[16px] font-semibold text-[#0a092e] font-inter">Notifications</span>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              title="Clear all"
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="text-slate-400 hover:text-blue-600 transition-colors p-1"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1" onClick={handleRefresh} title="Refresh">
            <RotateCw size={16} />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col py-2 max-h-[350px] overflow-y-auto custom-scrollbar">
        {notifications && notifications.length > 0 ? (
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`flex flex-col gap-1 p-3 rounded-[12px] border transition-colors ${
                  notif.isRead 
                    ? 'bg-white border-slate-100 opacity-70' 
                    : 'bg-blue-50/50 border-blue-100/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[13px] font-semibold font-inter ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.createdAt 
                      ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`text-[12px] font-inter leading-snug ${notif.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                  {notif.message}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-[50px] h-[50px] rounded-xl border border-slate-100 bg-slate-50/55 flex items-center justify-center text-slate-300">
              <Inbox size={22} strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-medium text-slate-400 font-inter">No new notifications</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 mt-2">
        <button
          onClick={onClose}
          className="w-full h-[38px] flex items-center justify-center border border-slate-200 rounded-[12px] bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors font-inter"
        >
          Close
        </button>
      </div>
    </div>
  );
}

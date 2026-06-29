import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import axios from "@/utils/axios";
import { getData, postData, deleteData } from "@/utils/apiHelper";

export interface AppNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  metaData: any;
  createdAt: string;
}

interface RealtimeNotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: RealtimeNotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "realtimeNotification",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    hasError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getNotificationsSuccess(state, action: PayloadAction<AppNotification[]>) {
      state.loading = false;
      const sorted = [...action.payload].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      state.notifications = sorted;
      state.unreadCount = sorted.filter((n) => !n.isRead).length;
    },
    addNotification(state, action: PayloadAction<AppNotification>) {
      // Add to top, keep max 30
      state.notifications = [action.payload, ...state.notifications].slice(
        0,
        30,
      );
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    markAllAsReadSuccess(state) {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      state.unreadCount = 0;
    },
    clearAllSuccess(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export default slice.reducer;

export const { addNotification, clearAllSuccess } = slice.actions;

export function getAllNotifications() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getData("/api/notifications");
      dispatch(slice.actions.getNotificationsSuccess(response));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
}

export function markAllNotificationsAsRead() {
  return async () => {
    try {
      await postData("/api/notifications/read-all", {});
      dispatch(slice.actions.markAllAsReadSuccess());
    } catch (error: any) {
      console.error("Failed to mark notifications as read", error);
    }
  };
}

export function clearAllNotifications() {
  return async () => {
    try {
      await deleteData('/api/notifications/clear');
      dispatch(slice.actions.clearAllSuccess());
    } catch (error: any) {
      console.error('Failed to clear notifications', error);
    }
  };
}

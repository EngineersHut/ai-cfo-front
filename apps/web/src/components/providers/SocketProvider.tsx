"use client";

import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from '@/store';
import { addNotification } from '@/store/slices/realtimeNotification';
import { toast } from 'react-toastify';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio with local path
    audioRef.current = new Audio('/sounds/notification.mp3'); 
    audioRef.current.volume = 0.5;

    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return;

    // Connect to WebSocket API
    let API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    if (API_URL && !API_URL.startsWith('http')) {
      const isLocalhost = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
      API_URL = isLocalhost ? `http://${API_URL}` : `https://${API_URL}`;
    }
    
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    } as any);

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification socket');
    });

    socket.on('new_notification', (notification) => {
      // Add to Redux store
      dispatch(addNotification(notification));
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }

      // Show toast
      if (notification.type === 'SUCCESS') {
        toast.success(`${notification.title}: ${notification.message}`);
      } else if (notification.type === 'ERROR') {
        toast.error(`${notification.title}: ${notification.message}`);
      } else if (notification.type === 'WARNING') {
        toast.warning(`${notification.title}: ${notification.message}`);
      } else {
        toast.info(`${notification.title}: ${notification.message}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
}

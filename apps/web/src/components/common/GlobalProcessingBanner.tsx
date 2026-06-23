"use client";

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { dispatch, useSelector } from '@/store';
import { getAllReports, getAllReportsSilent } from '@/store/slices/report';
import { Report } from '@/types';

export default function GlobalProcessingBanner() {
    const { reports } = useSelector((state) => state.report);
    const [hasProcessing, setHasProcessing] = useState(false);
    const [reanalyzingMsg, setReanalyzingMsg] = useState('');

    const checkProcessing = (data: any) => {
        if (!data) return false;
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        return dataArray.some((r: Report) => (r.uploadStatus || r.status) === 'processing');
    };

    // Initial fetch + silent polling when processing
    useEffect(() => {
        dispatch(getAllReports('?limit=10'));

        const interval = setInterval(() => {
            dispatch(getAllReportsSilent('?limit=10'));
        }, 5000);

        const handleReanalyzing = (e: any) => {
            if (e.detail?.reanalyzing) {
                setReanalyzingMsg('Report successfully deleted. Remaining reports for the same month are being re-analyzed.');
                setTimeout(() => setReanalyzingMsg(''), 30000);
            }
        };

        window.addEventListener('report-deleted', handleReanalyzing);

        return () => {
            clearInterval(interval);
            window.removeEventListener('report-deleted', handleReanalyzing);
        };
    }, []);

    // Update local state when Redux store updates
    useEffect(() => {
        setHasProcessing(checkProcessing(reports));
    }, [reports]);

    if (!hasProcessing && !reanalyzingMsg) return null;

    return (
        <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center justify-center gap-3 animate-in slide-in-from-top-2 duration-300 shadow-sm z-50">
            <Loader2 className="animate-spin text-blue-600" size={18} />
            <p className="text-sm font-medium text-blue-800 font-inter">
                {reanalyzingMsg || 'Your data is currently processing and reports are being analyzed. The dashboard will update once finished. Please do not close or leave this app.'}
            </p>
        </div>
    );
}

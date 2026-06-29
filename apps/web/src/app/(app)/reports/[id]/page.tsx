'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReportDetail from '../components/ReportDetail';

export default function SingleReportPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = React.use(params);

    return (
        <div className="max-w-[1400px] mx-auto w-full animate-in fade-in duration-500">
            <ReportDetail 
                reportId={resolvedParams.id} 
                onBack={() => router.push('/reports')} 
            />
        </div>
    );
}

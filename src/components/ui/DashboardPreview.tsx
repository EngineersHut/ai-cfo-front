"use client";

import Image from 'next/image'

export default function DashboardPreview() {
  return (
    <div className="relative w-[588px] h-[688px] bg-white rounded-[14px] border-[8px] border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden">
      <Image
        src="/Container.png"
        alt="Financial Dashboard Preview"
        fill
        className="object-cover object-top"
        priority
      />
    </div>
  )
}
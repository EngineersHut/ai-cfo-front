"use client";

import { motion } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import Image from "next/image";

const problems = [
  "Manual data entry takes hours",
  "No real insights or forecasts",
  "Difficult to track financial trends",
  "High risk of human error",
];
const solutions = [
  "Automatic financial analysis",
  "Real-time insights & forecasts",
  "Clear trend visualization",
  "AI-powered risk detection",
];

export default function ProblemSolution() {
  return (
    <section id="about" className="py-28 bg-bg-primary">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-[32px] font-semibold leading-[40px] mb-4 text-text-primary"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0%",
            }}
          >
            Our Next Gen AI Solve Finance
            <br className="hidden sm:block" /> Problem
          </h2>
          <p
            className="text-[16px] font-normal leading-[24px] max-w-xl mx-auto text-text-secondary"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0%",
            }}
          >
            Everything you need to analyze, predict, and optimize your finances.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ height: 260, padding: 30, borderRadius: 16 }}
            className="bg-bg-alt border border-border-subtle shadow-sm flex flex-col justify-between"
          >
            <div>
              <p
                className="text-[12px] font-normal leading-[16px] text-text-muted mb-2"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0%",
                }}
              >
                The Problem
              </p>
              <h3
                className="text-[20px] font-medium leading-[28px] text-text-primary mb-4"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0%",
                }}
              >
                Spreadsheets are slowing you down
              </h3>
              <div className="w-full h-[1px] bg-border-subtle mb-6" />
            </div>
            <ul className="space-y-3">
              {problems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="relative w-[20px] h-[20px] rounded-[7px] bg-[#ef4444] flex items-center justify-center shrink-0">
                    <X size={12} className="text-white" />
                  </span>
                  <span
                    className="text-[14px] leading-[20px] text-text-secondary font-normal"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      letterSpacing: "0%",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ height: 260, padding: 30, borderRadius: 16 }}
            className="relative z-10 overflow-hidden bg-[#1D4ED8] shadow-xl flex flex-col justify-between"
          >
            {/* Background Watermark Asset (Exact Specs) */}
            <div
              className="absolute left-[400px] top-[120px] z-0 select-none pointer-events-none opacity-[0.25]"
              style={{ transform: "rotate(360deg)" }}
            >
              <Image
                src="/images/Mask group.png"
                alt="Watermark"
                width={250}
                height={304}
                className="object-contain"
              />
            </div>

            <div className="relative z-10">
              <p
                className="text-[12px] font-normal leading-[16px] text-blue-100/80 mb-2"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0%",
                }}
              >
                The Solution
              </p>
              <h3
                className="text-[20px] font-medium leading-[28px] text-white mb-4"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0%",
                }}
              >
                AI CFO gives you clarity instantly
              </h3>
              <div className="w-full h-[1px] bg-white/20 mb-6" />
            </div>

            <ul className="space-y-3 relative z-10">
              {solutions.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="relative w-[22px] h-[22px] rounded-[8px] bg-white flex items-center justify-center shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span
                    className="text-[14px] leading-[20px] text-white font-normal"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      letterSpacing: "0%",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
const inputBase =
  "w-full bg-[#F4F7FB] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#1E293B] placeholder:text-[#A0ADBF] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";
 
export default function EnterProductModal() {
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4"
    >
      <div
        className="relative w-full max-w-[680px] bg-white rounded-2xl shadow-[0_24px_60px_-12px_rgba(15,23,42,.22),0_0_0_1px_rgba(15,23,42,.06)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
          <h2
            id="modal-title"
            className="text-[17px] font-bold text-[#0F172A] tracking-[-0.01em]"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Enter Product Manually
          </h2>
          <button
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
 
        {/* Form */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-5">
 
          {/* Product Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-semibold text-[#374151]">Product Name</label>
              <input
                type="text"
                placeholder="Full name"
                className={inputBase}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-semibold text-[#374151]">Category</label>
              <input
                type="text"
                placeholder="e.g. Spices & Herbs"
                className={inputBase}
              />
            </div>
          </div>
 
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-semibold text-[#374151]">Description</label>
            <textarea
              placeholder="Composition, applications..."
              rows={5}
              className={`${inputBase} resize-y min-h-[110px]`}
            />
          </div>
        </div>
 
        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC] rounded-b-2xl">
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-[13.5px] font-semibold rounded-lg shadow-[0_2px_8px_-2px_rgba(37,99,235,.45)] transition-all"
          >
            Save Product
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7.5l3.5 3.5L12 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
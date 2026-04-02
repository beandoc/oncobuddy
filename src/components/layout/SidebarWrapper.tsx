'use client';

import React from 'react';
import { useNav } from '@/lib/nav-context';
import { X } from 'lucide-react';

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useNav();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={close}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </aside>
    </>
  );
}

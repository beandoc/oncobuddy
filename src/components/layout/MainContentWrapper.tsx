'use client';

import React from 'react';
import { useNav } from "@/lib/nav-context";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useNav();
  return (
    <main className={`flex-1 flex flex-col relative w-full transition-all duration-500 ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
      {children}
    </main>
  );
}

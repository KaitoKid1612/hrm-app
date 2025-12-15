'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-2">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <div className="flex h-full flex-col overflow-y-auto border-r bg-background px-2">
              <Sidebar />
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="md:pl-64">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="container py-6 px-4">{children}</main>
      </div>
    </div>
  );
}

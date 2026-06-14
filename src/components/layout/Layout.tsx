import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useDevToolsProtection } from '@/hooks';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  useDevToolsProtection();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
};

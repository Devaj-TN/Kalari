import React from 'react';
import BackgroundLayer from '../common/BackgroundLayer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <BackgroundLayer />
      <div className="content-layer">
        {children}
      </div>
      <FloatingWhatsApp />
    </>
  );
}

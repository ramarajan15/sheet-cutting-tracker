import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {isHomePage ? (
        <main className="bg-gray-100">
          {children}
        </main>
      ) : (
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {children}
        </main>
      )}
    </div>
  );
};

export default Layout;

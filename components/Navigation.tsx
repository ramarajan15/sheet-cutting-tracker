import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/stock', label: 'Stock' },
    { href: '/orders', label: 'Orders' },
    { href: '/leftovers', label: 'Leftovers' },
    { href: '/visualizer', label: 'Visualizer' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Sheet Cutting Tracker
          </Link>
          <ul className="flex space-x-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`hover:text-blue-200 transition ${
                    router.pathname === link.href ? 'font-bold border-b-2 border-white' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

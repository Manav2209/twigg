'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, PieChart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { name: 'Stocks', icon: TrendingUp, href: '/stocks' },
    { name: 'Funds', icon: PieChart, href: '/funds' }
  ];

  return (
    <>
      {/* Toggle button for Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-md border lg:flex hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-md border"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3 }}
            className="
              fixed inset-y-0 left-0 z-40 w-64 
              bg-gradient-to-b from-[#f0f9ff] via-[#93c5fd] to-[#f0f9ff]
              shadow-xl border-r border-blue-200
              lg:static lg:translate-x-0
            "
          >
            <div className="flex flex-col h-full">
              {/* Logo/Header */}
              <div className="flex items-center justify-center h-16 px-4 border-b border-blue-200">
                <h1 className="text-xl font-bold text-blue-800">Portfolio</h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-blue-700 hover:bg-blue-100 hover:text-blue-900'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

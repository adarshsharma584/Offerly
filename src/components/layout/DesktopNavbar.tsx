// Desktop Navbar for laptop/desktop view

import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CITIES, MOCK_NOTIFICATIONS } from '@/data/mockData';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/offers', label: 'My Offers' },
];

export default function DesktopNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [locationValue, setLocationValue] = useLocalStorage('offerly_location', user?.location || 'Golaghat');

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-display font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-green-700 tracking-wide">OFFERLY</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Discover Local Deals</p>
              </div>
            </Link>

            {/* Nav Links - Center */}
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative py-2 group"
                  >
                    <span className={`text-sm font-display font-semibold transition-colors ${
                      isActive ? 'text-green-700' : 'text-gray-600 hover:text-green-700'
                    }`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side - Profile, Location, Notifications */}
            <div className="flex items-center gap-4">
              {/* Location Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <MapPin size={18} className="text-green-700" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                      {locationValue}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-2 rounded-2xl border-gray-100 shadow-2xl">
                  <div className="p-3 border-b border-gray-50 mb-1">
                    <h3 className="font-display font-bold text-xs text-gray-400 uppercase tracking-widest">Select City</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => setLocationValue(city)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${
                          locationValue === city 
                            ? 'bg-green-50 text-green-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {city}
                        {locationValue === city && <div className="w-1.5 h-1.5 rounded-full bg-green-700" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Notifications Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <Bell size={20} className="text-gray-700" />
                    {user && user.notifications > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {user.notifications}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border-gray-100 shadow-2xl">
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-display font-bold text-sm text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {MOCK_NOTIFICATIONS.length > 0 ? (
                      MOCK_NOTIFICATIONS.map((n, i) => (
                        <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${i !== MOCK_NOTIFICATIONS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                          <h4 className="font-display font-bold text-xs text-gray-900">{n.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.body}</p>
                          <p className="text-[9px] text-gray-400 mt-2 font-medium">{n.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-xs text-gray-400">No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-50 text-center">
                    <button className="text-[11px] font-bold text-green-700 hover:underline">Mark all as read</button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-display font-bold text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-none">{user?.role || 'Member'}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

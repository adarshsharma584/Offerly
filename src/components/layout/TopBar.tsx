import { useState } from 'react';
import { MapPin, ChevronDown, Bell, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CITIES, MOCK_NOTIFICATIONS } from '@/data/mockData';
import BottomSheet from '@/components/ui/BottomSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TopBar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [locationValue, setLocationValue] = useLocalStorage('offerly_location', user?.location || 'Golaghat');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const NotificationList = () => (
    <div className="space-y-3">
      {MOCK_NOTIFICATIONS.map(n => (
        <div key={n.id} className="glass-card p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-none shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-app-text">{n.title}</h4>
              <p className="text-app-muted text-xs mt-1 leading-relaxed">{n.body}</p>
              <p className="text-app-muted text-[10px] mt-2 font-medium flex items-center gap-1">
                <Sparkles size={10} className="text-amber-500" />
                {n.time}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Simple Clean Header matching the image */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-4">
          {/* Top Row: Profile Icon, Logo, Notification */}
          <div className="flex items-center justify-between mb-4">
            {/* Profile Icon */}
            <Link to="/profile" className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">
              <User size={20} className="text-gray-600" />
            </Link>

            {/* Logo */}
            <h1 className="text-xl md:text-2xl font-display font-bold text-green-700 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-green-700 text-white rounded-lg flex items-center justify-center text-xs">O</span>
              OFFERLY
            </h1>

            {/* Notification Bell */}
            {isMobile ? (
              <button
                type="button"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
                onClick={() => setShowNotifications(true)}
                aria-label="Notifications"
              >
                <Bell size={22} className="text-gray-700" />
                {user && user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    {user.notifications}
                  </span>
                )}
              </button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                    aria-label="Notifications"
                  >
                    <Bell size={22} className="text-gray-700" />
                    {user && user.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        {user.notifications}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96 p-0 overflow-hidden rounded-[24px] border-none shadow-2xl">
                  <div className="p-5 border-b border-gray-50 bg-white/80 backdrop-blur-md">
                    <h3 className="font-display font-bold text-lg text-gray-900">Notifications</h3>
                  </div>
                  <ScrollArea className="h-[450px] p-4 bg-gray-50/30">
                    <NotificationList />
                  </ScrollArea>
                  <div className="p-4 bg-white border-t border-gray-50 text-center">
                    <button className="text-green-700 text-sm font-bold hover:underline">Mark all as read</button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Location Selector */}
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl cursor-pointer border border-gray-100 max-w-md mx-auto"
            onClick={() => setShowCityPicker(true)}
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-green-700" />
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-gray-900">Near You</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{locationValue}</span>
              </div>
            </div>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* City Picker Bottom Sheet */}
      <BottomSheet isOpen={showCityPicker} onClose={() => setShowCityPicker(false)} title="Select Location">
        <div className="space-y-1">
          {CITIES.map(city => (
            <div
              key={city}
              onClick={() => { setLocationValue(city); setShowCityPicker(false); }}
              className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                locationValue.includes(city) ? 'gradient-accent text-white shadow-glow' : 'hover:bg-green-50 text-app-text'
              }`}
            >
              <MapPin size={16} />
              <span className="font-display font-semibold text-sm">{city}</span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Notifications Bottom Sheet for Mobile */}
      {isMobile && (
        <BottomSheet isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notifications">
          <NotificationList />
        </BottomSheet>
      )}
    </>
  );
}

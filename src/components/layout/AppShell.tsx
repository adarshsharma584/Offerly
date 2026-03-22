import { ReactNode } from 'react';
import TopBar from './TopBar';
import DesktopNavbar from './DesktopNavbar';
import BottomNavBar from './BottomNavBar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function AppShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="transition-all duration-300">
        {/* Show TopBar only on mobile, DesktopNavbar on laptop/desktop */}
        {isMobile ? <TopBar /> : <DesktopNavbar />}
        
        <main className={`scroll-area ${isMobile ? 'pb-24' : 'pb-8'}`}>
          <div className={`mx-auto ${isMobile ? 'max-w-[520px]' : 'max-w-6xl px-8 pt-6 xl:pt-10'}`}>
            {children}
          </div>
        </main>
        
        {/* Show Footer only on desktop */}
        {!isMobile && <Footer />}
      </div>
      
      {/* Show BottomNavBar only on mobile */}
      {isMobile && <BottomNavBar />}
    </div>
  );
}

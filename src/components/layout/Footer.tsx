import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#0B2519] text-white pt-20 pb-10 overflow-hidden relative mt-20">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 opacity-50" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/20">
                <span className="text-white font-display font-bold text-xl">O</span>
              </div>
              <div>
                <p className="font-display font-bold text-2xl tracking-tight">OFFERLY</p>
                <p className="text-green-400/60 text-xs font-medium uppercase tracking-wider">Local Discovery</p>
              </div>
            </div>
            <p className="text-green-50/60 text-sm leading-7 max-w-[320px] mb-8">
              Discover trusted local offers, save more on everyday essentials, and connect with the best
              merchants around you — all in one seamless experience.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-8 grid grid-cols-3 gap-8">
            <div>
              <p className="text-white font-display font-bold text-sm mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Company
              </p>
              <ul className="space-y-4 text-sm text-green-50/50">
                <li><Link to="/" className="hover:text-green-400 transition-colors">Our Story</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Press & Media</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-white font-display font-bold text-sm mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Resources
              </p>
              <ul className="space-y-4 text-sm text-green-50/50">
                <li><Link to="/explore" className="hover:text-green-400 transition-colors">Explore Deals</Link></li>
                <li><Link to="/offers" className="hover:text-green-400 transition-colors">My Savings</Link></li>
                <li><Link to="/merchant" className="hover:text-green-400 transition-colors">Merchant Panel</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-white font-display font-bold text-sm mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Legal
              </p>
              <ul className="space-y-4 text-sm text-green-50/50">
                <li><Link to="/" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Cookie Policy</Link></li>
                <li><Link to="/" className="hover:text-green-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-green-50/30">
            © {new Date().getFullYear()} Offerly Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-widest text-green-50/30">
            <span>Built with ♥ for local business</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

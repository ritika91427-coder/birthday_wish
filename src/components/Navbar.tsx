import React, { useState, useEffect } from 'react';
import { Cake, Sparkles, Image, HeartHandshake, Pin, Mail, Menu, X } from 'lucide-react';
import { AfreenAvatar } from './AfreenAvatar';

interface NavbarProps {
  onScrollTo: (id: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero-section', label: 'Start', icon: Sparkles },
    { id: 'cake-section', label: '3D Cake', icon: Cake },
    { id: 'scrapbook-section', label: 'Scrapbook', icon: Image },
    { id: 'cards-section', label: 'Appreciation', icon: HeartHandshake },
    { id: 'corkboard-section', label: 'Corkboard', icon: Pin },
    { id: 'letter-section', label: 'Letter', icon: Mail },
    { id: 'final-section', label: 'Finale', icon: Sparkles },
  ];

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-[#F3E8FF] py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          onClick={() => handleNavClick('hero-section')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <AfreenAvatar size="sm" showBadge={false} interactive={false} className="group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-serif font-bold text-sm sm:text-base text-[#2D2A26] tracking-tight group-hover:text-purple-700 transition">
              A Little Something for Afreen 🎂
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 font-sans tracking-wide">
              Handcrafted Friendship Birthday Surprise
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF5FF]/80 backdrop-blur-xs p-1 rounded-full border border-[#E9D5FF]/60 text-xs font-medium text-gray-600">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-xs font-semibold'
                    : 'hover:text-[#581C87] hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-gray-700 hover:bg-purple-50 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-purple-100 px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 font-semibold'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

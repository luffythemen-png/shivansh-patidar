import React, { useState, useEffect } from 'react';
import { Sun, Menu, X, Phone, ShieldCheck, Instagram } from 'lucide-react';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenCalculator, onOpenAdmin }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Products', id: 'products' },
    { label: 'Why Choose Us', id: 'why-choose-us' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact Us', id: 'contact' },
  ];

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => scrollToSection('home')}
            id="header-logo-container"
          >
            <div className="relative p-2 bg-amber-500 rounded-xl group-hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Sun className="w-6 h-6 text-slate-950 animate-spin-slow" />
            </div>
            <div>
              <span className="block text-xl font-bold font-sans tracking-tight text-white leading-none">
                INFINITY SOLAR
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-amber-400 uppercase mt-0.5">
                POWER SYSTEM
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA & Phone & Admin trigger */}
          <div className="hidden lg:flex items-center gap-5" id="header-actions">
            <div className="flex items-center gap-2 text-sm text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">Open 24x7</span>
            </div>

            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-amber-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>+91 98765 43210</span>
            </a>

            <a 
              href="https://www.instagram.com/infinity_solar_power_system?igsh=NWNud2N3cGo4aXhm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-amber-400 rounded-xl transition-colors flex items-center justify-center"
              title="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCalculator}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)] cursor-pointer hover:-translate-y-0.5"
            >
              Calculate Savings
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400">24/7</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl" id="mobile-menu-drawer">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-base font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-800 space-y-3 px-4">
              <div className="flex items-center justify-between">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2.5 text-sm font-semibold text-white hover:text-amber-400"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>+91 98765 43210</span>
                </a>
                <a
                  href="https://www.instagram.com/infinity_solar_power_system?igsh=NWNud2N3cGo4aXhm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-amber-400" />
                  <span>Instagram</span>
                </a>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCalculator();
                }}
                className="w-full text-center px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Calculate Savings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

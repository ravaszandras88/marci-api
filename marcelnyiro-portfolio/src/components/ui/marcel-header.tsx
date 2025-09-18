"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MarcelHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Marcel Nyirő
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('achievements')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Achievements
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get In Touch
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-b-lg">
              <button 
                onClick={() => scrollToSection('hero')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('achievements')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Achievements
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Contact
              </button>
              <div className="px-3 py-2">
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
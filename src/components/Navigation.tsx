import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Film, BookmarkPlus, Menu, X, Gem } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navigation = () => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    {
      to: '/watchlist',
      label: 'Watch Later',
      icon: <BookmarkPlus size={20} />,
      requiresAuth: true
    },
    {
      to: '/hidden-gems',
      label: 'Hidden Gems',
      icon: <Gem size={20} />,
      requiresAuth: true
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="text-blue-500" size={24} />
            <span className="text-xl font-bold text-white">WatchListy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors",
                  isActive(link.to)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-blue-500 hover:bg-gray-700/50"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {isSignedIn && navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center space-x-2 py-2 px-3 rounded-lg",
                    isActive(link.to)
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:text-blue-500 hover:bg-gray-700/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {isSignedIn ? (
                <div className="py-2 px-3">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="py-2 px-3">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Film, BookmarkPlus, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {isSignedIn ? (
              <>
                <Link
                  to="/watchlist"
                  className="flex items-center space-x-1 text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <BookmarkPlus size={20} />
                  <span>Watch Later</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
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
              {isSignedIn ? (
                <>
                  <Link
                    to="/watchlist"
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BookmarkPlus size={20} />
                    <span>Watch Later</span>
                  </Link>
                  <div className="py-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              ) : (
                <div className="py-2">
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
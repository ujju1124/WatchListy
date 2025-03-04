import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { WatchLaterPage } from './components/WatchLaterPage';
import { HiddenGemsPage } from './components/HiddenGemsPage';
import { MovieDetailsPage } from './components/MovieDetailsPage';
import { PrivacyPolicy } from './Pages/PrivacyPolicy';
import { TermsOfService } from './Pages/TermsOfService';
import { Contact } from './Pages/Contact';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                WatchListy
              </h1>
              <h3 className="text-xl sm:text-2xl md:text-2xl font-semibold text-center mb-6 sm:mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
  Your Ultimate Movie & Series Hub !
</h3>

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watchlist" element={<WatchLaterPage />} />
                <Route path="/hidden-gems" element={<HiddenGemsPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage type="movie" />} />
                <Route path="/tv/:id" element={<MovieDetailsPage type="tv" />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
              },
              duration: 4000,
            }}
          />
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" />
        Back to home
      </Link>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to WatchListy. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">
              We collect several types of information from and about users of our website, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identifiers such as name and email address when you create an account</li>
              <li>Usage data including movies and TV shows you add to your watch list</li>
              <li>Technical data such as IP address, browser type, and device information</li>
              <li>Cookies and similar tracking technologies to enhance your experience</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and maintaining our service</li>
              <li>Personalizing your experience</li>
              <li>Improving our website and services</li>
              <li>Communicating with you about updates or changes</li>
              <li>Analyzing usage patterns to enhance functionality</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to use commercially acceptable means to protect your personal data,
              we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p>
              WatchListy uses third-party services such as TMDb (The Movie Database) API for content
              and Clerk for authentication. These services have their own privacy policies, and we
              encourage you to review them.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure of your data</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at
              <a href="mailto:privacy@WatchListy.com" className="text-blue-400 hover:underline ml-1">
                privacy@WatchListy.com
              </a>.
            </p>
          </section>
          
          <div className="pt-4 text-sm text-gray-400">
            Last Updated: June 15, 2025
          </div>
        </div>
      </div>
    </div>
  );
};
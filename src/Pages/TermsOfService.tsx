import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" />
        Back to home
      </Link>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WatchListy, you agree to be bound by these Terms of Service.
              If you do not agree to all the terms and conditions, you should not use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              WatchListy is a movie and TV show discovery platform that allows users to browse,
              search, and save content to a personal watch list. We provide information about movies
              and TV shows through third-party APIs such as TMDb (The Movie Database).
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p className="mb-3">
              To use certain features of our service, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mt-3">
              We reserve the right to terminate accounts that violate these terms or for any other reason at our discretion.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
            <p>
              The WatchListy service, including all content, features, and functionality, is owned by
              WatchListy and its licensors and is protected by copyright, trademark, and other intellectual
              property laws. Movie and TV show data is provided by TMDb and is subject to their terms of use.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. User Conduct</h2>
            <p className="mb-3">
              You agree not to use our service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with the proper functioning of the service</li>
              <li>Collect or store personal data about other users without their consent</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              WatchListy and its affiliates shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your access to or use of, or inability
              to access or use, the service. We do not guarantee the accuracy, completeness, or usefulness
              of any information on the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Links and Content</h2>
            <p>
              Our service may contain links to third-party websites or services that are not owned or
              controlled by WatchListy. We have no control over, and assume no responsibility for,
              the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Modifications to the Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the service
              or any features or portions thereof without prior notice. You agree that we will not be
              liable for any modification, suspension, or discontinuance of the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              We may revise these Terms of Service from time to time. The most current version will
              always be posted on our website. By continuing to access or use our service after revisions
              become effective, you agree to be bound by the revised terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which WatchListy operates, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              <a href="mailto:terms@WatchListy.com" className="text-blue-400 hover:underline ml-1">
                terms@WatchListy.com
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
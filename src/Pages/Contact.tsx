import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Facebook, Linkedin, Send, Phone } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" />
        Back to home
      </Link>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Contact Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <p className="text-gray-300">
              Have questions, feedback, or need assistance? I'd love to hear from you! 
              Choose your preferred method of contact below.
            </p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Connect With Me</h2>
              
              <a 
                href="mailto:contact@WatchListy.com" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors p-2 -ml-2"
              >
                <Mail className="text-blue-500" size={20} />
                <span>dahalujwal3@gmail.com</span>
              </a>
              
              <a 
                href="tel:+1234567890" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors p-2 -ml-2"
              >
                <Phone className="text-blue-500" size={20} />
                <span>+977 9865126433</span>
              </a>
              
              <a 
                href="https://www.facebook.com/ujwal.dahal.718" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors p-2 -ml-2"
              >
                <Facebook className="text-blue-500" size={20} />
                <span>Ujwal Dahal</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/ujwal-dahal-989049295/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors p-2 -ml-2"
              >
                <Linkedin className="text-blue-500" size={20} />
                <span>Ujwal Dahal</span>
              </a>
            </div>
            
          </div>
          
          {/* Contact Form */}
          <div>
            {isSubmitted ? (
              <div className="bg-gray-700 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300 mb-4">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
  id="subject"
  name="subject"
  value={formData.subject}
  onChange={handleChange}
  required
  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="" disabled hidden>
    Select a subject
  </option>
  <option value="general">General Inquiry</option>
  <option value="support">Technical Support</option>
  <option value="feedback">Feedback</option>
</select>

                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
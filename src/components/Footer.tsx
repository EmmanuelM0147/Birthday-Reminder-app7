import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Birthday Reminder App. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
              aria-label="View source code on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </a>
            
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
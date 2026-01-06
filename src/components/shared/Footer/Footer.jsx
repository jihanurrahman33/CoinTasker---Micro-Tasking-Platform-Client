import React, { useState } from "react";
import { Link } from "react-router";
import {
  FaCoins,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";
import Logo from "../Logo/Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white font-sans">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted platform for completing micro-tasks and earning
              rewards. Join thousands of workers and buyers building success
              together.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/jihanurrahman33"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-indigo-600 transition-all hover:scale-110 border border-white/10"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/md-jihanur-rahman/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-indigo-600 transition-all hover:scale-110 border border-white/10"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/nishak69"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-indigo-600 transition-all hover:scale-110 border border-white/10"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/Jihanurrahman2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-indigo-600 transition-all hover:scale-110 border border-white/10"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">For Users</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard/task-list"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Find Tasks
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/add-task"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Post a Task
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-submissions"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    My Submissions
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    FAQ
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest tasks, tips, and platform updates.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 rounded-xl animate-fade-in-up">
                <FaCheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  Successfully subscribed!
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 group text-sm"
                >
                  Subscribe
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} CoinTasker. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm hover:underline"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

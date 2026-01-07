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
    <footer className="relative bg-secondary text-white font-sans border-t border-slate-800">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-secondary to-slate-900 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-teal-500 to-emerald-400 opacity-50" />

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="brightness-0 invert mb-4 opacity-90">
                <Logo />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
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
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-primary transition-all hover:scale-110 border border-white/10 hover:border-primary/50"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/md-jihanur-rahman/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-[#0077b5] transition-all hover:scale-110 border border-white/10"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/nishak69"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-[#1877F2] transition-all hover:scale-110 border border-white/10"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/Jihanurrahman2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-[#1DA1F2] transition-all hover:scale-110 border border-white/10"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4 text-white">For Users</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard/task-list"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Find Tasks
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/add-task"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    Post a Task
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-submissions"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    My Submissions
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100 text-primary" />
                  <span className="-ml-5 group-hover:ml-0 transition-all">
                    FAQ
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4 text-white">
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to get the latest tasks, tips, and platform updates.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl animate-fade-in-up">
                <FaCheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">
                  Successfully subscribed!
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 btn-primary-gradient text-white rounded-xl font-medium shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group text-sm border-none"
                >
                  Subscribe
                  <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            <p className="text-xs text-slate-500 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {currentYear} CoinTasker. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-primary transition-colors text-sm hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-slate-400 hover:text-primary transition-colors text-sm hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="text-slate-400 hover:text-primary transition-colors text-sm hover:underline"
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

import React from 'react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 relative overflow-hidden">
            <SEO title="Page Not Found" />
            
             {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-lg">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-300 select-none">
                    404
                </h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                     <h2 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h2>
                     <p className="text-slate-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn btn-primary rounded-xl px-8 shadow-lg shadow-emerald-500/20">
                            <FaHome className="mr-2" /> Go Home
                        </Link>
                         <button onClick={() => window.history.back()} className="btn btn-outline border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl px-8">
                            Go Back
                        </button>
                     </div>
                </div>
            </div>
            
            <div className="mt-24 text-slate-400 text-sm">
                <p>Lost? Try searching or check the URL.</p>
            </div>
        </div>
    );
};

export default NotFound;

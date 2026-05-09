
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageSquare, Sparkles, Zap, MapPin, Users, ShieldCheck, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation / Logo */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-slate-900">
            NeighborWings AI
          </span>
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-center">
        {/* Hero Section */}
        <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden">
          {/* Extremely subtle background light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_-10%,#f0f7ff_0%,transparent_30%)]"></div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.05]">
                Tampa Bay, <br />
                <span className="text-blue-600">Simplified.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 mb-10 font-medium leading-relaxed">
                Discover real events, trusted vendors, and weekend plans — no fake AI suggestions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  to="/app"
                  onClick={() => sessionStorage.removeItem('nw_mode')}
                  className="group inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                  Start Chatting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/app?mode=vendor"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                  Join as Vendor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Minimal How It Works - Compact Row */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-4">
              {[
                { icon: MessageSquare, title: "Chat Your Need", desc: "Ask about events or vendors." },
                { icon: Sparkles, title: "Get Matches", desc: "See verified local options." },
                { icon: CheckCircle, title: "Connect Fast", desc: "Reach out with just one tap." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-start gap-4 md:flex-col md:items-center md:text-center group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-tight">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Compact */}
      <footer className="py-8 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center sm:text-left">
            © 2026 NeighborWings AI. Built for the Tampa Bay community.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600">Privacy</a>
            <a href="#" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600">Terms</a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-xl shadow-blue-200 hover:scale-110 active:scale-95 transition-transform group"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

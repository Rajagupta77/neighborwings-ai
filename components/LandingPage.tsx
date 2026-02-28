
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
      <main className="flex-grow">
        {/* Hero Section */}
        <header className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] -translate-y-[50%] [mask-image:radial-gradient(closest-side,white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-indigo-100/40 opacity-40"></div>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grounded in Tampa Bay</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Your Tampa Bay <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Local Life Companion</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 font-medium">
                Discover events, activities, and trusted vendors — no hallucinations, one-tap contact. Built for neighbors, by neighbors.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/app"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-black hover:scale-105 active:scale-95 transition-all"
                >
                  Start Chatting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                >
                  See how it works
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
              Tired of endless Google searches, fake AI suggestions, and planning stress in Tampa?
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Most AI tools make things up. We don't. We use real, verified local data to make sure your weekend plans actually exist.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Real local events & volunteer ops",
                desc: "From Ybor markets to beach cleanups, see what's actually happening today.",
                icon: MapPin,
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                title: "Trusted vendors with WhatsApp",
                desc: "One-tap contact with verified local pros. No middleman, no hidden fees.",
                icon: Users,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Personalized plans in seconds",
                desc: "Tell us your vibe and budget. We'll bundle the perfect event and vendor for you.",
                icon: Zap,
                color: "text-amber-600",
                bg: "bg-amber-50"
              },
              {
                title: "100% grounded — no made-up info",
                desc: "Our AI is strictly limited to our verified Tampa Bay database. No hallucinations.",
                icon: ShieldCheck,
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all"
              >
                <div className={`${feature.bg} ${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-slate-400 font-medium">Three steps to a better Tampa life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>

            {[
              {
                step: "01",
                title: "Chat your need",
                desc: "Ask about anything from 'decor for a gender reveal' to 'volunteer ops this Saturday'.",
                icon: MessageSquare
              },
              {
                step: "02",
                title: "Get curated matches",
                desc: "Our AI scans our verified Tampa database to find the perfect fits for your request.",
                icon: Sparkles
              },
              {
                step: "03",
                title: "Message instantly",
                desc: "Connect with vendors directly via WhatsApp or Instagram. No friction, just action.",
                icon: CheckCircle
              }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-8 border-4 border-slate-900 shadow-2xl">
                  <item.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 sm:p-16 text-center text-white shadow-2xl shadow-blue-200 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl sm:text-5xl font-black mb-8 leading-tight">
                Ready to explore Tampa <br /> like a pro?
              </h2>
              <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto font-medium">
                Join thousands of Tampa neighbors using AI to simplify their local life. No sign-up required to start chatting.
              </p>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all"
              >
                Try it free – Start now
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter">NeighborWings AI</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 NeighborWings AI. Built for the Tampa Bay community.
          </p>
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

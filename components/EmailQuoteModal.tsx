
import React, { useState } from 'react';
import { X, Mail, Send, Loader2, CheckCircle } from 'lucide-react';

interface EmailQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const EmailQuoteModal: React.FC<EmailQuoteModalProps> = ({ isOpen, onClose, content }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const extractMatches = (text: string) => {
    // Simple extraction of bullet points which likely contain the matches and descriptions
    return text.split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('-') || trimmed.startsWith('*');
      })
      .join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const matches = extractMatches(content);
      const emailBody = `
Subject: Your NeighborWings AI Vendor Quote

Hi ${formData.name || 'Neighbor'}! 

Here's your personalized Tampa event vendor quote from NeighborWings AI:

${matches}

--------------------------------------------------
This is a prototype – in the real version this would be sent via an email service.
NeighborWings AI - Tampa's Local Matchmaker
`;

      console.log('--- EMAIL SENT SIMULATION ---');
      console.log(`To: ${formData.email}`);
      console.log(emailBody);
      console.log('-----------------------------');

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '' });
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Email Quote</h2>
              <p className="text-xs text-slate-500 font-medium">Save these matches for later</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Quote Sent!</h3>
              <p className="text-slate-600 text-sm max-w-xs mx-auto">
                We've sent your personalized vendor list to <strong>{formData.email}</strong>.
                <br/>
                <span className="text-xs text-slate-400 mt-2 block">(Check browser console for simulation)</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Name <span className="text-slate-400 font-normal normal-case">(Optional)</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="What should we call you?"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50/50 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Quote...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Email This Quote
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

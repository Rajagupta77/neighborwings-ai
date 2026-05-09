
import React, { useState } from 'react';
import { Message } from '../types';
import { Copy, User, Check, Zap, ClipboardList, ExternalLink, Mail, CalendarCheck, MessageCircle, Instagram, ChevronDown, ChevronUp, Star, MapPin as PinIcon, DollarSign, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EmailQuoteModal } from './EmailQuoteModal';
import { VENDORS } from '../data';
import { VendorCard } from './VendorCard';

interface ChatMessageProps {
  message: Message;
  onSendMessage?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSendMessage }) => {
  const [copiedText, setCopiedText] = useState<'message' | 'matches' | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const isUser = message.role === 'user';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleBookBundle = (vendorName: string) => {
    if (onSendMessage) {
      onSendMessage(`I want to book ${vendorName}. Can you help?`);
    }
  };

  const handleWhatsApp = (vendorName: string, phone: string) => {
    const text = `Hi ${vendorName}! Interested in your services via NeighborWings AI.`;
    const url = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setToastMessage("Opening WhatsApp...");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleInstagram = (username: string) => {
    const url = `https://instagram.com/${username.replace('@', '')}`;
    window.open(url, '_blank');
    setToastMessage("Opening Instagram...");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const copyToClipboard = (type: 'message' | 'matches') => {
    let contentToCopy = '';
    
    if (type === 'message') {
      contentToCopy = message.content.includes("Hi [") 
        ? message.content.split(/\n\n/).find(p => p.toLowerCase().includes("hi [")) || message.content
        : message.content;
    } else {
      const lines = message.content.split('\n');
      contentToCopy = lines
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('-') || trimmed.startsWith('*');
        })
        .join('\n');
        
      if (!contentToCopy) contentToCopy = message.content;
    }
      
    navigator.clipboard.writeText(contentToCopy);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const isTemplatePresent = message.content.toLowerCase().includes("hi [") || message.content.toLowerCase().includes("dear [");
  const isMatchesPresent = message.content.includes('|') && (message.content.includes('-') || message.content.includes('*'));
  
  // Detect if this is a booking follow-up to avoid re-rendering the vendor card
  const bookingKeywords = [
    "when is your event",
    "specific services are you looking for",
    "how many guests",
    "share your name and email",
    "sent your booking request",
    "contact them directly"
  ];
  const isBookingFollowUp = bookingKeywords.some(keyword => message.content.toLowerCase().includes(keyword.toLowerCase()));

  // Helper to extract plain text from React children
  const extractText = (children: React.ReactNode): string => {
    return React.Children.toArray(children)
      .map(child => {
        if (typeof child === 'string' || typeof child === 'number') return child.toString();
        if (React.isValidElement(child) && (child.props as any).children) {
          return extractText((child.props as any).children);
        }
        return '';
      })
      .join('');
  };

  // Helper to extract context from message content or history
  const getVendorContext = () => {
    const content = message.content.toLowerCase();
    const context: any = {};
    
    // Try to find budget
    const budgetMatch = content.match(/\$\d+/);
    if (budgetMatch) context.budget = budgetMatch[0];
    
    // Try to find service
    if (content.includes('decor')) context.service = 'decor';
    else if (content.includes('photo')) context.service = 'photography';
    else if (content.includes('cater')) context.service = 'catering';
    else if (content.includes('balloon')) context.service = 'balloons';
    
    return context;
  };

  const vendorContext = getVendorContext();

  return (
    <>
      <EmailQuoteModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        content={message.content}
      />
      
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-3 duration-500'}`}>
        <div className={`flex max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
          <div className="flex flex-col w-full min-w-0">
            <div className={`px-6 py-4 rounded-3xl text-[16px] leading-relaxed relative ${
              isUser 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200/50' 
                : 'bg-slate-50 text-slate-800 border border-slate-100'
            } ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
              {isUser ? (
                <div className="whitespace-pre-wrap font-medium">{message.content}</div>
              ) : (
                <div className="markdown-body prose prose-slate max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => {
                        const contentText = extractText(children);
                        const isParaTemplate = contentText.toLowerCase().includes("hi [");
                        
                        const foundVendor = VENDORS.find(v => 
                          contentText.toLowerCase().includes(v.name.toLowerCase())
                        );
                        
                        const renderContent = () => {
                          if (contentText.includes('[[')) {
                            const parts = contentText.split(/(\[\[.*?\]\])/g);
                            return (
                              <div className="leading-relaxed inline-block w-full">
                                {parts.map((part, i) => {
                                  if (part.startsWith('[[') && part.endsWith(']]')) {
                                    const actionText = part.slice(2, -2);
                                    
                                    // Handle CONTACT_BUTTONS marker
                                    if (actionText.startsWith('CONTACT_BUTTONS:')) {
                                      const vNamePart = actionText.split(':')[1];
                                      const vName = vNamePart ? vNamePart.replace(/[\[\]]/g, '').trim() : '';
                                      const vendor = VENDORS.find(v => v.name.toLowerCase() === vName.toLowerCase());
                                      
                                      if (vendor) {
                                        return (
                                          <div key={i} className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                            <button 
                                              onClick={() => handleWhatsApp(vendor.name, vendor.phone || '')}
                                              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                            >
                                              <MessageCircle className="w-4 h-4" />
                                              WhatsApp
                                            </button>
                                            <button 
                                              onClick={() => handleInstagram(vendor.instagram || '')}
                                              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                            >
                                              <Instagram className="w-4 h-4" />
                                              Instagram
                                            </button>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }

                                    return (
                                      <button
                                        key={i}
                                        onClick={() => onSendMessage && onSendMessage(actionText)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white hover:bg-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer align-middle shadow-md mb-1 mr-1"
                                      >
                                        {actionText}
                                      </button>
                                    );
                                  }
                                  return <span key={i}>{part}</span>;
                                })}
                              </div>
                            );
                          }
                          return <p className="leading-relaxed">{children}</p>;
                        };

                        if (foundVendor && !isBookingFollowUp) {
                          return (
                            <VendorCard vendorName={foundVendor.name} onSendMessage={onSendMessage} context={vendorContext}>
                              {renderContent()}
                            </VendorCard>
                          );
                        }
                        
                        return (
                          <div className={`${isParaTemplate ? 'template-block text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100' : 'mb-2 last:mb-0'}`}>
                            {renderContent()}
                          </div>
                        );
                      },
                      ul: ({ children }) => <ul className="mb-2 list-disc ml-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => {
                        const contentText = extractText(children);
                        
                        const foundVendor = VENDORS.find(v => 
                          contentText.toLowerCase().includes(v.name.toLowerCase())
                        );
                        if (foundVendor && !isBookingFollowUp) {
                          return (
                            <li className="list-none mb-4 pl-0">
                              <VendorCard vendorName={foundVendor.name} onSendMessage={onSendMessage} context={vendorContext}>
                                {children}
                              </VendorCard>
                            </li>
                          );
                        }

                        return (
                          <li className="pl-1">
                            <div className="inline-block w-full">
                              {children}
                            </div>
                          </li>
                        );
                      },
                      strong: ({ children }) => <span className="font-bold text-slate-900">{children}</span>,
                      em: ({ children }) => <span className="italic text-slate-500">{children}</span>,
                      h1: ({ children }) => <h1 className="text-lg font-bold text-slate-900 mb-2 mt-4 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-md font-bold text-slate-900 mb-2 mt-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold text-slate-700 mb-1 mt-2">{children}</h3>,
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4 decoration-blue-100 inline-flex items-center gap-1"
                        >
                          {children} <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-3 rounded-lg border border-slate-100 shadow-sm">
                          <table className="min-w-full divide-y divide-slate-100 text-xs">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>,
                      tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors uppercase tracking-tight font-bold">{children}</tr>,
                      th: ({ children }) => <th className="px-3 py-2 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-slate-600">{children}</td>,
                      code: ({ children }) => (
                        <code className="bg-slate-50 text-indigo-600 rounded px-1 min-w-[20px] font-mono border border-slate-100">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-slate-900 text-white p-3 rounded-xl overflow-x-auto my-3 text-[11px] font-mono shadow-inner">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => {
                        const isSmartBundle = React.Children.toArray(children).some((child: any) => {
                           if (child && typeof child === 'object' && 'props' in child) {
                             const text = Array.isArray(child.props.children) 
                               ? child.props.children.map((c: any) => c?.toString() || '').join('')
                               : child.props.children?.toString() || '';
                             return text.includes('Smart Bundle');
                           }
                           return false;
                        });

                        if (isSmartBundle) {
                          const contentText = extractText(children);
                          
                          const foundVendor = VENDORS.find(v => 
                            contentText.toLowerCase().includes(v.name.toLowerCase())
                          );

                          if (foundVendor) {
                            return (
                              <div className="my-4 relative">
                                <div className="absolute -top-2 left-4 z-10 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-xl flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Smart Bundle
                                </div>
                                <VendorCard vendorName={foundVendor.name} onSendMessage={onSendMessage} context={vendorContext}>
                                  {children}
                                </VendorCard>
                              </div>
                            );
                          }

                          return (
                            <blockquote className="border-l-2 border-slate-900 pl-4 bg-slate-50 py-3 pr-4 rounded-r-xl my-3 relative overflow-hidden">
                              <div className="text-slate-800 text-[14px] relative z-10 font-bold">
                                {children}
                              </div>
                              {onSendMessage && (
                                <button 
                                  onClick={() => onSendMessage("I'm interested in the smart bundle you suggested. Can we book it?")}
                                  className="mt-3 relative z-10 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white hover:bg-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95"
                                >
                                  <CalendarCheck className="w-3 h-3" />
                                  Book This Bundle
                                </button>
                              )}
                            </blockquote>
                          );
                        }
                        
                        return (
                          <blockquote className="border-l-2 border-slate-200 pl-4 italic text-slate-500 my-2">
                            {children}
                          </blockquote>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {!isUser && (isTemplatePresent || isMatchesPresent) && (
                <div className="flex flex-wrap gap-2 justify-end mt-3 pt-3 border-t border-slate-50 relative">
                  {(copiedText || toastMessage) && (
                    <div className="absolute -top-12 right-0 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
                      <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{toastMessage || (copiedText === 'matches' ? 'Match List Copied!' : 'Message Copied!')}</span>
                      </div>
                    </div>
                  )}

                  {isMatchesPresent && (
                    <>
                      <button 
                         onClick={() => setIsEmailModalOpen(true)}
                         className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 text-white rounded-xl font-bold text-[9px] uppercase tracking-wider shadow-sm hover:bg-black transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        Email Quote
                      </button>

                      <button 
                        onClick={() => copyToClipboard('matches')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all border ${
                          copiedText === 'matches' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {copiedText === 'matches' ? <Check className="w-3 h-3" aria-hidden="true" /> : <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />}
                        {copiedText === 'matches' ? 'Copied' : 'Match List'}
                      </button>
                    </>
                  )}
                  
                  {isTemplatePresent && (
                    <button 
                      onClick={() => copyToClipboard('message')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all border ${
                        copiedText === 'message'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {copiedText === 'message' ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                      {copiedText === 'message' ? 'Copied' : 'Message'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Removed metadata for cleaner look */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;

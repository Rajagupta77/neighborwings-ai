
import React, { useState } from 'react';
import { Message } from '../types';
import { Copy, User, Check, Zap, ClipboardList, ExternalLink, Mail, CalendarCheck, MessageCircle, Instagram, ChevronDown, ChevronUp, Star, MapPin as PinIcon, DollarSign } from 'lucide-react';
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
      
      <div className={`flex w-full mb-2 ${isUser ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2 duration-300'}`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center shadow-sm ${
            isUser 
              ? 'bg-slate-800 ml-2' 
              : 'bg-gradient-to-br from-blue-600 to-indigo-700 mr-2'
          }`}>
            {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Zap className="w-3.5 h-3.5 text-white" />}
          </div>
          
          <div className="flex flex-col w-full min-w-0">
            <div className={`px-3 py-2 rounded-xl shadow-sm text-[13px] leading-[1.4] relative h-auto overflow-y-auto max-h-[500px] ${
              isUser 
                ? 'bg-[#F2F4F7] text-slate-800 rounded-tr-none border border-slate-200' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none prose-custom'
            }`}>
              {isUser ? (
                <div className="whitespace-pre-wrap font-medium">{message.content}</div>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => {
                      const contentText = extractText(children);
                      const isParaTemplate = contentText.toLowerCase().includes("hi [");
                      
                      // Check for vendor names in paragraph (e.g. Surprise Me)
                      // Match either **Name** or just Name if it's a clear vendor match
                      const foundVendor = VENDORS.find(v => 
                        contentText.toLowerCase().includes(v.name.toLowerCase())
                      );
                      
                      const renderContent = () => {
                        if (contentText.includes('[[')) {
                          const parts = contentText.split(/(\[\[.*?\]\])/g);
                          return (
                            <p className="leading-relaxed inline">
                              {parts.map((part, i) => {
                                if (part.startsWith('[[') && part.endsWith(']]')) {
                                  const actionText = part.slice(2, -2);
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => onSendMessage && onSendMessage(actionText)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer align-middle shadow-sm"
                                    >
                                      {actionText}
                                    </button>
                                  );
                                }
                                return <span key={i}>{part}</span>;
                              })}
                            </p>
                          );
                        }
                        return <p className="leading-relaxed">{children}</p>;
                      };

                      if (foundVendor) {
                        return (
                          <VendorCard vendorName={foundVendor.name} onSendMessage={onSendMessage} context={vendorContext}>
                            {renderContent()}
                          </VendorCard>
                        );
                      }
                      
                      return (
                        <div className={`${isParaTemplate ? 'template-block font-medium' : 'mb-2 last:mb-0'}`}>
                          {renderContent()}
                        </div>
                      );
                    },
                    ul: ({ children }) => <ul className="mb-3 list-disc ml-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => {
                      const contentText = extractText(children);
                      
                      // Check for vendor match in list item
                      const foundVendor = VENDORS.find(v => 
                        contentText.toLowerCase().includes(v.name.toLowerCase())
                      );
                      if (foundVendor) {
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
                    strong: ({ children }) => <span className="font-bold text-slate-900 text-[14px]">{children}</span>,
                    em: ({ children }) => <span className="italic text-slate-500">{children}</span>,
                    h1: ({ children }) => <h1 className="text-base font-bold text-slate-900 mb-2 mt-3 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold text-slate-900 mb-2 mt-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 mt-2">{children}</h3>,
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-0.5"
                      >
                        {children} <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2 rounded-lg border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-xs">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
                    tbody: ({ children }) => <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>,
                    tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors">{children}</tr>,
                    th: ({ children }) => <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-slate-700">{children}</td>,
                    code: ({ children }) => (
                      <code className="bg-slate-100 text-pink-600 rounded px-1.5 py-0.5 text-[10px] font-mono border border-slate-200">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-slate-900 text-slate-50 p-2 rounded-lg overflow-x-auto my-2 text-[10px] font-mono shadow-inner">
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
                              <div className="absolute -top-3 left-4 z-10 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5 fill-white" /> Smart Bundle
                              </div>
                              <VendorCard vendorName={foundVendor.name} onSendMessage={onSendMessage} context={vendorContext}>
                                {children}
                              </VendorCard>
                            </div>
                          );
                        }

                        return (
                          <blockquote className="border-l-4 border-indigo-500 pl-3 bg-indigo-50 py-2 pr-2 rounded-r-lg my-2 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 opacity-10">
                              <Zap className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="text-indigo-900 text-xs relative z-10 font-medium leading-relaxed">
                              {children}
                            </div>
                            {onSendMessage && (
                              <button 
                                onClick={() => onSendMessage("I'm interested in the smart bundle you suggested. Can we book it?")}
                                className="mt-2 relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[9px] font-bold uppercase tracking-wider rounded-md transition-all shadow-sm active:scale-95"
                              >
                                <CalendarCheck className="w-3 h-3" />
                                Book This Bundle
                              </button>
                            )}
                          </blockquote>
                        );
                      }
                      
                      return (
                        <blockquote className="border-l-4 border-blue-200 pl-3 italic text-slate-500 my-2 bg-slate-50 py-2 pr-2 rounded-r-lg text-xs">
                          {children}
                        </blockquote>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              
              {!isUser && (isTemplatePresent || isMatchesPresent) && (
                <div className="flex flex-wrap gap-2 justify-end mt-3 pt-3 border-t border-slate-100 relative">
                  {(copiedText || toastMessage) && (
                    <div className="absolute -top-14 right-0 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
                      <div className="bg-slate-900 text-white text-[11px] font-bold py-2 px-3 rounded-lg shadow-xl shadow-slate-300/50 flex items-center gap-2">
                        <div className="bg-green-500 rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span>{toastMessage || (copiedText === 'matches' ? 'Match List Copied!' : 'Message Copied!')}</span>
                        <div className="absolute -bottom-1 right-6 w-2.5 h-2.5 bg-slate-900 rotate-45"></div>
                      </div>
                    </div>
                  )}

                  {isMatchesPresent && (
                    <>
                      <button 
                        onClick={() => setIsEmailModalOpen(true)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all transform active:scale-95 shadow-sm border bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 min-h-[44px]"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        Email Quote
                      </button>

                      <button 
                        onClick={() => copyToClipboard('matches')}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all transform active:scale-95 shadow-sm border min-h-[44px] ${
                          copiedText === 'matches' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {copiedText === 'matches' ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />}
                        {copiedText === 'matches' ? 'Copied' : 'Copy Match List'}
                      </button>
                    </>
                  )}
                  
                  {isTemplatePresent && (
                    <button 
                      onClick={() => copyToClipboard('message')}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all transform active:scale-95 shadow-sm border min-h-[44px] ${
                        copiedText === 'message'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {copiedText === 'message' ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                      {copiedText === 'message' ? 'Copied' : 'Copy Message'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className={`flex items-center gap-1.5 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {isUser ? 'You' : 'NeighborWings'}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;

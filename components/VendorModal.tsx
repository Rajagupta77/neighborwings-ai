
import React, { useState } from 'react';
import { X, CheckCircle, Loader2, Store, CreditCard, Info } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key from the dashboard
const stripePromise = loadStripe('pk_test_51T5wNi4Z6oWBqhmWSdSonUiMg4byHzyaoLAUD6xLSDSwfQTpbC2fhKarvtwdMGKiESy38FgJBSVCSfdtAtdujIJP006EAb7Pza');

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_TYPES = [
  'Event Decor & Balloons',
  'Photography & Video',
  'Catering & Food',
  'Venue & Space',
  'Entertainment & Music',
  'Planning & Coordination',
  'Other'
];

const VendorFormContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    businessName: '',
    serviceType: 'Event Decor & Balloons',
    priceRange: '',
    location: '',
    rating: '',
    email: '',
    description: '',
    instagram: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Frontend Rate Limiting - Keep this as is
  const now = Date.now();
  if (now - lastSubmitTime < 30000) {
    setPaymentError('Please wait a moment before submitting again.');
    return;
  }

  // Basic Input Validation - Keep this as is
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email.trim().toLowerCase())) {
    setPaymentError('Please enter a valid email address.');
    return;
  }

  if (!stripe || !elements) {
    setPaymentError('Payment system not loaded. Please try again.');
    return;
  }

  setIsSubmitting(true);
  setPaymentError(null);
  setLastSubmitTime(now);

  try {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
      billing_details: {
        name: formData.businessName,
        email: formData.email,
      },
    });

    if (error) {
      setPaymentError(error.message);
      return;
    }

    // Prepare vendor data to match Supabase columns
    const vendorData = {
      name: formData.businessName.trim(),
      service: formData.serviceType.trim(),
      price_range: formData.priceRange.trim(),
      location: formData.location.trim(),
      rating: formData.rating ? Number(formData.rating) : null,
      email: formData.email.trim(),
      description: formData.description.trim(),
      instagram: formData.instagram?.trim() || null,
      // whatsapp: formData.whatsapp?.trim() || null, // Add if you have the field
    };

    // Call Supabase Edge Function to process payment + save vendor
    const res = await fetch(
      'https://glwxjshknoxebxtkriaq.supabase.co/functions/v1/process-vendor-payment', // Replace with your actual Edge Function URL from Supabase dashboard
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          vendorData,  // Send vendor data to backend
          amount: 1900,  // $19.00 in cents (test amount)
        }),
      }
    );

    const result = await res.json();

    if (!res.ok || result.error) {
      throw new Error(result.error || 'Payment failed');
    }

    console.log('Payment successful, vendor saved:', result.vendor);
    setIsSuccess(true);

    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);

  } catch (err: any) {
    setPaymentError(err.message || 'An error occurred during payment');
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
        <p className="text-slate-600 text-sm max-w-xs mx-auto">
          Thanks for joining NeighborWings. Your listing has been submitted and will be reviewed shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Business Name <span className="text-red-500">*</span></label>
          <input
            required
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="e.g. Sunny Florals"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all appearance-none"
          >
            {SERVICE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price Range</label>
          <input
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            placeholder="e.g. $200-500"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Ybor City"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hello@business.com"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Instagram (Optional)</label>
          <input
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell neighbors about your services..."
          rows={2}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all resize-none"
        />
      </div>

      {/* Stripe Payment Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-500" />
            Listing Fee ($19.00)
          </label>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">One-time payment</span>
        </div>
        
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50/50 transition-all">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1e293b',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': {
                    color: '#94a3b8',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
        
        <div className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">
            <strong>Test Mode:</strong> Use card <code className="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiry and CVC.
          </p>
        </div>

        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-1">
            {paymentError}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !stripe}
          className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <>
              <span className="text-sm">Pay $19.00 & Submit Listing</span>
              <span className="text-[9px] text-white/50 font-medium uppercase tracking-widest group-hover:text-white/70 transition-colors">Secure Checkout via Stripe</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Join as Vendor</h2>
              <p className="text-xs text-slate-500 font-medium">Connect with Tampa locals</p>
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
        <div className="overflow-y-auto p-6 scroll-smooth">
          <Elements stripe={stripePromise}>
            <VendorFormContent onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

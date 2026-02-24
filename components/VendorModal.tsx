
import React, { useState } from 'react';
import { X, CheckCircle, Loader2, Store } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    serviceType: 'Event Decor & Balloons',
    priceRange: '',
    location: '',
    rating: '',
    email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const vendorData = {
    name: formData.businessName.trim(),
    service: formData.serviceType,
    price_range: formData.priceRange.trim(),
    location: formData.location.trim(),
    rating: formData.rating ? Number(formData.rating) : null,
    email: formData.email.trim(),
    description: formData.description.trim(),
    instagram: (formData as any).instagram?.trim() || null,
    // whatsapp: formData.whatsapp?.trim() || null,   // uncomment later if you add the field
  };

  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select();

    if (error) throw error;

    console.log('✅ Vendor saved to Supabase:', data);
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        businessName: '',
        serviceType: 'Event Decor & Balloons',
        priceRange: '',
        location: '',
        rating: '',
        email: '',
        description: ''
      });
      onClose();
    }, 2500);

  } catch (err: any) {
    console.error('❌ Supabase error:', err);
    setIsSubmitting(false);
    alert('Failed to submit: ' + (err.message || 'Please check console'));
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
              <p className="text-slate-600 text-sm max-w-xs mx-auto">
                Thanks for joining NeighborWings. Your listing has been logged and will be reviewed shortly.
              </p>
            </div>
          ) : (
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
                    value={(formData as any).instagram || ''}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  />
                  <p className="text-[9px] text-slate-400">Share your profile so users can see your portfolio</p>
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
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Listing'
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                  MVP Mode: Data is logged to console only.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

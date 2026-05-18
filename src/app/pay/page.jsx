"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, Loader2, ArrowRight, Sparkles } from "lucide-react";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const defaultAmount = searchParams.get("amount") || "1";
  const defaultPurpose = searchParams.get("purpose") || "Basic Development";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: defaultAmount,
    purpose: defaultPurpose
  });

  // Dynamic updates if query parameters change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amount: searchParams.get("amount") || prev.amount,
      purpose: searchParams.get("purpose") || prev.purpose,
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.phone && formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      // Execute a server-to-server request to the local API endpoint
      const response = await fetch("/api/pay/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gateway initialization failed.");
      }

      if (data.payment_url) {
        // Relocate browser to Instamojo checkout URL
        window.location.href = data.payment_url;
      } else {
        throw new Error("Invalid checkout payload returned by api.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div>
        <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
          Your Name
        </label>
        <input 
          type="text" 
          name="name"
          required
          placeholder="e.g. Navneet Kumar"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-black/45 border border-white/5 focus:border-primary/55 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium placeholder:text-neutral-600"
        />
      </div>
      
      <div>
        <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
          Email Address
        </label>
        <input 
          type="email" 
          name="email"
          required
          placeholder="name@studio.com"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-black/45 border border-white/5 focus:border-primary/55 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium placeholder:text-neutral-600"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
          Phone (Optional)
        </label>
        <input 
          type="tel" 
          name="phone"
          placeholder="e.g. 9876543210 (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-black/45 border border-white/5 focus:border-primary/55 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium placeholder:text-neutral-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
            Selected Tier
          </label>
          <input 
            type="text" 
            name="purpose"
            required
            readOnly
            value={formData.purpose}
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-neutral-400 focus:outline-none cursor-not-allowed font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
            Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">₹</span>
            <input 
              type="text" 
              name="amount"
              required
              readOnly
              value={formData.amount}
              className="w-full bg-white/5 border border-white/5 rounded-2xl pl-8 pr-4 py-3.5 text-xs text-neutral-400 focus:outline-none cursor-not-allowed font-semibold"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-2xl text-[11px] font-medium leading-relaxed">
          {error}
        </div>
      )}

      {/* Security notice */}
      <div className="flex items-center gap-2 pt-2 justify-center text-[10px] text-neutral-500">
        <Shield className="w-3.5 h-3.5 text-neutral-600" />
        <span>Encrypted checkout powered by Instamojo</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-6 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] hover:bg-neutral-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Connecting Gateway...</span>
          </>
        ) : (
          <>
            <span>Proceed to Pay ₹{formData.amount}</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </>
        )}
      </button>
    </form>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Dynamic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#0d0d12]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(82,39,255,0.15)] z-10">
        
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold">
            SECURE CHECKOUT
          </span>
        </div>

        <h1 className="text-2xl font-headline font-bold text-white tracking-tight mb-2">
          Complete Purchase
        </h1>
        <p className="text-neutral-400 text-xs mb-8">
          Fill in your details below to seamlessly initialize the payment request.
        </p>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12 text-white">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <span className="text-xs font-mono text-neutral-500">Preparing form...</span>
          </div>
        }>
          <CheckoutForm />
        </Suspense>
        
        <div className="mt-8 text-center border-t border-white/5 pt-4">
          <p className="text-[10px] text-neutral-600">
            Partner merchant <span className="font-semibold text-neutral-400">Instamojo Gateway</span>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

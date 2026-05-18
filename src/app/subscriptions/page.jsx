"use client";

import { useState, useTransition } from "react";
import { CreditCard, CheckCircle, Shield, X, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const plans = [
    {
      name: "Basic Development",
      price: "1",
      description: "Perfect for individuals and solo developers looking for premium spatial components.",
      features: [
        "3 page website",
        "static animations",
        "security",
        "customer support"
      ],
      isPopular: false,
      color: "from-blue-500/20 to-indigo-500/20",
      accent: "text-blue-400"
    },
    {
      name: "Plus Plan",
      price: "1",
      description: "Ideal for fast-growing freelance businesses and modern web design agencies.",
      features: [
        "5 page website",
        "animations",
        "effects hover efffects",
        "scroll effects"
      ],
      isPopular: true,
      color: "from-primary/20 to-purple-500/20",
      accent: "text-primary"
    },
    {
      name: "Ultra Development",
      price: "1",
      description: "Custom tailor-made integration pipelines and advanced spatial visualizers.",
      features: [
        "7 page website",
        "landing page",
        "home page",
        "error 404 page",
        "secure",
        "email integrated",
        "and much more"
      ],
      isPopular: false,
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400"
    }
  ];

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setCheckoutError(null);
  };

  const handleCloseCheckout = () => {
    if (checkoutLoading) return; // Prevent closing while processing payment
    setSelectedPlan(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError(null);

    if (formData.phone && formData.phone.length !== 10) {
      setCheckoutError("Phone number must be exactly 10 digits.");
      setCheckoutLoading(false);
      return;
    }

    try {
      // 1. Fire asynchronous POST request directly to the backend payment route
      const response = await fetch("/api/pay/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          purpose: `${selectedPlan.name} Subscription`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gateway initialization failed. Please try again.");
      }

      // 2. Safely capture the Instamojo longurl and redirect the browser dynamically
      if (data.payment_url) {
        console.log("[Redirecting] Relocating checkout window to Instamojo longurl:", data.payment_url);
        window.location.href = data.payment_url;
      } else {
        throw new Error("Invalid response format received from payment handler.");
      }

    } catch (err) {
      console.error("[Checkout Failure] Payment pipeline error:", err);
      setCheckoutError(err.message || "An unexpected network error occurred.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 flex flex-col items-center relative overflow-hidden font-body">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-3 text-neutral-400 hover:text-white transition-colors z-20 group">
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors shadow-lg">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block mt-0.5">Go Back</span>
      </Link>

      {/* Header Container */}
      <div className="text-center mb-20 max-w-3xl z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary/80">Ethereal Studio Pricing</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent uppercase tracking-tight">
          Choose Your Digital Tier
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Instantly unlock production-grade spatial UI tools and premium 3D assets. Verified and automated securely via Instamojo.
        </p>
      </div>

      {/* Cards Pricing Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10 px-4">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 bg-[#0d0d12]/60 backdrop-blur-md border ${
              plan.isPopular 
                ? "border-primary/50 shadow-[0_0_50px_rgba(82,39,255,0.15)] md:-translate-y-2 scale-[1.02]" 
                : "border-white/5 hover:border-white/10"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                RECOMMENDED
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h2>
              <p className="text-neutral-400 text-xs leading-relaxed min-h-[40px]">{plan.description}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-black tracking-tight">₹{plan.price}</span>
              <span className="text-neutral-500 text-xs">/ lifetime access</span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-xs text-neutral-300">
                  <CheckCircle className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${plan.accent}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleOpenCheckout(plan)}
              className={`w-full py-4 rounded-2xl font-headline font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                plan.isPopular
                  ? "bg-white text-black hover:bg-neutral-200 shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>

      {/* SECURE DIRECT CHECKOUT MODAL OVERLAY */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          {/* Modal Backdrop click handler */}
          <div className="absolute inset-0" onClick={handleCloseCheckout} />

          <div className="relative w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(82,39,255,0.25)] z-10 overflow-hidden">
            
            {/* Close Button */}
            <button 
              onClick={handleCloseCheckout}
              disabled={checkoutLoading}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 text-neutral-400 hover:text-white transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <span className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold block mb-1">
                SECURE GATEWAY
              </span>
              <h3 className="text-2xl font-headline font-bold text-white tracking-tight">
                Initialize Checkout
              </h3>
              <p className="text-neutral-400 text-xs mt-1">
                You are subscribing to <span className="text-white font-bold">{selectedPlan.name}</span> for <span className="text-primary font-bold">₹{selectedPlan.price}</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Navneet Kumar"
                  value={formData.name}
                  onChange={handleFormChange}
                  disabled={checkoutLoading}
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
                  onChange={handleFormChange}
                  disabled={checkoutLoading}
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
                  onChange={handleFormChange}
                  disabled={checkoutLoading}
                  className="w-full bg-black/45 border border-white/5 focus:border-primary/55 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium placeholder:text-neutral-600"
                />
              </div>

              {checkoutError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-2xl text-[11px] font-medium leading-relaxed">
                  {checkoutError}
                </div>
              )}

              {/* Secure partner banner */}
              <div className="flex items-center gap-2 pt-2 pb-1 justify-center text-[10px] text-neutral-500">
                <Shield className="w-3.5 h-3.5 text-neutral-600" />
                <span>Encrypted 256-bit connection powered by Instamojo</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-6 py-4 font-headline text-xs font-black uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors disabled:opacity-75 disabled:cursor-not-allowed mt-4 shadow-lg"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Connecting Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Pay ₹{selectedPlan.price}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

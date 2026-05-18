"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [verificationState, setVerificationState] = useState("verifying"); // verifying | success | failed
  const [orderDetails, setOrderDetails] = useState(null);
  const [dots, setDots] = useState("");

  // Simple loading animation text effect
  useEffect(() => {
    if (verificationState !== "verifying") return;
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [verificationState]);

  // Synchronous server-side verification check
  useEffect(() => {
    if (!orderId) {
      setVerificationState("failed");
      return;
    }

    const verifyTransaction = async () => {
      try {
        console.log(`[Cashfree Client] Querying status for order ${orderId}...`);
        
        // Fetch direct live status verification from our backend api
        const res = await fetch(`/api/verify-payment?order_id=${orderId}`);
        const data = await res.json();

        if (res.ok && data.isPaid) {
          setOrderDetails(data);
          setVerificationState("success");
        } else {
          console.warn("[Cashfree Client] Verification returned unpaid state:", data);
          setVerificationState("failed");
        }
      } catch (error) {
        console.error("[Cashfree Client] Network error checking status:", error);
        setVerificationState("failed");
      }
    };

    // Add a slight natural delay so the micro-animations shimmer elegantly
    const timer = setTimeout(() => {
      verifyTransaction();
    }, 1800);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (verificationState === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-md w-full bg-[#0d0d12]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_0_80px_rgba(82,39,255,0.15)] text-center">
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-70" />
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">Verifying Payment</h2>
        <p className="text-neutral-400 text-sm max-w-xs mb-4">
          Synchronizing transactional states and provisioning premium access{dots}
        </p>
        <span className="text-[10px] font-mono text-neutral-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          SECURE CONNECTION ACTIVE
        </span>
      </div>
    );
  }

  if (verificationState === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-md w-full bg-[#0d0d12]/80 backdrop-blur-2xl border border-emerald-500/10 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.15)] text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
        
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Payment Verified!</h2>
        <p className="text-neutral-400 text-sm mb-6 max-w-xs">
          Thank you! Your freelance transaction has been credited. Premium features and directories are now unlocked.
        </p>

        {/* Payment Metadata Display */}
        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 mb-8 text-left text-xs font-mono space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-neutral-500 uppercase tracking-wider text-[9px]">Order ID</span>
            <span className="text-emerald-400 font-semibold">{orderId?.substring(0, 22) || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-b border-white/5 pb-2">
            <span className="text-neutral-500 uppercase tracking-wider text-[9px]">Amount Paid</span>
            <span className="text-neutral-300">₹{orderDetails?.amount || "N/A"} INR</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-neutral-500 uppercase tracking-wider text-[9px]">Provision Status</span>
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        <Link 
          href="/"
          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-3.5 font-bold hover:bg-neutral-200 transition-all text-sm duration-300"
        >
          Enter Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-md w-full bg-[#0d0d12]/80 backdrop-blur-2xl border border-rose-500/10 rounded-3xl shadow-[0_0_80px_rgba(244,63,94,0.15)] text-center relative overflow-hidden">
      <div className="absolute -top-12 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full" />
      
      <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
        <XCircle className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Payment Unsuccessful</h2>
      <p className="text-neutral-400 text-sm mb-8 max-w-xs">
        The transaction was either cancelled or failed at the payment partner's page. No charges have been made.
      </p>

      <div className="flex flex-col gap-3 w-full">
        <Link 
          href="/subscriptions"
          className="w-full flex items-center justify-center rounded-xl bg-white text-black px-6 py-3.5 font-bold hover:bg-neutral-200 transition-all text-sm duration-300"
        >
          Try Again
        </Link>
        <Link 
          href="/"
          className="w-full flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white px-6 py-3.5 font-bold hover:bg-white/10 transition-all text-sm duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Decorative gradient overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span className="text-sm font-mono text-neutral-500">Initializing...</span>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

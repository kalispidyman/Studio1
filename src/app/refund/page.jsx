"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle, Calendar } from "lucide-react";

export default function CancellationAndRefundPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-8 relative overflow-hidden font-body selection:bg-primary/30">
      {/* Decorative premium blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Navigation back */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.02, x: -3 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-headline text-neutral-400 hover:text-white mb-12 cursor-pointer bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </motion.div>
        </Link>

        {/* Title Block */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-primary animate-spin-slow" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary/80">Policies</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent uppercase font-headline mb-4">
            Refund & Cancellation
          </h1>
          <p className="text-neutral-500 text-xs font-mono uppercase">
            Effective Date: May 18, 2026 | Operating under Studio1
          </p>
        </div>

        {/* Policy Box */}
        <div className="bg-[#0a0a0c]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-10 text-neutral-300 text-sm leading-relaxed space-y-8 shadow-2xl">
          
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-xs text-neutral-300 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>CONTRACT BINDING SUMMARY</span>
            </div>
            <p>
              Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with Neet operating as Studio1 (“us”, “we”, or “our”) to purchase the product and/or service via our Platform (<a href="https://neetstudios.vercel.app" target="_blank" rel="noreferrer" className="text-primary underline">https://neetstudios.vercel.app</a>).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary font-mono">1.</span> CANCELLATION CONDITIONS
            </h2>
            <p>
              After a payment is processed, the User may not cancel the Transaction unless a specific cancellation allowance has been explicitly provided for that specific service or deliverable on the Platform. We shall retain sole discretion in evaluating and approving any cancellation requests, and we reserve the right to ask for additional details or verification before approving any requests.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary font-mono">2.</span> RETURN, REPLACEMENT, AND REFUND ELIGIBILITY
            </h2>
            <p>
              Once you have received or unlocked the product and/or service, the only event where you can request a replacement, return, or a refund is if the product and/or service does not match the clear description explicitly mentioned on the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary font-mono">3.</span> REFUND TIMEFRAME & SUBMISSION PROCESS
            </h2>
            <div className="space-y-4">
              <p>
                Any request for a refund must be submitted within <strong className="text-white font-bold">three (3) days</strong> from the date of the Transaction.
              </p>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400 font-mono uppercase mb-1">Interactive Channels</div>
                  <p className="text-xs text-neutral-200">
                    Submit your claim directly through our official contact interface or via email.
                  </p>
                </div>
                <Link href="/contact/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-headline font-bold text-xs uppercase tracking-wider text-center cursor-pointer shadow-md"
                  >
                    Go to Contact Terminal
                  </motion.div>
                </Link>
              </div>

              <p className="text-xs text-neutral-400">
                When submitting a request, you must provide a clear and specific reason for the refund request, including the exact terms or descriptions that have been violated, along with any necessary proof or screenshots.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-primary font-mono">4.</span> EVALUATION AND APPROVAL
            </h2>
            <p>
              Whether a refund will be provided will be determined strictly by us upon investigating the delivery logs and project specifications. We may ask for additional details or communication logs before approving or denying any requests. Approved refunds will be reversed back to the original Payment Instrument used during check-out as per standard payment gateway timelines.
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-600">
            © 2026 Studio1. All refund policies subject to final merchant audit.
          </p>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to verify Cashfree v3 Webhook Cryptographic Signatures
function verifyCashfreeSignature(rawBody, timestamp, signature, secretKey) {
  try {
    if (!timestamp || !signature || !secretKey) return false;

    // Cashfree computes signature as: HMAC-SHA256(timestamp + rawBody)
    const payload = timestamp + rawBody;
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("base64");

    // Perform a timing-safe comparison to protect against side-channel analysis
    const buffer1 = Buffer.from(signature);
    const buffer2 = Buffer.from(computedSignature);

    if (buffer1.length !== buffer2.length) return false;
    return crypto.timingSafeEqual(buffer1, buffer2);
  } catch (error) {
    console.error("[Cashfree Webhook] Verification error:", error);
    return false;
  }
}

export async function POST(req) {
  try {
    // 1. Fetch the raw body of the webhook request (needed for signature hash)
    const rawBody = await req.text();

    // 2. Extract Cashfree verification headers
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    console.log(`[Cashfree Webhook] Received notification. Signature: ${signature ? "Yes" : "No"}, Timestamp: ${timestamp}`);

    // 3. Cryptographically verify signature to ensure it came from Cashfree
    const isVerified = verifyCashfreeSignature(rawBody, timestamp, signature, secretKey);

    if (!isVerified) {
      console.warn("[Cashfree Webhook] CRITICAL: Invalid signature received. Access Denied.");
      return NextResponse.json(
        { error: "Invalid webhook cryptographic signature" },
        { status: 401 }
      );
    }

    // 4. Parse verified payload details
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error("[Cashfree Webhook] Failed to parse JSON body:", rawBody);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { type, data } = payload;
    console.log(`[Cashfree Webhook] Verified event: ${type} for order: ${data?.order?.order_id}`);

    // 5. Check if the event signifies a successful payment
    if (type === "PAYMENT_SUCCESS") {
      const orderId = data.order?.order_id;
      const amount = data.order?.order_amount;
      const email = data.customer_details?.customer_email;
      const paymentStatus = data.payment?.payment_status;

      console.log(`[Cashfree Webhook] SUCCESSFUL PAYMENT DETECTED!
        - Order ID: ${orderId}
        - Amount: ₹${amount}
        - Email: ${email}
        - Status: ${paymentStatus}
      `);

      // ==========================================
      // TODO: IMPLEMENT ACTIVE DATABASE UPGRADES HERE
      // ==========================================
      // Example implementation (Supabase Client):
      //
      // import { createClient } from "@supabase/supabase-js";
      // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      //
      // const { data: user, error } = await supabase
      //   .from('users')
      //   .update({ access_tier: 'premium', last_payment_id: orderId })
      //   .eq('email', email);
      //
      // if (error) {
      //   console.error("Database upgrade error:", error);
      // } else {
      //   console.log("Successfully upgraded user profile for:", email);
      // }
      // ==========================================

    } else if (type === "PAYMENT_FAILED") {
      console.warn(`[Cashfree Webhook] Payment failed for order ${data?.order?.order_id}. Reason: ${data?.payment?.payment_message}`);
    }

    // Cashfree expects a 200 OK response to acknowledge receipt of webhook
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("[Cashfree Webhook] Server error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error processing webhook notification." },
      { status: 500 }
    );
  }
}

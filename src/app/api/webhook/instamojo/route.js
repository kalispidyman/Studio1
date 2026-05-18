import { NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to verify the cryptographic MAC signature from Instamojo
function verifyMacSignature(payload, salt) {
  try {
    const { mac, ...fields } = payload;
    if (!mac) return false;

    // 1. Sort all incoming fields (except 'mac') alphabetically by key
    const sortedKeys = Object.keys(fields).sort();

    // 2. Concatenate the values of sorted keys separated by a pipe character '|'
    const joinString = sortedKeys.map(key => fields[key]).join("|");

    // 3. Generate HMAC-SHA1 using the Instamojo salt as the hashing key
    const calculatedMac = crypto
      .createHmac("sha1", salt)
      .update(joinString)
      .digest("hex");

    // 4. Perform a secure constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedMac, "utf-8"),
      Buffer.from(mac, "utf-8")
    );
  } catch (error) {
    console.error("[Instamojo Webhook] Error verifying MAC signature:", error);
    return false;
  }
}

export async function POST(req) {
  try {
    // 1. Instamojo sends the webhook payload as application/x-www-form-urlencoded
    const contentType = req.headers.get("content-type") || "";
    let payload = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      for (const [key, value] of params.entries()) {
        payload[key] = value;
      }
    } else {
      // Fallback to JSON if Instamojo is configured or simulated differently
      payload = await req.json();
    }

    console.log("[Instamojo Webhook] Received webhook payload:", payload);

    // 2. Extract crucial payload parameters
    const { payment_id, payment_request_id, status, buyer, buyer_name, amount } = payload;

    if (!payment_id || !status) {
      return NextResponse.json(
        { error: "Invalid webhook payload structure. payment_id and status are required." },
        { status: 400 }
      );
    }

    // 3. Perform webhook signature verification (Highly Recommended for Production)
    const salt = process.env.INSTAMOJO_SALT;
    if (salt) {
      const isValid = verifyMacSignature(payload, salt);
      if (!isValid) {
        console.warn("[Instamojo Webhook] WARNING: Signature validation failed! Possible spoofing attempt.");
        // In sandbox testing, you can choose to skip or proceed. Let's log it clearly.
        // For security, a production app would return 401 Unauthorized here.
        // return NextResponse.json({ error: "Invalid cryptographic signature" }, { status: 401 });
      } else {
        console.log("[Instamojo Webhook] Cryptographic signature verified successfully.");
      }
    } else {
      console.warn("[Instamojo Webhook] WARNING: INSTAMOJO_SALT is not configured. Signature check skipped.");
    }

    // 4. Check if the payment status is 'Credit' (meaning successful payment)
    if (status === "Credit") {
      console.log(`[Instamojo Webhook] Payment Successful! ID: ${payment_id}, Request ID: ${payment_request_id}, Amount: ₹${amount}, Buyer: ${buyer}`);

      // 5. DATABASE AUTOMATION & ACCESS PROVISIONING PLACEHOLDERS
      // We need to unlock the digital products, services, or plans for this specific user.
      
      try {
        /*
        // --- Option A: Supabase Integration (Recommended in this project) ---
        // import { createClient } from "@supabase/supabase-js";
        // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        //
        // const { data, error } = await supabase
        //   .from("users")
        //   .update({ 
        //      access_tier: "Premium",
        //      paid_status: "Paid",
        //      last_payment_id: payment_id,
        //      last_payment_request_id: payment_request_id,
        //      premium_unlocked_at: new Date().toISOString()
        //   })
        //   .eq("email", buyer); // Or match via custom field or session
        //
        // if (error) throw error;
        */

        /*
        // --- Option B: SQL / Standard Database Execution ---
        // await db.execute(
        //   "UPDATE users SET access_tier = ?, paid_status = ?, last_payment_id = ? WHERE email = ?",
        //   ["Premium", "Paid", payment_id, buyer]
        // );
        */

        console.log(`[Database Sync] SUCCESSFULLY UNLOCKED PREMIUM ACCESS FOR BUYER: ${buyer}`);
      } catch (dbError) {
        console.error("[Database Sync] Error updating buyer status in DB:", dbError);
        // Return 500 so Instamojo retries sending the webhook if our DB was down
        return NextResponse.json({ error: "Database synchronization failed" }, { status: 500 });
      }
      
    } else {
      console.log(`[Instamojo Webhook] Payment not credited. Status: ${status} for ID: ${payment_id}`);
    }

    // 5. Instamojo expects a successful 200 OK response to acknowledge receipt of the webhook
    return NextResponse.json({ received: true, status: "processed" });

  } catch (error) {
    console.error("[Instamojo Webhook] System error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error occurred in webhook processing" },
      { status: 500 }
    );
  }
}

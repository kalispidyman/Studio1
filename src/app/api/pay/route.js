import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, purpose, name, email, phone } = body;

    // 1. Validate the incoming input parameters
    if (!amount || !purpose || !name || !email) {
      return NextResponse.json(
        { error: "Missing required checkout parameters: amount, purpose, name, and email are required." },
        { status: 400 }
      );
    }

    // 2. Load configurations from environment variables
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const apiBaseUrl = process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg";
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Cashfree strictly requires secure HTTPS for return_url in both Sandbox and Live
    if (baseUrl.startsWith("http://")) {
      console.log("[Cashfree Pay] Non-secure base URL detected. Enforcing secure production HTTPS return URL.");
      baseUrl = "https://neetstudios.vercel.app";
    }

    if (!appId || !secretKey) {
      console.error("[Cashfree Pay] Missing credentials in server environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration: Payment credentials are not loaded." },
        { status: 500 }
      );
    }

    // 3. Cashfree requires a unique order ID per request
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Define the return redirect url with the actual order ID interpolated
    const returnUrl = `${baseUrl}/payment-success?order_id=${orderId}`;

    // 5. Clean customer credentials for Cashfree compatibility
    // Cashfree requires a valid customer ID (alphanumeric with underscores)
    const customerId = `cust_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;
    
    // Cashfree requires a valid 10-digit phone number
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "").slice(-10) : "9999999999";
    const finalPhone = cleanPhone.length === 10 ? cleanPhone : "9999999999";

    // 5. Construct Cashfree PG API Order request payload (v2021-05-21 compatible)
    const payload = {
      order_amount: Number(amount),
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerId,
        customer_name: name,
        customer_email: email,
        customer_phone: finalPhone
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: `${baseUrl}/api/webhook/cashfree`
      },
      order_note: purpose
    };

    console.log(`[Cashfree Pay] Initializing order ${orderId} for ₹${amount} - ${purpose} using v2021-05-21 PG API...`);

    // 6. Execute server-to-server request to Cashfree PG Orders API using v2021-05-21 backward compatibility
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/orders`, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2021-05-21",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Cashfree Pay] Failed to parse response from Cashfree PG Orders API:", responseText);
      return NextResponse.json(
        { error: "Invalid response from the payment gateway partner." },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("[Cashfree Pay] Cashfree PG Orders API Error Response:", data);
      return NextResponse.json(
        { error: data.message || "Payment initialization failed on the gateway side." },
        { status: response.status }
      );
    }

    // 7. Extract the shareable hosted checkout link
    const paymentUrl = data.payment_link;

    if (!paymentUrl) {
      console.error("[Cashfree Pay] payment_link missing in Cashfree response:", data);
      return NextResponse.json(
        { error: "Payment checkout link could not be generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      order_id: orderId,
      cf_order_id: data.cf_order_id || ""
    });

  } catch (error) {
    console.error("[Cashfree Pay] Server Error in /api/pay handler:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing checkout." },
      { status: 500 }
    );
  }
}

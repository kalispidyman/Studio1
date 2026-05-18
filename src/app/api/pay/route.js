import { NextResponse } from "next/server";

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
    const apiKey = process.env.INSTAMOJO_API_KEY;
    const authToken = process.env.INSTAMOJO_AUTH_TOKEN;
    const apiBaseUrl = process.env.INSTAMOJO_API_URL || "https://test.instamojo.com/api/v2/";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!apiKey || !authToken) {
      console.error("[Instamojo Pay] Missing API keys in server environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration: Payment keys are not loaded." },
        { status: 500 }
      );
    }

    // 3. Define the return and webhook URLs
    // The redirect_url points to our beautiful payment success feedback view
    const redirectUrl = `${baseUrl}/payment-success/`;
    
    // The webhook points to our secure backend webhook route for automation
    const webhookUrl = `${baseUrl}/api/webhook/instamojo/`;

    // 4. Construct the URL-encoded payload for Instamojo payment request
    const payload = new URLSearchParams({
      amount: String(amount),
      purpose: purpose,
      buyer_name: name,
      email: email,
      redirect_url: redirectUrl,
      webhook: webhookUrl,
      allow_repeated_payments: "false"
    });

    if (phone) {
      payload.append("phone", phone);
    }

    console.log(`[Instamojo Pay] Initializing payment request for ${email} - ₹${amount} for ${purpose}...`);

    // 5. Execute the server-to-server HTTP request to Instamojo v2 API
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/payment_requests/`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "X-Auth-Token": authToken,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload.toString()
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Instamojo Pay] Failed to parse response from Instamojo:", responseText);
      return NextResponse.json(
        { error: "Invalid response from the payment gateway partner." },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("[Instamojo Pay] Instamojo v2 API Error Response:", data);
      return NextResponse.json(
        { error: data.message || "Payment initialization failed on the gateway side." },
        { status: response.status }
      );
    }

    // 6. Return the checkout URL back to the frontend client
    // Instamojo returns longurl in the payment_request object
    const paymentUrl = data.payment_request?.longurl;

    if (!paymentUrl) {
      console.error("[Instamojo Pay] longurl was missing in Instamojo response:", data);
      return NextResponse.json(
        { error: "Payment URL could not be generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      payment_request_id: data.payment_request.id
    });

  } catch (error) {
    console.error("[Instamojo Pay] Server Error in /api/pay handler:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing checkout." },
      { status: 500 }
    );
  }
}

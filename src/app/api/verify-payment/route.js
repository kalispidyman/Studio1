import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id query parameter." }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const apiBaseUrl = process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Server misconfiguration: Credentials not found." }, { status: 500 });
    }

    console.log(`[Cashfree Verify] Checking status for order ID: ${orderId}...`);

    // Fetch order status directly from Cashfree PG v3 API
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2021-05-21",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Cashfree Verify] Error fetching order from gateway:", data);
      return NextResponse.json(
        { error: data.message || "Failed to retrieve order status from Cashfree." },
        { status: response.status }
      );
    }

    // Cashfree Order Status can be: 'ACTIVE', 'PAID', 'EXPIRED', 'USER_DROPPED'
    const isPaid = data.order_status === "PAID";

    return NextResponse.json({
      success: true,
      order_id: data.order_id,
      order_status: data.order_status,
      isPaid: isPaid,
      amount: data.order_amount,
      currency: data.order_currency
    });

  } catch (error) {
    console.error("[Cashfree Verify] Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while verifying transaction." },
      { status: 500 }
    );
  }
}

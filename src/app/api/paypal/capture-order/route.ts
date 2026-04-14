import { NextResponse } from "next/server"

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  )

  const data = await response.json()

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Failed to get PayPal access token")
  }

  return data.access_token as string
}

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json()

    if (!orderID) {
      return NextResponse.json(
        { success: false, error: "Missing PayPal orderID" },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to capture PayPal order",
          details: data,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
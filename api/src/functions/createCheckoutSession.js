const { app } = require("@azure/functions");
const Stripe = require("stripe");

/**
 * Azure Function: createCheckoutSession
 *
 * Expects POST body:
 * {
 *   "userId": "<Supabase user ID or other identifier>"
 * }
 */
app.http("createCheckoutSession", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // Set up CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    // Parse request body
    const body = await request.json().catch(() => null);
    if (!body || !body.userId) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Missing userId in request body" }),
        headers: corsHeaders,
      };
    }

    // Get userId from request
    const { userId } = body;

    // Load environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return {
        status: 500,
        body: JSON.stringify({
          error: "STRIPE_SECRET_KEY environment variable is missing",
        }),
        headers: corsHeaders,
      };
    }

    // Initialize Stripe client
    const stripe = new Stripe(stripeSecretKey);

    // Optional: define success/cancel URLs or read from env
    const successUrl =
      process.env.SUCCESS_URL || "http://localhost:5173/success";
    const cancelUrl = process.env.CANCEL_URL || "http://localhost:5173/cancel";

    try {
      // Create Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // or 'subscription' if you want recurring billing
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "IntervYOU Pro Plan" },
              unit_amount: 1000, // e.g. $10 -> 1000 (in cents)
            },
            quantity: 1,
          },
        ],
        // Where Stripe redirects after a successful / canceled payment
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        // Store userId in metadata so your webhook can reference it
        metadata: {
          userId,
        },
      });

      // Return the Checkout Session URL to the client
      return {
        status: 200,
        body: JSON.stringify({ url: session.url }),
        headers: corsHeaders,
      };
    } catch (error) {
      context.log.error(
        "ERROR: Failed to create Stripe session:",
        error.message
      );
      return {
        status: 500,
        body: JSON.stringify({
          error: "Unable to create checkout session",
          details: error.message,
        }),
        headers: corsHeaders,
      };
    }
  },
});

const { app } = require("@azure/functions");
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

app.http("stripeWebhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    try {
      console.log("🔹 Incoming webhook event");

      // ✅ Retrieve Stripe Signature properly
      const sig = request.headers.get("stripe-signature");
      if (!sig) {
        console.log("❌ Missing Stripe-Signature header");
        return { status: 400, body: "Missing Stripe-Signature header" };
      }

      // ✅ Convert ReadableStream to text (to prevent auto-parsing issues)
      const rawBody = await request.text();
      console.log("✅ Successfully read raw body");

      // ✅ Initialize Stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      console.log("✅ Stripe initialized");

      // ✅ Verify Stripe Signature
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          rawBody, // Ensure the exact raw body is passed
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log("❌ Invalid Stripe Signature:", err.message);
        return { status: 400, body: "Invalid Stripe signature" };
      }

      console.log("✅ Stripe Signature Verified!");

      // ✅ Handle only checkout.session.completed events
      if (event.type !== "checkout.session.completed") {
        console.log(`⚠️ Ignoring unhandled event type: ${event.type}`);
        return { status: 200, body: "Unhandled event type" };
      }

      console.log("🔹 Processing checkout.session.completed event");

      // ✅ Extract session details
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.log("❌ No userId found in session metadata");
        return { status: 400, body: "Missing userId in session metadata" };
      }

      console.log(`✅ Checkout Session Completed for userId: ${userId}`);

      // ✅ Ensure Payment is Paid
      if (session.payment_status !== "paid") {
        console.log(`⚠️ Payment status is not paid: ${session.payment_status}`);
        return { status: 400, body: "Payment not completed" };
      }

      // ✅ Initialize Supabase
      console.log("🔹 Initializing Supabase...");
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      console.log("✅ Supabase initialized");

      // ✅ Update User Profile
      console.log("🔹 Updating user profile...");
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.log("❌ Error fetching credits:", fetchError.message);
      } else {
        const newCredits = (data.credits || 0) + 50; // Ensure it's never null

        // Update the credits
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ plan: "pro", credits: newCredits })
          .eq("id", userId);

        if (updateError) {
          console.log("❌ Error updating credits:", updateError.message);
        } else {
          console.log("✅ Successfully added 50 credits!");
        }
      }

      if (error) {
        console.log("❌ Supabase update error:", error.message);
        return { status: 500, body: "Error updating user profile" };
      }

      console.log(`✅ Successfully updated profile for userId: ${userId}`);
      return { status: 200, body: "Webhook processed successfully" };
    } catch (err) {
      console.log("❌ ERROR:", err.message);
      return { status: 500, body: `Internal Server Error: ${err.message}` };
    }
  },
});

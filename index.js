import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Stripe secret key stored in environment variables on Render
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("Barber payment server is running.");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Barber Service" },
            unit_amount: amount, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: "https://YOUR-SITE.com/payment-success",
      cancel_url: "https://YOUR-SITE.com/payment-canceled",
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(10000, () => console.log("Server running on Port 10000"));

import express from "express";
import errorHandler from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import brandRoutes from "./routes/brandRoutes";
import categoryRoute from "./routes/categoryRoute";
import uploadRoute from "./routes/uploadRoute";
import addressRoute from "./routes/addressRoutes";
import productRoutes from "./routes/productRoutes";
import bodyParser from "body-parser";
import orderRoutes from "./routes/orderRouter";
import reviewRoutes from "./routes/reviewRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

///////////////////////////

const app = express();
app.use(express.static("public"));
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

/////////////////////////

// MIDDLEWARE

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", userRoutes);
app.use("/", uploadRoute);
app.use("/api", addressRoute);
app.use("/api", productRoutes);
app.use("/api", categoryRoute);
app.use("/api", brandRoutes);
app.use("/api", orderRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", reviewRoutes);
//Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.post("/api/create-checkout-session", async (req, res) => {
  const data = req.body;
  const transformedProducts = data.data.items.map((product: any) => {
    const quantity = product.quantity;
    const price =
      Number(product.discounted) > 0 ? product.discounted : product.price;
    const total = Number(price) + Number(product.selectedVariant?.price);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
        },
        unit_amount: Number(total) * 100,
      },
      quantity: Number(quantity),
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: transformedProducts,
    mode: "payment",
    success_url:
      "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5173/cancel",
    metadata: {
      userId: data.data.userId,
      addressId: data.data.addressId,
      items: JSON.stringify(
        data.data.items.map((product: any) => ({
          productId: product.id,
          variantId: product.selectedVariant?.id,
          colorId: product.selectedColor?.id,
          quantity: product.quantity,
          price:
            Number(product.discounted) > 0
              ? Number(product.discounted)
              : Number(product.price),
          total:
            Number(product.discounted) > 0
              ? Number(product.discounted)
              : Number(product.price) +
                Number(product.selectedVariant?.price) *
                  Number(product.quantity),
        }))
      ),
    },
  });
  res.send({ id: session.id, url: session.url });
});

const endpointSecret = "whsec_..."; // Replace with your webhook secret

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const paymentIntentId = session.payment_intent;
      // Handle successful payment here

      // You can save the session details to your database or perform any required action
    }

    response.json({ received: true });
  }
);

app.get("/api/check-session", async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).send({ error: "Session ID is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send({ session: session });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// ERROR HANDLER
app.use(errorHandler);

export default app;

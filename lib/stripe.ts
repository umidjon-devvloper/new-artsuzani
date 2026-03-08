import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as unknown as Stripe.StripeConfig["apiVersion"],
});
export default stripe;

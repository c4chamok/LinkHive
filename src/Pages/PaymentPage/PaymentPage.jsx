// src/App.js
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../Components/CheckoutForm/CheckoutForm";


// Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;

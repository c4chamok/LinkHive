import React, { useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { FaCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import getUserFromDB from "../../TanStackAPIs/getUserFromDB";
import { useNavigate } from "react-router";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [zipCode, setZipCode] = useState("");
    const [cardBrand, setCardBrand] = useState("generic");
    const { userFromDB, refetch } = getUserFromDB();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const response = await axiosSecure("/create-payment-intent");
        const { clientSecret } = await response.data;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    address: {
                        postal_code: zipCode,
                    },
                },
            },
        });
        console.log(paymentIntent.id, userFromDB);
        const subscribe = async () => {
            const { data } = await axiosSecure.post('/handle-subscribe', {
                intentId: paymentIntent.id,
                userEmail: userFromDB?.email,
                userId: userFromDB?._id
            })
            refetch();
            navigate('/dashboard/profile');
        }

        if (error) {
            console.error(error);
            alert("Payment failed!");
        } else if (paymentIntent.status === "succeeded") {
            subscribe()
            setPaymentSuccess(true);
            alert("Payment successful!");
        }

        setLoading(false);
    };

    const getCardIcon = (brand) => {
        switch (brand) {
            case "visa":
                return <FaCcVisa className="text-blue-500 text-2xl" />;
            case "mastercard":
                return <FaCcMastercard className="text-red-500 text-2xl" />;
            default:
                return <FaCreditCard className="text-gray-500 text-2xl" />;
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Complete Your Payment
            </h2>

            <div className="space-y-4">
                <div className="flex gap-2 items-center border border-gray-300 rounded-lg p-4">
                    <div className="w-8 flex-shrink-0">{getCardIcon(cardBrand)}</div>
                    <div className="flex-grow">
                        <CardNumberElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: {
                                        color: "#9e2146",
                                    },
                                },
                            }}
                            onChange={(event) => {
                                setCardBrand(event.brand);
                            }}
                        />
                    </div>
                </div>


                <div className="flex items-center gap-4">
                    <div className="border flex-1 border-gray-300 rounded-lg p-4">
                        <CardExpiryElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: {
                                        color: "#9e2146",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="border flex-1 border-gray-300 rounded-lg p-4">
                        <CardCvcElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: {
                                        color: "#9e2146",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                    <input
                        type="text"
                        placeholder="ZIP Code"
                        className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 text-gray-700"
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
            </div>

            <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                type="submit"
                disabled={!stripe || loading}
            >
                {loading ? (
                    <span className="flex justify-center items-center">
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    "Pay"
                )}
            </button>

            {paymentSuccess && (
                <p className="mt-6 text-green-600 text-center font-medium">
                    Payment Successful!
                </p>
            )}
        </form>
    );
}

export default CheckoutForm;
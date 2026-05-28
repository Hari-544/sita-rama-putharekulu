import { useEffect } from "react";
import { setSeoMeta } from "../utils/seo";

function SuccessPage() {
  const paymentDetails = window.history.state?.usr || null;
  const amountValue = Number(
    paymentDetails?.amount ?? paymentDetails?.finalTotal
  );
  const formattedAmount = Number.isFinite(amountValue)
    ? new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }).format(amountValue)
    : null;

  useEffect(() => {
    setSeoMeta({
      title: "Order Confirmed | Sita Rama Putharekulu",
      description:
        "Your Atreyapuram Putharekulu order has been placed successfully. Thank you for shopping with Sita Rama Putharekulu.",
      path: "/success",
      image: "/og-image.svg",
      noindex: true,
    });
  }, []);

  useEffect(() => {
    if (paymentDetails) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.location.replace("/");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [paymentDetails]);

  if (!paymentDetails) {
    return (
      <main className="responsive-shell adaptive-section safe-bottom min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white flex items-center justify-center">
        <section className="panel-shell adaptive-card mx-auto w-full max-w-2xl p-6 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 shadow-inner sm:h-24 sm:w-24">
            <span className="text-5xl text-orange-600">⌂</span>
          </div>

          <h1 className="mt-8 fluid-heading font-extrabold text-orange-950">
            Redirecting to Home
          </h1>

          <p className="fluid-body mt-6 text-gray-700">
            No payment confirmation data was found for this page. You will be redirected safely to the homepage.
          </p>

          <a href="/" className="btn btn-primary w-full py-4 mt-8 text-base sm:text-lg">
            Continue Shopping
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="responsive-shell adaptive-section safe-bottom min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white flex items-center justify-center">
      <section className="panel-shell adaptive-card mx-auto w-full max-w-2xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-inner sm:h-24 sm:w-24">
          <span className="text-5xl text-green-700">✓</span>
        </div>

        <h1 className="mt-8 fluid-heading font-extrabold text-orange-950">
          Payment Successful
        </h1>

        <p className="fluid-body mt-6 text-gray-700">
          Thank you for ordering from{" "}
          <span className="font-bold text-orange-800">
            SITA RAMA PUTHAREKULU
          </span>
          .
          <br />
          Your payment has been confirmed and your order is now being prepared.
        </p>

        <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-left sm:p-6">
          <h2 className="fluid-heading font-bold text-orange-900 text-center">
            Order Details
          </h2>

          <div className="mt-5 space-y-3 text-gray-700 leading-7">
            <p>
              <span className="font-semibold text-orange-900">Razorpay Order ID:</span>{" "}
              <span className="break-all font-mono text-sm sm:text-base">{paymentDetails.orderId}</span>
            </p>

            {Number.isFinite(Number(paymentDetails.subtotal)) ? (
              <p>
                <span className="font-semibold text-orange-900">Subtotal:</span> ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(paymentDetails.subtotal))}
              </p>
            ) : null}

            {Number.isFinite(Number(paymentDetails.handlingFee)) ? (
              <p>
                <span className="font-semibold text-orange-900">Handling Fee:</span> ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(paymentDetails.handlingFee))}
              </p>
            ) : null}

            {Number.isFinite(Number(paymentDetails.finalTotal)) ? (
              <p>
                <span className="font-semibold text-orange-900">Final Total:</span> ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(paymentDetails.finalTotal))}
              </p>
            ) : null}

            {formattedAmount ? (
              <p>
                <span className="font-semibold text-orange-900">Paid Amount:</span> ₹{formattedAmount}
              </p>
            ) : null}

            <p>
              <span className="font-semibold text-orange-900">Customer:</span>{" "}
              {paymentDetails.customerName || "Valued Customer"}
            </p>

            <p>
              Your confirmation email {paymentDetails.emailSent ? "has been sent." : "is being processed."}
            </p>

            <p>
              Please use your Order ID when checking your delivery status on the Track Order page.
            </p>
          </div>
        </div>

        <a
          href="/track-order"
          className="btn btn-primary w-full py-4 mt-8 text-base sm:text-lg"
        >
          Track Order
        </a>

        <a href="/" className="btn btn-secondary w-full py-4 mt-5 text-base sm:text-lg">
          Continue Shopping
        </a>
      </section>
    </main>
  );
}

export default SuccessPage;

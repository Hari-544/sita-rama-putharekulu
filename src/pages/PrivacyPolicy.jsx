import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white px-4 py-10 sm:px-6 sm:py-16">
      <article className="panel-shell mx-auto max-w-5xl p-6 sm:p-10">
        <Link
          to="/"
          className="inline-flex text-orange-700 font-semibold hover:text-orange-950 transition mb-8"
        >
          ← Back To Home
        </Link>

        <h1 className="page-title fluid-heading font-extrabold mb-4">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-8">Last Updated: May 2026</p>

        <div className="space-y-8 text-gray-700 leading-7 sm:leading-8">
          <section>
              <h2 className="fluid-heading font-bold text-orange-900 mb-3">
              Introduction
            </h2>
            <p>
              SITA RAMA PUTHAREKULU values your privacy and is committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and protect customer information when you use
              our website and services.
            </p>
          </section>

          <section>
              <h2 className="fluid-heading font-bold text-orange-900 mb-3">
              Information We Collect
            </h2>
            <p>We may collect the following customer information:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Delivery Address</li>
              <li>Pincode</li>
              <li>Order Details</li>
              <li>Customer Reviews & Feedback</li>
            </ul>
          </section>

          <section>
              <h2 className="fluid-heading font-bold text-orange-900 mb-3">
              How We Use Customer Information
            </h2>
            <p>Customer information is used only for:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Processing and delivering orders</li>
              <li>Customer support and communication</li>
              <li>Improving our products and services</li>
              <li>Managing payments and transactions</li>
              <li>Displaying customer reviews</li>
            </ul>
          </section>

          <section>
              <h2 className="fluid-heading font-bold text-orange-900 mb-3">
              Payment Security
            </h2>
            <p>
              All payments are securely processed through trusted third-party
              payment providers such as Razorpay. We do not store customers'
              debit card, credit card, or banking information on our servers.
            </p>
          </section>

          <section>
              <h2 className="fluid-heading font-bold text-orange-900 mb-3">
              Third-Party Services
            </h2>
            <p>Our website may use trusted third-party services such as:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Razorpay for payment processing</li>
              <li>Firebase for reviews and data storage</li>
              <li>Web3Forms for order form submissions</li>
              <li>Vercel for website hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-orange-900 mb-3">
              Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please
              contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p>+91 9652999544</p>
              <p>sitaramaputharekulu@gmail.com</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

export default PrivacyPolicy;

const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpay = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const existingScript =
      document.querySelector(
        `script[src="${RAZORPAY_SCRIPT}"]`
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () =>
          reject(
            new Error("Failed to load Razorpay checkout")
          ),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(
        new Error("Failed to load Razorpay checkout")
      );

    document.body.appendChild(script);
  });
};

import toast from "react-hot-toast";
export const useRazorpay = () => {
  const loadScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const openCheckout = async ({ order, onSuccess }) => {
    const isLoaded = await loadScript();

    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      key: "rzp_test_SavxVw5kDcTcNw", // test
      amount: order.amount,
      currency: order.currency,
      name: "Your Company",
      description: order.description,
      order_id: order.order_id,

      handler: function (response) {
        onSuccess(response);
      },

      prefill: {
        name: "Customer Name",
        email: "customer@email.com",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      toast.error("Payment failed. Try again.");
    });

    rzp.open();
  };

  return { openCheckout };
};

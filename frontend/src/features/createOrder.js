import api from "../utils/axios";

export const createBillingOrder = async (planId) => {
  try {
    const { data } = await api.post("/api/billing/create", { plan: planId });
    return data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

export const verifyBillingPayment = async (paymentDetails) => {
  try {
    const { data } = await api.post("/api/billing/verify", paymentDetails);
    return data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};

import { generateHash } from "../utils/payuHash.js";

export const initiatePayment = async (req, res) => {
  try {
    const { email } = req.params;
    const salt = process.env.PayU_MERCHENT_SALT_V2;

    const { hash, params } = await generateHash({ email }, salt);

    const paymentUrl = process.env.ENVIRONMENT_TEST;

    res.status(200).json({
      paymentUrl,
      params,
      hash,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const paymentSuccess = (req, res) => {
  console.log("Payment success data:", req.params);
  res.send("Payment Successful");
};

export const paymentFailure = (req, res) => {
  console.log("Payment failure data:", req.params);
  res.send(" Payment Failed");
};

// import { generateHash } from "../utils/payuHash.js";

export const paymentSuccess = (req, res) => {
  console.log("Payment success data:", req.params);

  res.redirect("https://www.youtube.com/");
};

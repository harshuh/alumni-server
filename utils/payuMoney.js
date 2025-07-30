import Payu from "payu-websdk";

import dotenv from "dotenv";
dotenv.config();

const express = require("express");
const crypto = require("crypto");
export const payURouter = express.Router();
// const payuClient = new PayU(
//   {
//     key: process.env.PayU_MERCHENT_KEY,
//     salt: process.env.PayU_MERCHENT_SALT_V2,
//   },
//   process.env.ENVIRONMENT
// );
// paymentRoutes.js

// Dummy DB call
async function getUserById(userId) {
  // Replace with real DB fetch
  return {
    id: userId,
    name: "Test User",
    email: "test@example.com",
    phone: "9999999999",
  };
}

router.post("/initiate-payment", async (req, res) => {
  const { userId } = req.body;

  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const txnid = "txn_" + Date.now();
  const amount = "1000.00";
  const productinfo = "MembershipCard";

  const hashString = `${process.env.PayU_MERCHENT_KEY}|${txnid}|${amount}|${productinfo}|${user.name}|${user.email}|||||||||||${PayU_MERCHENT_SALT_V2}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const paymentData = {
    action: `${PAYU_BASE_URL}/_payment`,
    params: {
      key: process.env.PayU_MERCHENT_KEY,
      txnid,
      amount,
      productinfo,
      firstname: user.name,
      email: user.email,
      phone: user.phone,
      surl: "https://yourdomain.com/payment-success",
      furl: "https://yourdomain.com/payment-failure",
      hash,
      service_provider: "payu_paisa",
    },
  };

  res.json(paymentData);
});

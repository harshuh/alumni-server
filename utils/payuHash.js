import crypto from "crypto";

import { Alumni } from "../models/Alumni/alumniData.model.js";

export const generateHash = async ({ email }, salt) => {
  const user = await Alumni.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const params = {
    key: process.env.PayU_MERCHENT_KEY,
    txnid: `txn_${Date.now()}`,
    amount: "1000.00",
    productinfo: "Alumni Membership",
    firstname: user.alumniName,
    email: user.email,
    udf1: user.enrollmentNo,
    udf2: user.phoneNo,
    surl: "http://localhost:1212/api/payu/pay/success", // success URL
    furl: "http://localhost:1212/api/payu/pay/failure", // failure URL
  };

  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|${params.udf1}|${params.udf2}|||||||||${salt}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  console.log("hash", hash);
  console.log("param", params);

  return { hash, params };
};

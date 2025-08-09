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
    phone: user.phoneNo,
    udf1: udf1 || "",
    udf2: udf2 || "",
    udf3: udf3 || "",
    udf4: udf4 || "",
    udf5: udf5 || "",

    surl: "https://gbu-alumniserver.vercel.app/api/payu/pay/success", // success URL
    furl: "https://gbu-alumniserver.vercel.app/api/payu/pay/failure", // failure URL
  };

  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|${params.phone}|${params.udf1}|${params.udf2}|${params.udf3}|${params.udf4}|${params.udf5}||||||${salt}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  console.log("hash", hash);
  console.log("param", params);

  return { hash, params };
};

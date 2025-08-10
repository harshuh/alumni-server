import crypto from "crypto";
import { Alumni } from "../models/Alumni/alumniData.model.js";

export const generateHash = async ({ email }, salt) => {
  //
  const alumni = await Alumni.findOne({ email: email });

  if (!alumni) {
    throw new Error("Alumni Not Found");
  }

  const params = {
    key: process.env.PayU_MERCHENT_KEY,
    txnid: `txn_${Date.now()}`,
    amount: "1000.00",
    productinfo: "Alumni Membership",
    firstname: alumni.alumniName,
    email: alumni.email,
    phone: alumni.phoneNo,
  };

  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;

  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toLowerCase();

  // console.log("Genrate HASH ---->", hash);

  return { hash, params };
};

import crypto from "crypto";
import { Alumni } from "../models/Alumni/alumniData.model.js";

export const generateHash = async ({ email }, salt) => {
  const user = await Alumni.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const key = process.env.PayU_MERCHENT_KEY;
  const txnid = `txn_${Date.now()}`;
  const amount = "1000.00";
  const productinfo = "Alumni Membership";

  const params = {
    key,
    txnid,
    amount,
    productinfo,
    firstname: user.alumniName,
    email: user.email,
    phone: user.phoneNo,
    surl: "https://gbu-alumniserver.vercel.app/api/payu/pay/success",
    furl: "https://gbu-alumniserver.vercel.app/api/payu/pay/failure",
  };

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${user.alumniName}|${user.email}|${user.phoneNo}|||||||||||${salt}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  console.log("Hash:", hash);
  console.log("Params:", params);

  return { hash, params };
};

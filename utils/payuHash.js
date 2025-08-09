import crypto from "crypto";
import { Alumni } from "../models/Alumni/alumniData.model.js";

export const generateHash = async (email, salt) => {
  const user = await Alumni.findOne({ email: email });

  if (!user) {
    throw new Error("User not found");
  }

  const key = process.env.PayU_MERCHENT_KEY;
  const txnid = `txn_${Date.now()}`;
  const amount = "1000.00";
  const productinfo = "Alumni Membership";

  const udf1 = "";
  const udf2 = "";
  const udf3 = "";
  const udf4 = "";
  const udf5 = "";

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
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  };

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${user.alumniName}|${user.email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // console.log("Forward Hash String:", hashString);
  console.log("Generated Hash:", hash);
  console.log("params of genrate hash", params);

  return { hash, params };
};

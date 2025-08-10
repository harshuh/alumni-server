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

  const params = {
    key,
    txnid,
    amount,
    productinfo,
    firstname: user.alumniName,
    email: user.email,
    phone: user.phoneNo,
    surl: "https://alumni-gbu.vercel.app/alumni/login",
    furl: "https://alumni-gbu.vercel.app/alumni/home",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
  };
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${params.firstname}|${params.email}|${params.udf1}|${params.udf2}|${params.udf3}|${params.udf4}|${params.udf5}||||||${salt}`;
  // const hashString = `${key}|${txnid}|${amount}|${productinfo}|${user.alumniName}|${user.email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // console.log("Forward Hash String:", hashString);
  console.log("Generated Hash:", hash);
  console.log("params of genrate hash", params);

  return { hash, params };
};

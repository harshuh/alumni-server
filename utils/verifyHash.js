import crypto from "crypto";

export const verifyPayUHash = (postedData) => {
  console.log("-----------------------------------------------", postedData);
  const salt = process.env.PayU_MERCHENT_SALT_V2;
  const key = postedData.key;
  const txnid = postedData.txnid;
  const amount = parseFloat(postedData.amount).toFixed(2); // same decimal format
  const productinfo = postedData.productinfo || ""; // no trim
  const firstname = postedData.firstname || "";
  const email = postedData.email || "";
  const status = (postedData.status || "").toLowerCase();

  const udf1 = postedData.udf1 || "";
  const udf2 = postedData.udf2 || "";
  const udf3 = postedData.udf3 || "";
  const udf4 = postedData.udf4 || "";
  const udf5 = postedData.udf5 || "";

  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log(
    "Expected hash from PayU:",
    (postedData.hash || "").toLowerCase()
  );
  console.log("Calculated hash:", calculatedHash);

  // console.log("Hash string used:", hashString);

  return calculatedHash === (postedData.hash || "").toLowerCase();
};

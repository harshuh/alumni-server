import { generateHash } from "../utils/payuHash.js";
import crypto from "crypto";
import { Alumni } from "../models/Alumni/alumniData.model.js";

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { email } = req.params;
    const salt = process.env.PayU_MERCHENT_SALT_V2;

    const { hash, params } = await generateHash({ email }, salt);

    const paymentUrl = process.env.ENVIRONMENT_TEST;

    const formFields = {
      ...params,
      hash,
      service_provider: "payu_paisa",
    };

    const formHtml = `
      <html>
        <body onload="document.forms['payuForm'].submit()">
          <form id="payuForm" method="post" action="${paymentUrl}">
            ${Object.entries(formFields)
              .map(
                ([key, value]) =>
                  `<input type="hidden" name="${key}" value="${String(
                    value
                  ).replace(/"/g, "&quot;")}" />`
              )
              .join("")}
          </form>
          <p>Redirecting to payment gateway...</p>
        </body>
      </html>
    `;

    res.status(200).send(formHtml);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(400).json({ error: "Unable to initiate payment" });
  }
};

// Verify PayU hash after payment
const verifyPayUHash = (postedData) => {
  const salt = process.env.PayU_MERCHENT_SALT_V2;

  const hashString = `${salt}|${postedData.status}||||||${postedData.udf5}|${postedData.udf4}|${postedData.udf3}|${postedData.udf2}|${postedData.udf1}|${postedData.email}|${postedData.firstname}|${postedData.productinfo}|${postedData.amount}|${postedData.txnid}|${postedData.key}`;

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return calculatedHash === postedData.hash;
};

// Success Callback
export const paymentSuccess = async (req, res) => {
  const postedData = req.body;
  console.log("Payment Success Data:", postedData);

  // 1. Validate fields exist
  if (!postedData.email || !postedData.txnid || !postedData.amount) {
    return res.status(400).send("Missing required payment data");
  }

  // 2. Verify hash
  if (!verifyPayUHash(postedData)) {
    return res.status(400).send("Invalid payment data - Hash mismatch");
  }

  try {
    // 3. Find and update only if not already paid
    const updated = await Alumni.findOneAndUpdate(
      { email: postedData.email, isPaid: false },
      {
        $set: {
          isPaid: true,
          paymentTxnId: postedData.txnid,
          paymentAmount: postedData.amount,
          paymentStatus: postedData.status,
          paymentDate: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send("Alumni not found or already marked as paid");
    }

    res.send("Payment successfully verified and recorded");
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).send("Payment verified but failed to update DB");
  }
};

// Failure Callback
export const paymentFailure = async (req, res) => {
  const postedData = req.body;
  console.log("Payment Failure Data:", postedData);

  // Validate and verify hash
  if (!postedData.email || !verifyPayUHash(postedData)) {
    return res.status(400).send("Invalid payment data - Hash mismatch");
  }

  // Optionally record failed attempt
  try {
    await Alumni.findOneAndUpdate(
      { email: postedData.email },
      {
        $set: {
          paymentTxnId: postedData.txnid,
          paymentStatus: postedData.status,
          paymentDate: new Date(),
        },
      }
    );
  } catch (err) {
    console.error("Error recording failed payment:", err);
  }

  res.send("Payment failed but verified");
};

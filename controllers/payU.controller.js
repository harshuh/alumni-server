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
      paymentUrl,
      service_provider: "payu_paisa",
    };

    res.status(200).json({
      formFields,
    });
  } catch (error) {
    console.log("Error initiating payment:", error);
    res.status(400).json({ error: "Unable to initiate payment" });
  }
};

// Verify PayU hash after payment
const verifyPayUHash = (postedData) => {
  const salt = process.env.PayU_MERCHENT_SALT_V2;
  const key = postedData.key;
  const txnid = postedData.txnid;
  const amount = postedData.amount;
  const productinfo = postedData.productinfo;
  const firstname = postedData.firstname;
  const email = postedData.email;
  const udf1 = postedData.udf1 || "";
  const udf2 = postedData.udf2 || "";
  const udf3 = postedData.udf3 || "";
  const udf4 = postedData.udf4 || "";
  const udf5 = postedData.udf5 || "";
  const status = postedData.status;

  // PayU reverse hash format for verification
  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log("Expected hash:", postedData.hash);
  console.log("Calculated hash:", calculatedHash);
  console.log("Hash string used:", hashString);

  return calculatedHash === postedData.hash;
};

export const paymentSuccess = async (req, res) => {
  const postedData = req.body;
  console.log("Payment Success Data:", postedData);

  // 1. Validate fields exist
  if (!postedData.email || !postedData.txnid || !postedData.amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment data",
    });
  }

  // 2. Verify hash
  if (!verifyPayUHash(postedData)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment data - Hash mismatch",
    });
  }

  try {
    // 3. Find and update only if not already paid
    const updated = await Alumni.findOneAndUpdate(
      { email: postedData.email, isVerified: true, isPaid: false },
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
      return res.status(404).json({
        success: false,
        message: "Alumni not found or already marked as paid",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment successfully verified and recorded",
      data: {
        email: updated.email,
        txnid: updated.paymentTxnId,
        amount: updated.paymentAmount,
        status: updated.paymentStatus,
        date: updated.paymentDate,
      },
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({
      success: true,
      message: "Payment verified but failed to update DB",
      error: err.message,
    });
  }
};

// Failure Callback
export const paymentFailure = async (req, res) => {
  const postedData = req.body;
  console.log("Payment Failure Data:", postedData);

  // Validate and verify hash
  if (!postedData.email || !verifyPayUHash(postedData)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment data - Hash mismatch",
    });
  }

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

    res.status(200).json({
      success: false,
      message: "Payment failed but verified",
      data: {
        email: postedData.email,
        txnid: postedData.txnid,
        amount: postedData.amount,
        status: postedData.status,
        date: new Date(),
      },
    });
  } catch (err) {
    console.error("Error recording failed payment:", err);
    res.status(500).json({
      success: false,
      message: "Error recording failed payment",
      error: err.message,
    });
  }
};

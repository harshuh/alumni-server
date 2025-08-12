import crypto from "crypto";

import { generateHash } from "../utils/payuHash.js";

import { Alumni } from "../models/Alumni/alumniData.model.js";

import { AlumniCard } from "../models/Alumni/alumniCard.model.js";

export const initiatePayment = async (req, res) => {
  try {
    const { email } = req.query;

    const salt = process.env.PayU_MERCHENT_SALT_V2;

    const { hash, params } = await generateHash({ email }, salt);

    const paymentUrl = process.env.ENVIRONMENT_TEST;

    const surl = "https://gbu-alumniserver.vercel.app/api/payment/success";
    const furl = "https://gbu-alumniserver.vercel.app/api/payment/failure";

    res.status(200).json({
      ...params,
      paymentUrl,
      surl,
      furl,
      hash,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      hash: receivedHash,
    } = req.body;

    if (!receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash missing. Possible tampering detected." });
    }

    // PayU hash sequence for response verification
    const salt = process.env.PayU_MERCHENT_SALT_V2;
    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    const calculatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex")
      .toLowerCase();

    // console.log("this is the calculated hash ------>", calculatedHash);
    // console.log("this is the received hash--------->", receivedHash);

    if (calculatedHash !== receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash mismatch. Possible tampering detected." });
    }

    // check for alumni isVerified and isPaid
    const updated = await Alumni.findOneAndUpdate(
      { email: email, isVerified: true, isPaid: false },
      {
        $set: {
          isPaid: true,
          paymentTxnId: txnid,
          paymentAmount: amount,
          paymentStatus: status,
          paymentDate: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Alumni not found or already marked as paid" });
    }

    const shuffleString = (str) => {
      return str
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    };

    // Extract first name (before first space)
    const firstName = updated.alumniName.split(" ")[0].toUpperCase();

    // Extract first and last number parts from roll number
    const rollNo = updated.rollNo;
    const rollParts = rollNo.split("/");
    const numericRollPart = (rollParts[0] || "") + (rollParts[2] || "");

    // Add 2 random uppercase letters
    // const randomLetters = Array.from({ length: 2 }, () =>
    //   String.fromCharCode(65 + Math.floor(Math.random() * 26))
    // ).join("");

    // Combine and scramble
    const combined = `${firstName}${numericRollPart}`;
    const scrambled = shuffleString(combined).toUpperCase();

    // Final card number
    const cardNo = `GBU${scrambled}`;

    await AlumniCard.create({
      alumniId: updated._id,
      schoolId: updated.schoolId,
      cardNo,
    });
    // If hash is valid, return success HTML
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Successful</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              background-color: #f4f8fb;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            h1 {
              color: #2e7d32;
            }
            p {
              color: #555;
            }
          </style>
          <script>
            setTimeout(function() {
              window.location.href = "https://alumni-gbu.vercel.app/alumni/checkStatus";
            }, 3000);
          </script>
        </head>
        <body>
          <div class="card">
            <h1>Payment Successful Kindly Login...</h1>
            <p>Thank you! You will be redirected shortly...</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({ error: "Payment verification failed." });
  }
};

export const handlePaymentFailure = async (req, res) => {
  try {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      hash: receivedHash,
    } = req.body;

    if (!receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash missing. Possible tampering detected." });
    }

    // PayU hash verification sequence (same as success)
    const salt = process.env.PayU_MERCHENT_SALT_V2;
    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    const calculatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex")
      .toLowerCase();

    if (calculatedHash !== receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash mismatch. Possible tampering detected." });
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              background-color: #fff5f5;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            h1 {
              color: #c62828;
            }
            p {
              color: #555;
            }
          </style>
          <script>
            setTimeout(function() {
              window.location.href = "https://alumni-gbu.vercel.app/alumni/payment-failure";
            }, 5000);
          </script>
        </head>
        <body>
          <div class="card">
            <h1>Payment Failed Please don't make a payment for 12hr...</h1>
            <p>Unfortunately, your payment could not be processed.<br>
               You will be redirected shortly...</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    res.status(500).json({ error: "Error handling payment failure." });
  }
};

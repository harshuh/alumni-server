import { generateHash } from "../utils/payuHash.js";
import { verifyPayUHash } from "../utils/verifyHash.js";

import { Alumni } from "../models/Alumni/alumniData.model.js";

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { email } = req.params;
    const salt = process.env.PayU_MERCHENT_SALT_V2;

    const { hash, params } = await generateHash(email, salt);

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

// export const paymentSuccess = async (req, res) => {
//   const postedData = req.body;
//   console.log("//////////////////////////////", req.body.status);
//   console.log("Payment Success Data:", postedData);

//   // 1. Validate fields exist
//   if (!postedData.email || !postedData.txnid || !postedData.amount) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required payment data",
//     });
//   }

//   // 2. Verify hash
//   if (!verifyPayUHash(postedData)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid payment data - Hash mismatch",
//     });
//   }

//   try {
//     // 3. Find and update only if not already paid
//     const updated = await Alumni.findOneAndUpdate(
//       { email: postedData.email, isVerified: true, isPaid: false },
//       {
//         $set: {
//           isPaid: true,
//           paymentTxnId: postedData.txnid,
//           paymentAmount: postedData.amount,
//           paymentStatus: postedData.status,
//           paymentDate: new Date(),
//         },
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Alumni not found or already marked as paid",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Payment successfully verified and recorded",
//       data: {
//         email: updated.email,
//         txnid: updated.paymentTxnId,
//         amount: updated.paymentAmount,
//         status: updated.paymentStatus,
//         date: updated.paymentDate,
//       },
//     });
//   } catch (err) {
//     console.error("Error updating payment status:", err);
//     res.status(500).json({
//       success: true,
//       message: "Payment verified but failed to update DB",
//       error: err.message,
//     });
//   }
// };
// Payment Success
export const paymentSuccess = async (req, res) => {
  // console.log("Incoming Payment Success Data:", req.body);
  // const postedData = req.body;

  // if (!verifyPayUHash(postedData)) {
  //   return res.status(400).send("Invalid hash");
  // }

  // try {
  //   await Alumni.findOneAndUpdate(
  //     { email: postedData.email, isVerified: true, isPaid: false },
  //     {
  //       $set: {
  //         isPaid: true,
  //         paymentTxnId: postedData.txnid,
  //         paymentAmount: postedData.amount,
  //         paymentStatus: postedData.status,
  //         paymentDate: new Date(),
  //       },
  //     }
  //   );
  // } catch (err) {
  //   console.error("Error updating DB:", err);
  // }

  // Redirect to frontend
  res.redirect(`https://alumni-gbu.vercel.app/alumni/home`);
};

// Payment Failure
export const paymentFailure = async (req, res) => {
  console.log("Payment Failure Data:", req.body);
  if (!verifyPayUHash(req.body)) {
    return res.status(400).send("Invalid hash");
  }

  try {
    await Alumni.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          paymentTxnId: req.body.txnid,
          paymentStatus: req.body.status,
          paymentDate: new Date(),
        },
      }
    );
  } catch (err) {
    console.error("Error recording failed payment:", err);
  }

  res.redirect(`https://alumni-gbu.vercel.app/alumni/login`);
};

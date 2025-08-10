import { generateHash } from "../utils/payuHash.js";
import crypto from "crypto";

export const initiatePayment = async (req, res) => {
  try {
    const { email } = req.params;

    const salt = process.env.PayU_MERCHENT_SALT_V2;

    const { hash, params } = await generateHash({ email }, salt);

    const paymentUrl = process.env.ENVIRONMENT_TEST;

    const surl = "https://gbu-alumniserver.vercel.app/api/payu/pay/success";
    const furl = "https://gbu-alumniserver.vercel.app/api/payu/pay/failure";

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

//payment ka controller

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
    req.body;
    console.log("the my bidy that is send by ", req.body);
    const salt = process.env.PayU_MERCHENT_SALT_V2;

    // const hashSequence = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    // const expectedHash = crypto
    //   .createHash("sha512")
    //   .update(hashSequence)
    //   .digest("hex");
    // console.log("xxxxxxxx------xxxxx", expectedHash);
    if (!receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash mismatch. Possible tampering detected." });
    }

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
            window.location.href = "https://www.youtube.com/";
          }, 3000); // Redirect after 3 seconds
        </script>
      </head>
      <body>
        <div class="card">
          <h1>✅ Payment Successful</h1>
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

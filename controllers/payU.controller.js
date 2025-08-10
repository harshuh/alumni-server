import { generateHash } from "../utils/payuHash.js";

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

    console.log("Body of handlePaymentSuccess", req.body);

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

    console.log("this is the calculated hash ------>", calculatedHash);
    console.log("this is the received hash--------->", receivedHash);
    if (calculatedHash !== receivedHash) {
      return res
        .status(400)
        .json({ message: "Hash mismatch. Possible tampering detected." });
    }

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
              window.location.href = "https://alumni-gbu.vercel.app/alumni/payment-success";
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

export const handlePaymentFailure = (req, res) => {
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

    console.log("Body of handlePaymentFailure", req.body);

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
            }, 3000);
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

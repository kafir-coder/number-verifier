import "dotenv/config";
import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = "VA6f15a1907e64e63b1f78f85a44a95743";

const client = twilio(accountSid, authToken);

// Send verification code
app.post("/send-code", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    await client.verify.v2.services(verifySid).verifications.create({
      to: phoneNumber,
      channel: "sms",
    });

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to send verification code", details: String(error) });
  }
});

// Verify code
app.post("/verify-code", async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ error: "Phone number and code are required" });
  }

  try {
    const verification = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: phoneNumber,
      code,
    });

    if (verification.status === "approved") {
      res.status(200).json({ phoneNumber, message: "Phone number verified" });
    } else {
      res.status(400).json({ error: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Verification check error:", error);
    res.status(400).json({ error: "Invalid or expired verification code" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

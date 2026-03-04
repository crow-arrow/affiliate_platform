import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

// Клиент отправляет { referralId, event, amount, currency, orderId, email }
router.post("/conversion", async (req, res) => {
  const { referralId, event, amount, currency, orderId, email } = req.body;

  if (!referralId || !event) {
    return res.status(400).json({ error: "Missing referralId or event" });
  }

  const referralLink = await prisma.referralLink.findUnique({
    where: { slug: referralId },
  });

  if (!referralLink) {
    return res.status(404).json({ error: "Referral link not found" });
  }

  // Создаём событие конверсии
  const conversion = await prisma.conversionEvent.create({
    data: {
      referralId,
      event,
      amount,
      currency,
      orderId,
      email,
    },
  });

  // Можно обновить статус ReferralLink, если хочешь
  await prisma.referralLink.update({
    where: { slug: referralId },
    data: { status: "APPROVED" },
  });

  return res.json({ success: true, conversion });
});

export default router;

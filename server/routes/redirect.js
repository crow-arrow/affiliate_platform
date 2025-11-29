import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const referer = req.get("referer") || null;
  const ip = req.ip;
  const userAgent = req.get("user-agent") || null;

  const referralLink = await prisma.referralLink.findUnique({
    where: { slug },
    include: { profile: true },
  });

  console.log(referralLink);

  if (!referralLink) {
    return res.status(404).send("Referral link not found");
  }

  if (!referralLink?.profile?.affiliateId) {
    return res.status(400).json({ error: "Missing affiliate ID" });
  }

  // Сохраняем клик (если надо)
  await prisma.clicksData.create({
    data: {
      affiliateId: referralLink.profile.affiliateId,
      referer,
      ipAddress: ip,
      userAgent: userAgent,
      referralProfileId: referralLink.profile.id,
      type: "CLICK",
      deviceType: "UNKNOWN", // или вычисли по user-agent
    },
  });

  // Ставим куку
  res.cookie("referral_id", slug, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
  });

  // Редиректим
  const redirectTo =
    referralLink.destinationUrl || "https://default-landing.com";
  return res.redirect(redirectTo);
});

export default router;

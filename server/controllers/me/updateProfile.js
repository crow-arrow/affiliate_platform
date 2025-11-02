import prisma from "../../prisma/client.js";

export const updateUserProfile = async (req, res) => {
  try {
    const identityId = req.user.id;
    const tenantId = req.user.tenantId;
    const { firstName, lastName, phone } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Обновляем Identity (firstName, lastName)
    const identity = await prisma.identity.update({
      where: { id: identityId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
      },
    });

    // Получаем Membership и PartnerProfile
    const membership = await prisma.membership.findUnique({
      where: {
        identityId_tenantId: {
          identityId: identityId,
          tenantId: tenantId,
        },
      },
      include: {
        profile: true,
      },
    });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    // Обновляем PartnerProfile (phone)
    let profile = membership.profile;
    if (phone !== undefined) {
      if (profile) {
        profile = await prisma.partnerProfile.update({
          where: { id: profile.id },
          data: { phone: phone || null },
        });
      } else {
        // Создаем PartnerProfile если его нет
        const affiliateId = `${(
          firstName ||
          identity.firstName ||
          "user"
        ).toLowerCase()}_${Math.floor(Math.random() * 90000 + 10000)}`;
        profile = await prisma.partnerProfile.create({
          data: {
            membershipId: membership.id,
            affiliateId: affiliateId,
            phone: phone || null,
            level: "BRONZE",
          },
        });
      }
    }

    // Возвращаем обновленные данные пользователя
    const safeUser = {
      id: identity.id,
      email: identity.email,
      first_name: identity.firstName || "",
      last_name: identity.lastName || "",
      role: membership.role,
      emailVerified: identity.emailVerified || false,
      tenantId,
      affiliateId: profile?.affiliateId || null,
      phone: profile?.phone || null,
    };

    res
      .status(200)
      .json({ user: safeUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

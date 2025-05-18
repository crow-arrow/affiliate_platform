import ClicksData from "../models/ClicksData.js";

export const SaveClicksData = async (req, res) => {
  try {
    const affiliate_id = req.query.affiliateId;
    const ip_address = req.ip;
    const referrer = req.get("Referrer") || "/";
    const user_agent = req.get("User-Agent") || "unknown";

    // Check if this IP has already clicked for this affiliate
    const existingClick = await ClicksData.findOne({
      where: {
        affiliate_id,
        ip_address,
      },
    });

    let type = "unique";
    if (existingClick) {
      type = "repeat";
    }

    const NewClick = await ClicksData.create({
      affiliate_id,
      type,
      date: new Date(),
      ip_address,
      referrer,
      user_agent,
    });
    return res.status(201).json({
      click: {
        id: NewClick.id,
        date: NewClick.date,
        ip_address: NewClick.ip_address,
        referrer: NewClick.referrer,
        user_agent: NewClick.user_agent,
        type: NewClick.type,
      },
      message: "Click data saved successfully",
    });
  } catch (error) {
    console.error("Error saving click data:", error);
    return res.status(500).json({ message: "Error saving click data" });
  }
};

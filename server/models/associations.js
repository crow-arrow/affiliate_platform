import { User, Trips, LevelHistory, ClicksData } from "./models.js";

User.hasMany(Trips, {
  foreignKey: "affiliate_id",
  sourceKey: "affiliate_id",
  as: "affiliateTrips",
});
User.hasMany(LevelHistory, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "levelHistory",
});
User.hasMany(ClicksData, {
  foreignKey: "referral_user_id",
  sourceKey: "id",
  as: "clicksData",
});

Trips.belongsTo(User, {
  foreignKey: "affiliate_id",
  targetKey: "affiliate_id",
  as: "affiliate",
});

LevelHistory.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
ClicksData.belongsTo(User, {
  foreignKey: "referral_user_id",
  targetKey: "id",
  as: "user",
});

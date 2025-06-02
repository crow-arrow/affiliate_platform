import { User, Trips, LevelHistory, ClicksData } from "./models.js";

User.hasMany(Trips, { foreignKey: "user_id", sourceKey: "id" });
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

import User from "./User.js";
import Trips from "./Trips.js";
import LevelHistory from "./LevelHistory.js";
import ClicksData from "./ClicksData.js";

User.hasMany(Trips, { foreignKey: "user_id", sourceKey: "id" });
User.hasMany(LevelHistory, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "levelHistory",
});
User.hasMany(ClicksData, {
  foreignKey: "affiliate_id",
  sourceKey: "affiliate_id",
  as: "ClicksData",
});

LevelHistory.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
ClicksData.belongsTo(User, {
  foreignKey: "affiliate_id",
  targetKey: "affiliate_id",
  as: "user",
});

export { User, Trips, LevelHistory, ClicksData };

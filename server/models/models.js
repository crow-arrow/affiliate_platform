import User from "./User.js";
import Trips from "./Trips.js";
import LevelHistory from "./LevelHistory.js";

User.hasMany(Trips, { foreignKey: "user_id", sourceKey: "id" });
User.hasMany(LevelHistory, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "levelHistory",
});

LevelHistory.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

export { User, Trips, LevelHistory };

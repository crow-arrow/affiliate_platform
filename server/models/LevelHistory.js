import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const LevelHistory = sequelize.define(
  "LevelHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    level: {
      type: DataTypes.ENUM("Bronze", "Silver", "Gold"),
      allowNull: false,
    },
    changed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "level_history",
    timestamps: false,
  }
);

export default LevelHistory;

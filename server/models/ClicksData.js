import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const ClicksData = sequelize.define(
  "wp_affiliate_analytics",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    affiliate_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    referer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    referral_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    device_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "wp_affiliate_analytics",
    timestamps: false,
    indexes: [
      {
        fields: ["affiliate_id"],
      },
      {
        fields: ["ip_address"],
      },
      {
        fields: ["referral_user_id"],
        name: "fk_referral_user_id",
      },
    ],
  }
);

export default ClicksData;

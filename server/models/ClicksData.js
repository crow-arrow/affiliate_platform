import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const ClicksData = sequelize.define(
  "referral_link_clicks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    affiliate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "affiliate_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referrer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "referral_link_clicks",
    timestamps: false,
    indexes: [
      {
        fields: ["affiliate_id"],
      },
      {
        fields: ["date"],
      },
    ],
  }
);

export default ClicksData;

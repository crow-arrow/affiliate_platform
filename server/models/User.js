import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "refferal_users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affiliate_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Genie",
    },
    level: {
      type: DataTypes.ENUM("Bronze", "Silver", "Gold"),
      defaultValue: "Bronze",
    },
    booked_trips_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    earned_commission: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      default: "../uploads/default-avatar.png",
    },
  },
  { timestamps: true }
);

export default User;

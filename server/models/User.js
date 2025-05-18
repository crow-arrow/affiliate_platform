import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "user",
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
    levelChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    booked_trips_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    current_year_travellers: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
    },
    number_of_travellers: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
    },
    earnings: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    canceled_earnings: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    total_commission: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "referral_users",
  }
);

export default User;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Trips = sequelize.define(
    "wp_tourmaster_order",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        traveller_amount: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
        },
        travel_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        order_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        total_price: {
            type: DataTypes.DECIMAL(19, 2),
            allowNull: false,
        },
        // currency: {
        //     type: DataTypes.TEXT,
        //     allowNull: true,
        // },
        coupon_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        affiliate_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'wp_tourmaster_order',
        timestamps: false
    }
);

export default Trips;